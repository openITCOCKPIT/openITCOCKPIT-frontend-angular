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
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { ISize } from '@foblex/2d/size/i-size';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../../eventcorrelations.service';

interface OperatorPositionsPerLayer {
    [key: number]: {
        start: number,
        end: number
    }
}

interface LeftSideServiceGroupForOperatorPosition {
    [key: (string | number)]: EvcTreeItem
}

interface EvcGraphNode {
    id: string
    parentId: string | null
    service?: EvcService
    operator?: EventcorrelationOperators | null,
    type: 'service' | 'operator',
    totalHeight?: number, // only for operators
    fNodeParentId?: string,
    position: IPoint,
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
const SERVICE_HEIGHT = 38;

// NODE_SEP is the vertical distance between the nodes
// +--------------+
// |    Node 1    |
// +--------------+
// ↑
// | <- nodesep
// ↓
// +--------------+
// |    Node 2    |
// +--------------+
const NODE_SEP = 10; // vertical distance between nodes


// RANK_SEP is the distance between the different layers of the graph
// --------------------------
// ↑                        |
// +--------------+         ↓  <- RANK_SEP
// |    Layer 1   |         +--------------+
// +--------------+         |    Layer 2   |
//                          +--------------+
//
const RANK_SEP = 50;

const OPERATOR_WIDTH = 100;
const OPERATOR_HEIGHT = SERVICE_HEIGHT;

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
                this.updateGraph();
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
        this.updateGraph();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onLoaded(): void {
        this.fitToScreen();
    }


    private updateGraph(): void {
        if (this.isAutoLayout) {
            if (this.fFlowComponent) {
                this.fFlowComponent.reset();
                // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
            }
        }

        this.nodes = [];
        this.groups = [];
        this.connections = [];

        const nodes = this.getEvcTreeNodes(this.evcTree());
        this.nodes = this.getNodes(nodes);

        this.cdr.markForCheck();
    }

    private getNodes(nodes: EvcGraphNode[]): INodeViewModel[] {
        const result: INodeViewModel[] = [];

        nodes.forEach((node: EvcGraphNode) => {
            result.push({
                id: generateGuid(),
                connectorId: node.id,
                position: node.position,
                evcNode: node
            });
        });

        return result;
    }

