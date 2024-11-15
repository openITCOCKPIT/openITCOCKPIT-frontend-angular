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
import {
    ButtonGroupComponent,
    ColComponent,
    ProgressBarComponent,
    ProgressComponent,
    RowComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { DowntimeIconComponent } from '../../../../../../pages/downtimes/downtime-icon/downtime-icon.component';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { PermissionsService } from '../../../../../../permissions/permissions.service';
import {
    AcknowledgementIconComponent
} from '../../../../../../pages/acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { AcknowledgementTypes } from '../../../../../../pages/acknowledgements/acknowledgement-types.enum';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EvcOperatorComponent } from './evc-operator/evc-operator.component';
import { ConnectionOperator } from './evc-tree.interface'
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    HostSummaryStatusmapComponent
} from '../../../../../../pages/statusmaps/statusmaps-index/host-summary-statusmap/host-summary-statusmap.component';
import { EvcServicestatusToasterService } from './evc-servicestatus-toaster/evc-servicestatus-toaster.service';
import { EvcServicestatusToasterComponent } from './evc-servicestatus-toaster/evc-servicestatus-toaster.component';

// Extend the interface of the dagre-Node to make TypeScript happy when we get the nodes back from getNodes()
interface EvcNode extends dagre.Node {
    evcNode: EvcGraphNode
}

interface EvcGraphNode {
    id: string
    parentId: string | null
    service?: EvcService
    operator?: EventcorrelationOperators | null,
    type: 'service' | 'operator'
}

interface INodeViewModel {
    id: string
    connectorId: string
    position: IPoint,
    evcNode: EvcGraphNode
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

const SERVICE_WIDTH = 150;
const OPERATOR_WIDTH = 100;

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
        EvcOperatorComponent,
        TranslocoPipe,
        RouterLink,
        XsButtonDirective,
        ButtonGroupComponent,
        HostSummaryStatusmapComponent,
        ProgressBarComponent,
        ProgressComponent,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        EvcServicestatusToasterComponent
    ],
    templateUrl: './evc-tree.component.html',
    styleUrl: './evc-tree.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTreeComponent implements AfterViewInit {
    public evcId = input<number>(0);
    public evcTree = input<EvcTree[]>([]);
    public downtimedServices = input<number>(0);
    public stateForDowntimedService = input<number>(3);
    public stateForDisabledService = input<number>(3);

    public downtimeStateTitle: string = '';
    public disabledStateTitle: string = '';

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly EvcServicestatusToasterService = inject(EvcServicestatusToasterService);

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

    private toasterTimeout: any = null;

    constructor() {
        this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph(), this.direction);
            }

            switch (this.stateForDowntimedService()) {
                case 0:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered ok');
                    break;

                case 1:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered warning');
                    break;

                case 2:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered critical');
                    break;

                case 3:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
                    break;
            }

            switch (this.stateForDisabledService()) {
                case 0:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered ok');
                    break;

                case 1:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered warning');
                    break;

                case 2:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered critical');
                    break;

                case 3:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');
                    break;
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

            // nodesep is the vertical distance between the nodes
            // +--------------+
            // |    Node 1    |
            // +--------------+
            // ↑
            // | <- nodesep
            // ↓
            // +--------------+
            // |    Node 2    |
            // +--------------+
            nodesep: 10, // vertical distance between nodes

            // ranksep is the distance between the different layers of the graph
            // --------------------------
            // ↑                        |
            // +--------------+         ↓  <- ranksep
            // |    Layer 1   |         +--------------+
            // +--------------+         |    Layer 2   |
            //                          +--------------+
            //
            ranksep: 50,
            edgesep: 10, // not entirely sure
            marginx: 0,
            marginy: 0,
        });


        nodes.forEach(node => {
            // Add service meta data into dagre.Node (EvcNode)
            graph.setNode(node.id, {
                width: (node.type === 'service') ? SERVICE_WIDTH : OPERATOR_WIDTH,
                height: 38,
                evcNode: node,
            });

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

            let xpos = evcNode.x;
            if (evcNode.evcNode.type === 'operator') {
                // This centers the operator node between the service nodes
                xpos = xpos + (SERVICE_WIDTH - OPERATOR_WIDTH) / 2;
            }

            return {
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: xpos,//evcNode.x,
                    y: evcNode.y
                },
                evcNode: evcNode.evcNode
            }
        });
    }


    private getEvcTreeNodes(evcTree: EvcTree[]): EvcGraphNode[] {
        const nodes: EvcGraphNode[] = [];

        // This method create an array for the EVC Tree (Flow Chart)
        // We reverse the array from the server, so we can connect the services to the operators more easily
        evcTree = evcTree.reverse();

        evcTree.forEach((layer: EvcTree, layerIndex: number) => {
            // EVC Layer in reverse order
            for (const vServiceKey in layer) {
                const vServices = layer[vServiceKey];
                vServices.forEach((vService, vServiceIndex: number) => {
                    nodes.push({
                        id: vService.id.toString(),
                        //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                        parentId: vService.parent_id === null ? null : `${vService.parent_id}_operator`,
                        service: vService.service,
                        type: 'service'
                    });

                    if (vService.operator !== null) {
                        nodes.push({
                            id: `${vService.id}_operator`,
                            parentId: vService.id.toString(),
                            operator: vService.operator,
                            type: 'operator'
                        });
                    }

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
        this.fitToScreen();
    }

    public horizontalRL(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.RIGHT_TO_LEFT);
        this.fitToScreen();
    }

    public verticalTB(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.TOP_TO_BOTTOM);
        this.fitToScreen();
    }

    public verticalBT(): void {
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.BOTTOM_TO_TOP);
        this.fitToScreen();
    }

    public fitToScreen(): void {
        // Disabled for now, as it adds a scale factor to the canvas and "zooms in" on init.
        //return;

        // https://flow.foblex.com/docs/f-canvas-component
        if (this.fCanvasComponent) {
            this.fCanvasComponent.resetScaleAndCenter(false);
            this.fCanvasComponent.position = PointExtensions.initialize(0, 0);

            //this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50), false);
        }
    }

    public resetScaleAndCenter() {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.resetScaleAndCenter(false);
        }
    }

    public toggleToaster(serviceId: number | undefined): void {
        this.cancelToaster();
        if (serviceId) {
            this.toasterTimeout = setTimeout(() => {
                this.EvcServicestatusToasterService.setServiceIdToaster(serviceId);
            }, 500);
        }
    }

    public cancelToaster() {
        if (this.toasterTimeout) {
            clearTimeout(this.toasterTimeout);
        }

        this.toasterTimeout = null;
    }

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly Number = Number;
    protected readonly AcknowledgementTypes = AcknowledgementTypes;
    protected readonly EvcTreeDirection = EvcTreeDirection;
}
