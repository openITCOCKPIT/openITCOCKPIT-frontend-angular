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
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import dagre from '@dagrejs/dagre';
import { ConnectionOperator, HostNode, HostParentsChildrenTree, INode } from './host-parents-children-tree.interface';
import { generateGuid } from '@foblex/utils';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HoststatusIconComponent } from '../../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

const NODE_WIDTH = 150;
const DIRECTION = 'LR';

interface HostParentsChildrenNode extends dagre.Node {
    hostNode: HostNode
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
    templateUrl: './host-parents-children-tree.component.html',
    styleUrl: './host-parents-children-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostParentsChildrenTreeComponent {

    public hostParentsChildrenTree = input<HostParentsChildrenTree>();

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;
    @ViewChild(FFlowComponent)
    public fFlowComponent!: FFlowComponent;

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
    public hasParentNodes = false;
    public hasChildrenNodes = false;

    public lastCheckString = this.TranslocoService.translate('Last check');
    public inDowntimeString = this.TranslocoService.translate('In downtime');
    public isAcknowledgedString = this.TranslocoService.translate('Acknowledged');
    public isAcknowledgedAndInDowntimeString = this.TranslocoService.translate('Acknowledged and in downtime');

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph({compound: true}));
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.isInitialized = true;
            this.updateGraph(new dagre.graphlib.Graph({compound: true}));
            setTimeout(() => {
                // to center the graph after clicking on another host in graph node
                this.centerMainHost2screen();
            }, 400);
            this.cdr.markForCheck();
        });
    }

    private updateGraph(graph: dagre.graphlib.Graph): void {
        this.hasParentNodes = false;
        this.hasChildrenNodes = false;
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.groupNodes = this.getNodes(graph, true);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: dagre.graphlib.Graph): void {

        const hostParentsChildrenTree = this.hostParentsChildrenTree();

        if (hostParentsChildrenTree) {
            const nodes = this.getHostParentChildrenTreeNodes(hostParentsChildrenTree);

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

            if (this.hasParentNodes) {
                graph.setNode(HostParentChildrenTreeGroupIds.PARENT_GROUP, {width: 1, height: 1});
            }
            if (this.hasChildrenNodes) {
                graph.setNode(HostParentChildrenTreeGroupIds.CHILDREN_GROUP, {width: 1, height: 1});
            }


            nodes.forEach(node => {
                // Add service meta data into dagre.Node (HostParentsChildrenNode)
                graph.setNode(node.id, {
                    width: NODE_WIDTH,
                    height: 38,
                    hostNode: node,
                });

                graph.setParent(node.id, node.groupId);

                if (node.parentIds != null) {
                    node.parentIds.forEach(parentId => {
                        graph.setEdge(parentId, node.id, {});
                    });
                }
            });


            dagre.layout(graph);
        }
    }

    // had to split normal nodes and group nodes in two different arrays, because if statement breaks canvas rendering in html template
    private getNodes(graph: dagre.graphlib.Graph, isGroupNodes: boolean = false): INode[] {
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
                    hostNode: hostParentsChildrenNode.hostNode
                });
            }
        });
        return nodes;
    }

    private getHostParentChildrenTreeNodes(hostParentChildrenTree: HostParentsChildrenTree): HostNode[] {
        const nodes: HostNode[] = [];

        // This method create an array for the HostParentsChildren Tree (Flow Chart)

        for (let hostUuid in hostParentChildrenTree) {

            let hostTreeItem = hostParentChildrenTree[hostUuid];

            let parentIds: string[] | null = null;
            if (hostTreeItem.parentIds.length) {
                parentIds = hostTreeItem.parentIds.map(parentId => parentId.toString());
            }

            let groupId = undefined;
            //Parent Group
            if (hostTreeItem.parentIds.length === 0 && hostTreeItem.isMainHost === undefined) {
                groupId = HostParentChildrenTreeGroupIds.PARENT_GROUP;
                this.hasParentNodes = true;
            }
            //Child Group
            if (hostTreeItem.parentIds.length && hostTreeItem.isMainHost === undefined) {
                groupId = HostParentChildrenTreeGroupIds.CHILDREN_GROUP;
                this.hasChildrenNodes = true;
            }

            nodes.push({
                id: hostTreeItem.id.toString(),
                name: hostTreeItem.name,
                parentIds: parentIds,
                hoststatus: hostTreeItem.hoststatus,
                groupId: groupId,
                is_satellite_host: hostTreeItem.is_satellite_host,
                isAcknowledged: hostTreeItem.isAcknowledged,
                isInDowntime: hostTreeItem.isInDowntime
            });

        }

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

    public centerMainHost2screen(): void {
        if (this.fCanvasComponent && this.fFlowComponent) {
            let mainHostId = "";
            // get main Host node Id from state, because fFlow changes the IDs after rendering
            this.fFlowComponent.getState().nodes.forEach(renderedNode => {
                //main Host node is the only node without a parent, because it has no group attached
                if (renderedNode.parentId === undefined) {
                    mainHostId = renderedNode.id;
                }
            });
            if (mainHostId) {
                this.fCanvasComponent.resetScaleAndCenter(true);
                this.fCanvasComponent.centerGroupOrNode(mainHostId, true);
            }
            this.cdr.markForCheck();
        }
    }

    protected readonly HostParentChildrenTreeGroupIds = HostParentChildrenTreeGroupIds;
}
