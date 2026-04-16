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
import { TranslocoService } from '@jsverse/transloco';
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
        NgClass
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
                ]
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

    @ViewChild(FFlowComponent, {static: true})
    public fFlowComponent!: FFlowComponent;
    @ViewChild(FCanvasComponent, {static: true})
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
    public connections: ConnectionOperator[] = [];

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph());
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.isInitialized = true;
            this.updateGraph(new dagre.graphlib.Graph());
            this.cdr.markForCheck();
        });
    }

    private updateGraph(graph: dagre.graphlib.Graph): void {
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
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


            nodes.forEach(node => {
                // Add service meta data into dagre.Node (HostParentsChildrenNode)
                graph.setNode(node.id, {
                    width: NODE_WIDTH,
                    height: 38,
                    hostNode: node,
                });

                if (node.parentIds != null) {
                    node.parentIds.forEach(parentId => {
                        graph.setEdge(parentId, node.id, {});
                    });
                }
            });


            dagre.layout(graph);
        }
    }

    private getNodes(graph: dagre.graphlib.Graph): INode[] {
        return graph.nodes().map((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to HostParentsChildrenNode
            const hostParentsChildrenNode = node as HostParentsChildrenNode;

            return {
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: hostParentsChildrenNode.x,
                    y: hostParentsChildrenNode.y
                },
                hostNode: hostParentsChildrenNode.hostNode
            }
        });
    }

    private getHostParentChildrenTreeNodes(hostParentChildrenTree: HostParentsChildrenTreeItem[]): HostNode[] {
        const nodes: HostNode[] = [];

        // This method create an array for the HostParentsChildren Tree (Flow Chart)

        hostParentChildrenTree.forEach((hostTreeItem: HostParentsChildrenTreeItem, itemIndex: number) => {

            let parentIds: string[] | null = null;
            if (hostTreeItem.parent_ids.length) {
                parentIds = hostTreeItem.parent_ids.map(parentId => parentId.toString());
            }

            nodes.push({
                id: hostTreeItem.id.toString(),
                name: hostTreeItem.name,
                parentIds: parentIds,
                hoststatus: hostTreeItem.hoststatus
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
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(0, 0), true);
            this.cdr.markForCheck();
        }
    }

}
