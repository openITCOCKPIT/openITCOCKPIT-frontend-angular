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
import { PermissionsService } from '../../permissions/permissions.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    EFConnectableSide,
    FCanvasComponent,
    FConnectionContent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { PointExtensions } from '@foblex/2d';
import {
    ConnectionData,
    HostServiceDependenciesConnectionOperator,
    HostServiceDependenciesINode,
    HostServiceDependenciesTreeItem
} from './host-service-dependencies-tree.interface';
import dagre from '@dagrejs/dagre';
import { AsyncPipe } from '@angular/common';
import { RowComponent, TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';

const NODE_WIDTH = 150;
const DIRECTION = 'TB';

interface HostServiceDependenciesNode extends dagre.Node {
    dependenciesNode: HostServiceDependenciesTreeItem
}

interface HostServiceDependenciesEdge extends dagre.Edge {
    connectionData: ConnectionData
}

@Component({
    selector: 'oitc-host-service-dependencies-tree',
    imports: [
        AsyncPipe,
        FCanvasComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        TooltipDirective,
        RouterLink,
        TranslocoDirective,
        FConnectionContent,
        RowComponent
    ],
    templateUrl: './host-service-dependencies-tree.component.html',
    styleUrl: './host-service-dependencies-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostServiceDependenciesTreeComponent {

    public hostServiceDependenciesTree = input<HostServiceDependenciesTreeItem[]>(
        [
            {
                id: 4,
                name: "noch ein host",
                connectionData: [
                    {
                        parentIds: [1],
                        dependency_id: 5,
                        inherits_parent: 0,
                        timeperiod_id: null,
                        execution_fail_on_up: 1,
                        execution_fail_on_down: 1,
                        execution_fail_on_unreachable: 1,
                        execution_fail_on_pending: 1,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        timeperiod: null
                    }
                ]
            },
            {
                id: 157,
                name: "Apache Test",
                connectionData: [
                    {
                        parentIds: [201],
                        dependency_id: 6,
                        inherits_parent: 0,
                        timeperiod_id: null,
                        execution_fail_on_up: 1,
                        execution_fail_on_down: 1,
                        execution_fail_on_unreachable: 1,
                        execution_fail_on_pending: 1,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        timeperiod: null
                    },
                    {
                        parentIds: [1],
                        dependency_id: 7,
                        inherits_parent: 0,
                        timeperiod_id: null,
                        execution_fail_on_up: 1,
                        execution_fail_on_down: 1,
                        execution_fail_on_unreachable: 1,
                        execution_fail_on_pending: 1,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        timeperiod: null
                    }
                ]
            },
            {
                id: 1,
                name: "default host",
                connectionData: [
                    {
                        parentIds: [201],
                        dependency_id: 6,
                        inherits_parent: 0,
                        timeperiod_id: null,
                        execution_fail_on_up: 1,
                        execution_fail_on_down: 1,
                        execution_fail_on_unreachable: 1,
                        execution_fail_on_pending: 1,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        timeperiod: null
                    }
                ]
            },
            {
                id: 201,
                name: "Prio 2"
            },
        ]
    );

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);

    public configuration = {
        outputSide: EFConnectableSide.BOTTOM,
        inputSide: EFConnectableSide.TOP,
        nodeSep: 120
    };

    public nodes: HostServiceDependenciesINode[] = [];
    public connections: HostServiceDependenciesConnectionOperator[] = [];

    private isInitialized = false;

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            if (this.isInitialized) {
                this.updateGraph(new dagre.graphlib.Graph());
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.updateGraph(new dagre.graphlib.Graph());
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

    private updateGraph(graph: dagre.graphlib.Graph): void {
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: dagre.graphlib.Graph): void {

        const hostServiceDependenciesTreeItems = this.hostServiceDependenciesTree();

        if (hostServiceDependenciesTreeItems) {

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


            hostServiceDependenciesTreeItems.forEach(node => {
                // Add meta data into dagre.Node (HostServiceDependenciesNode)
                graph.setNode(node.id.toString(), {
                    width: NODE_WIDTH,
                    height: 38,
                    dependenciesNode: node,
                });

                if (node.connectionData) {
                    for (let connectionKey in node.connectionData) {
                        node.connectionData[connectionKey].parentIds.forEach(parentId => {
                            // add meta data into connections to build fConnectionContent in the template
                            graph.setEdge(parentId.toString(), node.id.toString(), {
                                connectionData: node.connectionData![connectionKey]
                            });
                        });
                    }
                }
            });


            dagre.layout(graph);
        }
    }

    private getNodes(graph: dagre.graphlib.Graph): HostServiceDependenciesINode[] {
        let nodes: HostServiceDependenciesINode[] = [];

        graph.nodes().forEach((x: any) => {
            let node = graph.node(x);

            // Cast the dagre.Node to HostServiceDependenciesNode
            const hostServiceDependenciesNode = node as HostServiceDependenciesNode;

            nodes.push({
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: hostServiceDependenciesNode.x,
                    y: hostServiceDependenciesNode.y
                },
                dependenciesNode: hostServiceDependenciesNode.dependenciesNode
            });
        });
        return nodes;
    }

    private getConnections(graph: dagre.graphlib.Graph): HostServiceDependenciesConnectionOperator[] {
        let edges: HostServiceDependenciesConnectionOperator[] = [];

        graph.edges().forEach((x: any) => {
            let edge = graph.edge(x)

            // Cast the dagre.Edge to HostServiceDependenciesEdge
            const hostServiceDependenciesEdge = edge as HostServiceDependenciesEdge;

            edges.push({
                id: generateGuid(),
                from: x.v,
                to: x.w,
                connectionData: hostServiceDependenciesEdge.connectionData
            });

        });
        return edges;
    }

    public fit2screen(): void {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(15, 15), true);
            this.cdr.markForCheck();
        }
    }

}
