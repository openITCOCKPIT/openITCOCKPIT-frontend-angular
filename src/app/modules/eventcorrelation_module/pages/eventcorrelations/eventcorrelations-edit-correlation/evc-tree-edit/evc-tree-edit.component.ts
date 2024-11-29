import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    output,
    ViewChild
} from '@angular/core';
import {
    EvcService,
    EvcToggleModal,
    EvcTree,
    EvcTreeItem,
    EvcVServiceModalMode
} from '../../eventcorrelations.interface';
import { ConnectionOperator } from '../../eventcorrelations-view/evc-tree/evc-tree.interface';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import dagre from '@dagrejs/dagre';
import { generateGuid } from '@foblex/utils';
import { IPoint, PointExtensions } from '@foblex/2d';
import { AsyncPipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { ButtonGroupComponent, ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EvcOperatorComponent } from '../../eventcorrelations-view/evc-tree/evc-operator/evc-operator.component';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../../../permissions/permissions.service';
import { EvcTreeDirection } from '../../eventcorrelations-view/evc-tree/evc-tree.enum';
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { ISize } from '@foblex/2d/size/i-size';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../../eventcorrelations.service';
import { getTestTreeForDevelopment } from './testtree';

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
    fNodeParentId?: string,
    forceX: number,
}

interface EvcGraphGroup {
    id: string
    layerIndex: number
    fGroupSize: ISize
    fGroupPosition: IPoint
}

interface INodeViewModel {
    id: string
    connectorId: string
    position: IPoint,
    evcNode: EvcGraphNode
}

const SERVICE_WIDTH = 150;
const OPERATOR_WIDTH = 100;

/******************************
 * ⚠️ If you make changes to this file, make sure to update the EvcTreeComponent in the eventcorrelations-view folder as well
 ******************************/
@Component({
    selector: 'oitc-evc-tree-edit',
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
        PermissionDirective,
        AsyncPipe,
        TranslocoDirective,
        EvcOperatorComponent,
        TranslocoPipe,
        RouterLink,
        XsButtonDirective,
        ButtonGroupComponent,
    ],
    templateUrl: './evc-tree-edit.component.html',
    styleUrl: './evc-tree-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTreeEditComponent implements AfterViewInit, OnDestroy {
    public evcId = input<number>(0);
    public evcTree = input<EvcTree[]>([]);
    public stateForDisabledService = input<number>(3);

    public toggleVServiceModal = output<EvcToggleModal>();

    public disabledStateTitle: string = '';

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly EventcorrelationsService = inject(EventcorrelationsService);

    public nodes: INodeViewModel[] = [];
    public groups: EvcGraphGroup[] = [];
    public connections: ConnectionOperator[] = [];
    public direction: EvcTreeDirection = EvcTreeDirection.RIGHT_TO_LEFT;

    @ViewChild(FFlowComponent, {static: true})
    public fFlowComponent!: FFlowComponent;
    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    public isAutoLayout: boolean = false;

    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    private subscriptions: Subscription = new Subscription();

    constructor() {
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph(), this.direction);
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

    public ngAfterViewInit(): void {
        this.isInitialized = true;
        this.updateGraph(new dagre.graphlib.Graph(), this.direction);
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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
        const evcTree = [...this.evcTree()]; // create a copy to not modify the original array
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

            //let xpos = evcNode.x;
            let xpos = evcNode.evcNode.forceX;
            if (evcNode.evcNode.type === 'operator') {
                // This centers the operator node between the service nodes
                xpos = xpos + (SERVICE_WIDTH - OPERATOR_WIDTH) / 4;
            }

            return {
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: xpos,//evcNode.x,
                    y: evcNode.y + 30
                },
                evcNode: evcNode.evcNode
            }
        });
    }


    private getEvcTreeNodes(evcTree: EvcTree[]): EvcGraphNode[] {
        const nodes: EvcGraphNode[] = [];
        evcTree = getTestTreeForDevelopment();

        // This method create an array for the EVC Tree (Flow Chart)
        // We reverse the array from the server, so we can connect the services to the operators more easily
        //evcTree = evcTree.reverse();
        this.groups = [];
        let firstLayerCounter = 0;


        evcTree.forEach((layer: EvcTree, layerIndex: number) => {
            // EVC Layer in reverse order
            this.groups.push({
                id: 'layer' + layerIndex.toString(),
                layerIndex: layerIndex,
                fGroupSize: {
                    width: 180,
                    height: 50
                },
                fGroupPosition: {
                    x: layerIndex * 350 + 60,
                    y: 0
                }
            });

            for (const vServiceKey in layer) {
                const vServices = layer[vServiceKey];

                vServices.forEach((vService, vServiceIndex: number) => {
                    nodes.push({
                        id: vService.id.toString(),
                        //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                        parentId: vService.parent_id === null ? null : `${vService.parent_id}_operator`,
                        service: vService.service,
                        type: 'service',
                        fNodeParentId: 'layer' + layerIndex.toString(),
                        forceX: layerIndex * 350 + 60
                    });

                    if (vService.operator !== null) {
                        nodes.push({
                            id: `${vService.id}_operator`,
                            parentId: vService.id.toString(),
                            operator: vService.operator,
                            type: 'operator',
                            forceX: layerIndex * 350 + 60
                        });
                    }
                    if (layerIndex === 0 && vService.operator === null) {
                        firstLayerCounter++;
                    }

                });
            }
        });

        _.forEach(this.groups, (group) => {
            group.fGroupSize.height = (50 * firstLayerCounter) + 50;
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

    public toggleVServiceModalFunc(layerIndex: number, mode: EvcVServiceModalMode, eventCorrelation?: EvcTreeItem) {
        this.toggleVServiceModal.emit({
            layerIndex: layerIndex,
            mode: mode,
            eventCorrelation: eventCorrelation
        });
    }

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly Number = Number;
    protected readonly EFConnectableSide = EFConnectableSide;
}
