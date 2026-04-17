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
import { AsyncPipe, NgClass } from '@angular/common';
import { ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { PointExtensions } from '@foblex/2d';
import dagre from '@dagrejs/dagre';
import {
    ConnectionOperator,
    HostNode,
    HostParentsChildrenTreeItem,
    INode
} from './host-parents-children-tree.interface';
import { generateGuid } from '@foblex/utils';
import { PermissionsService } from '../../../permissions/permissions.service';

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
        ColComponent,
        FCanvasComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        RowComponent,
        TooltipDirective,
        RouterLink,
        NgClass,
        TranslocoDirective,
    ],
    templateUrl: './host-parents-children-tree.component.html',
    styleUrl: './host-parents-children-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostParentsChildrenTreeComponent {

    //public hostParentsChildrenTree = input<HostParentsChildrenTreeItem[]>();
    public hostParentsChildrenTree = input<HostParentsChildrenTreeItem[]>(
        [
            {
                "id": 217,
                "name": "down host",
                "hoststatus": {
                    "currentState": 0
                },
                "parent_ids": [
                    218,
                    219
                ],
                "isMainHost": true
            },
            {
                "id": 218,
                "name": "down host 2",
                "hoststatus": {
                    "currentState": 0
                },
                "parent_ids": []
            },
            {
                "id": 219,
                "name": "down host 3",
                "hoststatus": {
                    "currentState": 1
                },
                "parent_ids": []
            },
            {
                "id": 114,
                "name": "Fulda Host",
                "hoststatus": {
                    "currentState": 3
                },
                "parent_ids": [
                    217
                ]
            },
            {
                "id": 227,
                "name": "Ein Host mit einem wirklich langem Namen random irgendwas rtfhsrtrtjsrtjdjrtrstjrttrjrtjjtr",
                "hoststatus": {
                    "currentState": 2
                },
                "parent_ids": [
                    217
                ]
            }
        ]
    );

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);

    public configuration = {
        outputSide: EFConnectableSide.RIGHT,
        inputSide: EFConnectableSide.LEFT,
        nodeSep: 10
    };

    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    public nodes: INode[] = [];
    public groupNodes: INode[] = [];
    public connections: ConnectionOperator[] = [];
    public hasParentNodes = false;
    public hasChildrenNodes = false;

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph());
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.isInitialized = true;
            this.updateGraph(new dagre.graphlib.Graph({compound: true}));
            this.cdr.markForCheck();
        });
    }

    private updateGraph(graph: dagre.graphlib.Graph): void {
        this.hasParentNodes = false;
        this.hasChildrenNodes = false;
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.groupNodes = this.getGroupNodes(graph);
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
                ranksep: 50,
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
    private getNodes(graph: dagre.graphlib.Graph): INode[] {
        let nodes: INode[] = [];
        // @ts-ignore
        graph.nodes().forEach((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to HostParentsChildrenNode
            const hostParentsChildrenNode = node as HostParentsChildrenNode;

            if (x != HostParentChildrenTreeGroupIds.PARENT_GROUP && x != HostParentChildrenTreeGroupIds.CHILDREN_GROUP) {
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

    // had to split normal nodes and group nodes in two different arrays, because if statement breaks canvas rendering in html template
    private getGroupNodes(graph: dagre.graphlib.Graph): INode[] {
        let nodes: INode[] = [];
        // @ts-ignore
        graph.nodes().forEach((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to HostParentsChildrenNode
            const hostParentsChildrenNode = node as HostParentsChildrenNode;

            if (x == HostParentChildrenTreeGroupIds.PARENT_GROUP || x == HostParentChildrenTreeGroupIds.CHILDREN_GROUP) {
                nodes.push({
                    id: generateGuid(),
                    connectorId: x,
                    position: {
                        x: hostParentsChildrenNode.x,
                        y: hostParentsChildrenNode.y
                    }
                });
            }
        });
        return nodes;
    }

    private getHostParentChildrenTreeNodes(hostParentChildrenTree: HostParentsChildrenTreeItem[]): HostNode[] {
        const nodes: HostNode[] = [];

        // This method create an array for the HostParentsChildren Tree (Flow Chart)

        hostParentChildrenTree.forEach((hostTreeItem: HostParentsChildrenTreeItem, itemIndex: number) => {

            let parentIds: string[] | null = null;
            if (hostTreeItem.parent_ids.length) {
                parentIds = hostTreeItem.parent_ids.map(parentId => parentId.toString());
            }

            let groupId = undefined;
            //Parent Group
            if (hostTreeItem.parent_ids.length === 0 && hostTreeItem.isMainHost === undefined) {
                groupId = HostParentChildrenTreeGroupIds.PARENT_GROUP;
                this.hasParentNodes = true;
            }
            //Child Group
            if (hostTreeItem.parent_ids.length && hostTreeItem.isMainHost === undefined) {
                groupId = HostParentChildrenTreeGroupIds.CHILDREN_GROUP;
                this.hasChildrenNodes = true;
            }

            nodes.push({
                id: hostTreeItem.id.toString(),
                name: hostTreeItem.name,
                parentIds: parentIds,
                hoststatus: hostTreeItem.hoststatus,
                groupId: groupId
            });

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

    public onLoaded(): void {
        this.fit2screen();
    }

    public fit2screen(): void {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(15, 15), true);
            this.cdr.markForCheck();
        }
    }

    protected readonly HostParentChildrenTreeGroupIds = HostParentChildrenTreeGroupIds;
}
