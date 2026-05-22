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
export class HostServiceDependenciesTreeComponent {

    public hostServiceDependenciesTree = input<HostServiceDependenciesTreeItem[]>(
        /*[
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
                        execution_none: 0,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        notification_none: 0,
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
                        timeperiod_id: 2,
                        execution_fail_on_up: 1,
                        execution_fail_on_down: 1,
                        execution_fail_on_unreachable: 1,
                        execution_fail_on_pending: 1,
                        execution_none: 0,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        notification_none: 0,
                        timeperiod: {
                            "id": 2,
                            "name": "none"
                        }
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
                        execution_none: 0,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        notification_none: 0,
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
                        execution_none: 0,
                        notification_fail_on_up: 1,
                        notification_fail_on_down: 1,
                        notification_fail_on_unreachable: 1,
                        notification_fail_on_pending: 1,
                        notification_none: 0,
                        timeperiod: null
                    }
                ]
            },
            {
                id: 201,
                name: "Prio 2"
            },
        ]*/

        [
            {
                id: 11,
                servicename: "noch ein host/Disk usage /",
                connectionData: [
                    {
                        parentIds: [2],
                        dependency_id: 8,
                        inherits_parent: 0,
                        timeperiod_id: 25,
                        execution_fail_on_ok: 1,
                        execution_fail_on_warning: 1,
                        execution_fail_on_unknown: 1,
                        execution_fail_on_critical: 1,
                        execution_fail_on_pending: 1,
                        execution_none: 0,
                        notification_fail_on_ok: 1,
                        notification_fail_on_warning: 1,
                        notification_fail_on_unknown: 1,
                        notification_fail_on_critical: 1,
                        notification_fail_on_pending: 1,
                        notification_none: 0,
                        timeperiod: {
                            id: 25,
                            name: "UsedBy Test"
                        }
                    }
                ],
                servicestatus: {
                    currentState: 0,
                    isFlapping: false,
                    problemHasBeenAcknowledged: false,
                    scheduledDowntimeDepth: 0,
                    lastCheck: "8 minutes ago",
                    nextCheck: "21 minutes",
                    activeChecksEnabled: 1,
                    lastHardStateChange: "2Y 4M 10D 19h 44m 48s",
                    last_state_change: "2Y 4M 10D 19h 44m 48s",
                    processPerformanceData: true,
                    state_type: 1,
                    acknowledgement_type: 0,
                    flap_detection_enabled: false,
                    notifications_enabled: true,
                    current_check_attempt: 1,
                    output: "DISK OK - free space: / 13326MiB (22,2% inode=83%):",
                    long_output: "",
                    perfdata: "/=48835330048B;52963993190;59584492339;0;66204991488",
                    latency: 0.52605801820755,
                    max_check_attempts: 2,
                    last_time_ok: "13:02:06 - 22.05.2026",
                    lastHardStateChangeInWords: "2Y 4M 10D 19h 44m 48s",
                    last_state_change_in_words: "2Y 4M 10D 19h 44m 48s",
                    lastCheckInWords: "8 minutes ago",
                    nextCheckInWords: "21 minutes",
                    isHardstate: true,
                    isInMonitoring: true,
                    humanState: "ok",
                    cssClass: "bg-ok",
                    textClass: "ok",
                    outputHtml: "DISK OK - free space: / 13326MiB (22,2% inode=83%):",
                    lastHardStateChangeUser: "16:26:03 - 11.01.2024",
                    last_state_change_user: "16:26:03 - 11.01.2024",
                    lastCheckUser: "13:02:06 - 22.05.2026",
                    nextCheckUser: "13:32:06 - 22.05.2026",
                    longOutputHtml: ""
                }
            },
            {
                id: 2,
                servicename: "default host/Disk usage /",
                servicestatus: {
                    currentState: 0,
                    isFlapping: false,
                    problemHasBeenAcknowledged: false,
                    scheduledDowntimeDepth: 0,
                    lastCheck: "25 minutes ago",
                    nextCheck: "4 minutes",
                    activeChecksEnabled: 1,
                    lastHardStateChange: "2Y 2M 1D 1h 31m 49s",
                    last_state_change: "2Y 2M 1D 1h 31m 49s",
                    processPerformanceData: true,
                    state_type: 1,
                    acknowledgement_type: 0,
                    flap_detection_enabled: false,
                    notifications_enabled: true,
                    current_check_attempt: 1,
                    output: "DISK OK - free space: / 13329MiB (22,3% inode=83%):",
                    long_output: "",
                    perfdata: "/=48832184320B;52963993190;59584492339;0;66204991488",
                    latency: 0.91742998361588,
                    max_check_attempts: 2,
                    last_time_ok: "12:35:05 - 22.05.2026",
                    lastHardStateChangeInWords: "2Y 2M 1D 1h 31m 49s",
                    last_state_change_in_words: "2Y 2M 1D 1h 31m 49s",
                    lastCheckInWords: "25 minutes ago",
                    nextCheckInWords: "4 minutes",
                    isHardstate: true,
                    isInMonitoring: true,
                    humanState: "ok",
                    cssClass: "bg-ok",
                    textClass: "ok",
                    outputHtml: "DISK OK - free space: / 13329MiB (22,3% inode=83%):",
                    lastHardStateChangeUser: "10:28:20 - 22.03.2024",
                    last_state_change_user: "10:28:20 - 22.03.2024",
                    lastCheckUser: "12:35:05 - 22.05.2026",
                    nextCheckUser: "13:05:05 - 22.05.2026",
                    longOutputHtml: ""
                }
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

    private updateGraph(graph: graphlib.Graph): void {
        this.setGraph(graph);
        this.nodes = this.getNodes(graph);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: graphlib.Graph): void {

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
