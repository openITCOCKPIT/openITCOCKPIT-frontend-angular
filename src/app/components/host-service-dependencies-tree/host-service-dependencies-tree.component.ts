import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { PermissionsService } from '../../permissions/permissions.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    EFConnectableSide,
    EFMarkerType,
    FCanvasComponent,
    FConnectionContent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective,
    provideFFlow,
    withReflowOnResize
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { PointExtensions } from '@foblex/2d';
import {
    ConnectionData,
    HostServiceDependenciesConnectionOperator,
    HostServiceDependenciesINode,
    HostServiceDependenciesTreeItem
} from './host-service-dependencies-tree.interface';
import dagre, { Edge, graphlib, Point } from '@dagrejs/dagre';
import { AsyncPipe, NgClass } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../permissions/permission.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HoststatusIconComponent } from '../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import { ServicestatusIconComponent } from '../services/servicestatus-icon/servicestatus-icon.component';
import { Subscription } from 'rxjs';
import { HostServiceDependenciesTreeService } from './host-service-dependencies-tree.service';

const NODE_WIDTH = 250;
const DIRECTION = 'TB';

interface HostServiceDependenciesNode extends Point {
    dependenciesNode: HostServiceDependenciesTreeItem
}

interface HostServiceDependenciesEdge extends Edge {
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
        PermissionDirective,
        FaIconComponent,
        NgClass,
        HoststatusIconComponent,
        ServicestatusIconComponent,
        TranslocoPipe
    ],
    providers: [provideFFlow(withReflowOnResize())],
    templateUrl: './host-service-dependencies-tree.component.html',
    styleUrl: './host-service-dependencies-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostServiceDependenciesTreeComponent implements OnInit, OnDestroy {

    public hostServiceDependenciesTreeItems: HostServiceDependenciesTreeItem[] = [];

    public hostId = input<number>();
    public serviceId = input<number>();

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();
    private HostServiceDependenciesTreeService = inject(HostServiceDependenciesTreeService)

    public configuration = {
        outputSide: EFConnectableSide.BOTTOM,
        inputSide: EFConnectableSide.TOP,
        nodeSep: 300
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
            this.updateGraphAndFitToScreen();
            this.isInitialized = true;
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        if (this.hostId()) {
            this.subscriptions.add(this.HostServiceDependenciesTreeService.getHostDependencyTree(<number>this.hostId())
                .subscribe((result) => {
                    this.hostServiceDependenciesTreeItems = result;
                    this.updateGraphAndFitToScreen();
                    this.cdr.markForCheck();
                }));
        }
        if (this.serviceId()) {
            this.subscriptions.add(this.HostServiceDependenciesTreeService.getServiceDependencyTree(<number>this.serviceId())
                .subscribe((result) => {
                    this.hostServiceDependenciesTreeItems = result;
                    this.updateGraphAndFitToScreen();
                    this.cdr.markForCheck();
                }));
        }
    }

    private updateGraphAndFitToScreen() {
        this.updateGraph(new dagre.graphlib.Graph());
        if (this.isInitialized) {
            setTimeout(() => {
                // to center the graph after clicking on another host in graph node
                this.fit2screen();
            }, 400);
        }
    }

    private updateGraph(graph: graphlib.Graph): void {
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: graphlib.Graph): void {

        if (this.hostServiceDependenciesTreeItems) {

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


            this.hostServiceDependenciesTreeItems.forEach(node => {
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

    private getNodes(graph: graphlib.Graph): HostServiceDependenciesINode[] {
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

    private getConnections(graph: graphlib.Graph): HostServiceDependenciesConnectionOperator[] {
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

    protected readonly EFMarkerType = EFMarkerType;
}