    private getEvcTreeNodes(evcTree: EvcTree[]) {
        const nodes: EvcGraphNode[] = [];
        //evcTree = getTestTreeForDevelopment();

        this.nodes = [];
        this.groups = [];
        this.connections = [];

        let Y = 0; // Start at top of the canvas


        const totalLayersCount: any = {};

        evcTree.forEach((evcLayer: EvcTree, layerIndex: number) => {
//            Y = 0; // Reset Y for each layer

            for (const vServiceId in evcLayer) {

                // Calculate the total height of all services for the current part of the correlation
                // We need this to calculate the position of the operator for this correlation
                const totalHeight = evcLayer[vServiceId].length * (SERVICE_HEIGHT + NODE_SEP);

                if (!totalLayersCount.hasOwnProperty(vServiceId)) {
                    totalLayersCount[vServiceId] = {
                        count: evcLayer[vServiceId].length,
                        totalHeight: totalHeight,
                        startY: null
                    };
                }

                evcLayer[vServiceId].forEach((evcTreeItem: EvcTreeItem, serviceIndex: number) => {
                    if (layerIndex === 0) {
                        // First layer services can be placed top to bottom
                        // Also the first layer only contain "real" services and no operators

                        nodes.push({
                            id: evcTreeItem.id.toString(),
                            //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                            parentId: evcTreeItem.parent_id === null ? null : `${evcTreeItem.parent_id}_operator`,
                            service: evcTreeItem.service,
                            type: 'service',
                            position: {
                                x: 0, // First layer services are always at the left side of the canvas
                                y: Y
                            }
                        });

                        // If we are the first service in this "group of services", we save the Y position
                        // so we can calculate the operator position later
                        if (totalLayersCount[vServiceId].startY === null) {
                            console.log(`Layer: ${layerIndex} SAVE Y ${Y}`);
                            totalLayersCount[vServiceId].startY = Y;
                        }

                        // Calculate the Y position for the next first layer service
                        Y = Y + (SERVICE_HEIGHT + NODE_SEP);
                    }

                    if (layerIndex > 0) {
                        // Our Y position is the middle of the total height of all services in the previous layer
                        // ┌----- offsetY
                        // ↓
                        // +--------------+                       ←---------------------┐
                        // |    Node 1    |----------+                                  |
                        // +--------------+          |    +--------------+              |
                        //                           +--- |      AND     |          totalHeight
                        // +--------------+          |    +--------------+              |
                        // |    Node 2    |----------+                                  |
                        // +--------------+                       ←---------------------┘

                        const offsetY = totalLayersCount[evcTreeItem.id.toString()].startY;
                        // Total height if all previous services
                        const totalHeight = totalLayersCount[evcTreeItem.id.toString()].totalHeight;

                        const vServiceY = (totalHeight / 2) - (SERVICE_HEIGHT / 2) + offsetY;
                        const operatorY = (totalHeight / 2) - (OPERATOR_HEIGHT / 2) + offsetY;

                        // Add the operator
                        if (evcTreeItem.operator !== null) {
                            nodes.push({
                                id: `${evcTreeItem.id}_operator`,
                                parentId: evcTreeItem.id.toString(),
                                operator: evcTreeItem.operator,
                                type: 'operator',
                                totalHeight: totalHeight,
                                position: {
                                    x: layerIndex * (SERVICE_WIDTH + RANK_SEP),
                                    y: operatorY
                                }
                            });
                        }

                        // Add the vService
                        nodes.push({
                            id: evcTreeItem.id.toString(),
                            parentId: evcTreeItem.parent_id === null ? null : `${evcTreeItem.parent_id}_operator`,
                            service: evcTreeItem.service,
                            type: 'service',
                            position: {
                                x: layerIndex * (SERVICE_WIDTH + RANK_SEP + OPERATOR_WIDTH + RANK_SEP),
                                y: vServiceY
                            }
                        });

                        // Save the Y position for the next layer of operators / vServices
                        if (evcTreeItem.parent_id !== null) {
                            if (totalLayersCount[evcTreeItem.parent_id.toString()].startY === null) {
                                console.log(`Layer: ${layerIndex} SAVE Y ${vServiceY}`);
                                totalLayersCount[evcTreeItem.parent_id.toString()].startY = vServiceY;
                            }
                        }

                    }
                });


                // for (const evcTreeItem of evcLayer[vServiceId]) { //evcLayer[vServiceId].forEach((evcTreeItem: EvcTreeItem) => {
                //     if (layerIndex > 0) {
                //         //console.log(JSON.stringify(totalLayersCount[vServiceId]));
                //         Y = totalLayersCount[vServiceId].startY + (totalLayersCount[vServiceId].totalHeight / 2) - (OPERATOR_HEIGHT / 2);
                //     }
                //     nodes.push({
                //         id: evcTreeItem.id.toString(),
                //         //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                //         parentId: evcTreeItem.parent_id === null ? null : `${evcTreeItem.parent_id}_operator`,
                //         service: evcTreeItem.service,
                //         type: 'service',
                //         position: {
                //             x: layerIndex * (SERVICE_WIDTH + RANK_SEP),
                //             y: Y + (SERVICE_HEIGHT + NODE_SEP),
                //         }
                //     });

                //     /*  console.log({
                //           layerIndex,
                //           vServiceId,
                //           id: evcTreeItem.id.toString(),
                //           Y
                //       });*/
                //     if (totalLayersCount[vServiceId].startY === null) {
                //         totalLayersCount[vServiceId].vServiceId = vServiceId;
                //         totalLayersCount[vServiceId].layerIndex = layerIndex;
                //         totalLayersCount[vServiceId].id = evcTreeItem.id.toString();
                //         totalLayersCount[vServiceId].startY = Y;
                //         console.log(JSON.stringify(totalLayersCount[vServiceId]));
                //     }


                //     if (evcTreeItem.operator !== null) {
                //         let vServiceCount = totalLayersCount[evcTreeItem.id];
                //         nodes.push({
                //             id: `${evcTreeItem.id}_operator`,
                //             parentId: evcTreeItem.id.toString(),
                //             operator: evcTreeItem.operator,
                //             type: 'operator',
                //             totalHeight: totalHeight,
                //             position: {
                //                 x: layerIndex * (OPERATOR_WIDTH + RANK_SEP) - 30,
                //                 y: Y + (vServiceCount.totalHeight / 2 + (OPERATOR_HEIGHT + NODE_SEP) / 2),
                //             }
                //         });
                //     }

                //     if (evcTreeItem.parent_id !== null) {
                //         this.connections.push({
                //             id: generateGuid(),
                //             from: evcTreeItem.parent_id.toString(),
                //             to: evcTreeItem.id.toString()
                //         });
                //     }

                //     if (layerIndex === 0) {
                //         Y = Y + (SERVICE_HEIGHT + NODE_SEP);
                //     }
                //     //});  // <-- end .foreach
                // } // <-- end for of

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
