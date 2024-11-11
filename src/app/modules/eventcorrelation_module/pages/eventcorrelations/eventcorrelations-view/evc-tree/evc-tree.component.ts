import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    ViewChild
} from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import * as dagre from "@dagrejs/dagre"
import { IPoint, PointExtensions } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { EvcTreeDirection } from './evc-tree.enum';
import { EvcService, EvcTree } from '../../eventcorrelations.interface';
import { AsyncPipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { DowntimeIconComponent } from '../../../../../../pages/downtimes/downtime-icon/downtime-icon.component';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { PermissionsService } from '../../../../../../permissions/permissions.service';
import {
    AcknowledgementIconComponent
} from '../../../../../../pages/acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { AcknowledgementTypes } from '../../../../../../pages/acknowledgements/acknowledgement-types.enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { EvcOperatorComponent } from './evc-operator/evc-operator.component';
import { ConnectionOperator } from './evc-tree.interface'

interface EvcNode extends dagre.Node {
    service: EvcService
}

interface EvcGraphNode {
    id: string
    parentId: string | null
    service: EvcService
}

interface INodeViewModel {
    id: string
    connectorId: string
    position: IPoint,
    service?: EvcService
}


const CONFIGURATION = {
    [EvcTreeDirection.LEFT_TO_RIGHT]: {
        outputSide: EFConnectableSide.RIGHT,
        inputSide: EFConnectableSide.LEFT
    },
    [EvcTreeDirection.TOP_TO_BOTTOM]: {
        outputSide: EFConnectableSide.BOTTOM,
        inputSide: EFConnectableSide.TOP
    },
    [EvcTreeDirection.RIGHT_TO_LEFT]: {
        outputSide: EFConnectableSide.LEFT,
        inputSide: EFConnectableSide.RIGHT
    },
    [EvcTreeDirection.BOTTOM_TO_TOP]: {
        outputSide: EFConnectableSide.TOP,
        inputSide: EFConnectableSide.BOTTOM
    }
};

@Component({
    selector: 'oitc-evc-tree',
    standalone: true,
    imports: [
        FFlowModule,
        NgClass,
        JsonPipe,
        RowComponent,
        ColComponent,
        NgIf,
        TooltipDirective,
        FaIconComponent,
        DowntimeIconComponent,
        PermissionDirective,
        AsyncPipe,
        AcknowledgementIconComponent,
        TranslocoDirective,
        EvcOperatorComponent
    ],
    templateUrl: './evc-tree.component.html',
    styleUrl: './evc-tree.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTreeComponent implements AfterViewInit {
    public evcId = input<number>(0);
    public evcTree = input<EvcTree[]>([]);

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    public nodes: INodeViewModel[] = [];
    public connections: ConnectionOperator[] = [];
    public direction: EvcTreeDirection = EvcTreeDirection.RIGHT_TO_LEFT;
    public configuration = CONFIGURATION[EvcTreeDirection.RIGHT_TO_LEFT];

    @ViewChild(FFlowComponent, {static: true})
    public fFlowComponent!: FFlowComponent;
    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    public isAutoLayout: boolean = false;


    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph(), this.direction);
            }
        });
    }

    public ngAfterViewInit() {
        this.isInitialized = true;
        this.updateGraph(new dagre.graphlib.Graph(), this.direction);
    }

    public onLoaded(): void {
        this.fitToScreen();
    }


    private updateGraph(graph: dagre.graphlib.Graph, direction: EvcTreeDirection): void {
        if (this.isAutoLayout) {
            if (this.fFlowComponent) {
                this.fFlowComponent.reset();
                // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
            }
        }

        this.setGraph(graph, direction);
        this.nodes = this.getNodes(graph);
        this.connections = this.getConnections(graph);

        this.cdr.markForCheck();
    }

    private setGraph(graph: dagre.graphlib.Graph, direction: EvcTreeDirection): void {
        this.configuration = CONFIGURATION[direction];

        const evcTree = this.evcTree();
        const nodes = this.getEvcTreeNodes(evcTree);

        // https://github.com/dagrejs/dagre/wiki#configuring-the-layout
        graph.setGraph({
            rankdir: direction,
            nodesep: 10,
            ranksep: 50,
            edgesep: 10
        });


        nodes.forEach(node => {
            // Add service meta data into dagre.Node (EvcNode)
            graph.setNode(node.id, {width: 150, height: 38, service: node.service});
            if (node.parentId != null) {
                graph.setEdge(node.parentId, node.id, {});
            }
        });


        dagre.layout(graph);
    }

    private getNodes(graph: dagre.graphlib.Graph): INodeViewModel[] {
        return graph.nodes().map((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to EvcNode
            const evcNode = node as EvcNode;

            return {
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: evcNode.x,
                    y: evcNode.y
                },
                service: evcNode.service
            }
        });
    }


    private getEvcTreeNodes(evcTree: EvcTree[]): EvcGraphNode[] {
        const nodes: EvcGraphNode[] = [];

        evcTree.forEach((layer: EvcTree, layerIndex: number) => {
            for (const vServiceKey in layer) {
                // "Real" services if layerIndex == 0, otherwise virtual services
                const vServices = layer[vServiceKey];
                vServices.forEach((vService, vServiceIndex: number) => {
                    nodes.push({
                        id: vService.id.toString(),
                        parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                        service: vService.service
                    });
                });
            }
        });

        return nodes;
    }


    private getConnections(graph: dagre.graphlib.Graph): ConnectionOperator[] {
        return graph.edges().map((x: dagre.Edge) => {
            return {
                id: generateGuid(),
                from: x.v,
                to: x.w
            }
        });
    }

    public horizontalLR(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.LEFT_TO_RIGHT);
    }

    public horizontalRL(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.RIGHT_TO_LEFT);
    }

    public verticalTB(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.TOP_TO_BOTTOM);
    }

    public verticalBT(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.BOTTOM_TO_TOP);
    }

    public fitToScreen(): void {
        // Disabled for now, as it adds a scale factor to the canvas and "zooms in" on init.
        return;

        // https://flow.foblex.com/docs/f-canvas-component
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50), false);
        }
    }

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly Number = Number;
    protected readonly AcknowledgementTypes = AcknowledgementTypes;
}
