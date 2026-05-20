import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    ViewChild
} from '@angular/core';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import {
    EFConnectableSide, EFMarkerType,
    FCanvasComponent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective,
    provideFFlow,
    withReflowOnResize
} from '@foblex/flow';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import dagre, { Edge, graphlib, Point } from '@dagrejs/dagre';
import { ConnectionOperator, HostParentsChildrenTree, INode, NodeData } from './host-parents-children-tree.interface';
import { generateGuid } from '@foblex/utils';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HoststatusIconComponent } from '../../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PointExtensions } from '@foblex/2d';

const NODE_WIDTH = 150;
const DIRECTION = 'LR';

interface HostParentsChildrenNode extends Point {
    nodeData: NodeData
}

export enum HostParentChildrenTreeGroupIds {
    PARENT_GROUP = "hostParentGroup",
    CHILDREN_GROUP = "hostChildrenGroup"
}

@Component({
    selector: 'oitc-host-parents-children-tree',
    imports: [
        AsyncPipe,
        FCanvasComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        TooltipDirective,
        RouterLink,
        NgClass,
        TranslocoDirective,
        HoststatusIconComponent,
        FaIconComponent,
        TitleCasePipe,
    ],
    providers: [provideFFlow(withReflowOnResize())],
    templateUrl: './host-parents-children-tree.component.html',
    styleUrl: './host-parents-children-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostParentsChildrenTreeComponent {

    public hostParentsChildrenTree = input<HostParentsChildrenTree>();

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);

    public configuration = {
        outputSide: EFConnectableSide.RIGHT,
        inputSide: EFConnectableSide.LEFT,
        nodeSep: 120
    };

    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    public nodes: INode[] = [];
    public groupNodes: INode[] = [];
    public connections: ConnectionOperator[] = [];

    public lastCheckString = this.TranslocoService.translate('Last check');
    public inDowntimeString = this.TranslocoService.translate('In downtime');
    public isAcknowledgedString = this.TranslocoService.translate('Acknowledged');
    public isAcknowledgedAndInDowntimeString = this.TranslocoService.translate('Acknowledged and in downtime');
    protected readonly EFMarkerType = EFMarkerType;

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph({compound: true}));
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.updateGraph(new dagre.graphlib.Graph({compound: true}));
            if (this.isInitialized) {
                setTimeout(() => {
                    // to center the graph after clicking on another host in graph node
                    this.fit2screen();
                }, 400);
            }
            this.isInitialized = true;
            this.cdr.markForCheck();
        });
    }

    private updateGraph(graph: graphlib.Graph): void {
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.groupNodes = this.getNodes(graph, true);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: graphlib.Graph): void {

        const hostParentsChildrenTree = this.hostParentsChildrenTree();

        if (hostParentsChildrenTree) {
            const treeItems = hostParentsChildrenTree;

            // https://github.com/dagrejs/dagre/wiki#configuring-the-layout
            graph.setGraph({
                rankdir: DIRECTION,

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
                //nodesep: 10, // vertical distance between nodes
                nodesep: this.configuration.nodeSep, // vertical distance between nodes - dynamic based on direction

                // ranksep is the distance between the different layers of the graph
                // --------------------------
                // ↑                        |
                // +--------------+         ↓  <- ranksep
                // |    Layer 1   |         +--------------+
                // +--------------+         |    Layer 2   |
                //                          +--------------+
                //
                ranksep: 300,
                edgesep: 10, // not entirely sure
                marginx: 0,
                marginy: 0,
            });


            for (let hostUuid in treeItems) {
                const node = treeItems[hostUuid];

                // Add service meta data into dagre.Node (HostParentsChildrenNode)
                graph.setNode(node.id.toString(), {
                    width: NODE_WIDTH,
                    height: 38,
                    nodeData: node,
                });

                graph.setParent(node.id.toString(), node.groupId);

                if (node.parentIds) {
                    node.parentIds.forEach(parentId => {
                        graph.setEdge(parentId.toString(), node.id.toString(), {});
                    });
                }
            }

            dagre.layout(graph);
        }
    }

    // had to split normal nodes and group nodes in two different arrays, because if statement breaks canvas rendering in html template
    private getNodes(graph: graphlib.Graph, isGroupNodes: boolean = false): INode[] {
        let nodes: INode[] = [];

        graph.nodes().forEach((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to HostParentsChildrenNode
            const hostParentsChildrenNode = node as HostParentsChildrenNode;

            if ((!isGroupNodes && x != HostParentChildrenTreeGroupIds.PARENT_GROUP && x != HostParentChildrenTreeGroupIds.CHILDREN_GROUP) ||
                (isGroupNodes && (x == HostParentChildrenTreeGroupIds.PARENT_GROUP || x == HostParentChildrenTreeGroupIds.CHILDREN_GROUP))) {
                nodes.push({
                    id: generateGuid(),
                    connectorId: x,
                    position: {
                        x: hostParentsChildrenNode.x,
                        y: hostParentsChildrenNode.y
                    },
                    nodeData: hostParentsChildrenNode.nodeData
                });
            }
        });
        return nodes;
    }

    private getConnections(graph: graphlib.Graph): ConnectionOperator[] {
        return graph.edges().map((x: Edge) => {
            return {
                id: generateGuid(),
                from: x.v,
                to: x.w
            }
        });
    }

    public fit2screen(): void {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(15, 15), true);
            this.cdr.markForCheck();
        }
    }
}
