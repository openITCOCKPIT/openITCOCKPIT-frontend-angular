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
    ConnectionOperator
} from '../../modules/eventcorrelation_module/pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.interface';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { PointExtensions } from '@foblex/2d';
import {
    DependenciesNode,
    HostServiceDependenciesINode,
    HostServiceDependenciesTree
} from './host-service-dependencies-tree.interface';
import dagre from '@dagrejs/dagre';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { HoststatusIconComponent } from '../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

const NODE_WIDTH = 150;
const DIRECTION = 'TB';

interface HostServiceDependenciesNode extends dagre.Node {
    dependenciesNode: DependenciesNode
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
        NgClass,
        TranslocoDirective,
        HoststatusIconComponent,
        FaIconComponent,
        TitleCasePipe,
    ],
    templateUrl: './host-service-dependencies-tree.component.html',
    styleUrl: './host-service-dependencies-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostServiceDependenciesTreeComponent {

    public hostServiceDependenciesTree = input<HostServiceDependenciesTree>();

    @ViewChild(FCanvasComponent)
    public fCanvasComponent!: FCanvasComponent;

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);

    public configuration = {
        outputSide: EFConnectableSide.RIGHT,
        inputSide: EFConnectableSide.LEFT,
        nodeSep: 120
    };

    public nodes: any[] = [];
    public connections: ConnectionOperator[] = [];

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

        const hostServiceDependenciesTree = this.hostServiceDependenciesTree();

        if (hostServiceDependenciesTree) {
            const nodes = this.getHostServiceDependenciesTreeNodes(hostServiceDependenciesTree);

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


            nodes.forEach(node => {
                // Add service meta data into dagre.Node (HostServiceDependenciesNode)
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

    private getHostServiceDependenciesTreeNodes(hostServiceDependenciesTree: HostServiceDependenciesTree): DependenciesNode[] {
        const nodes: DependenciesNode[] = [];

        // This method create an array for the hostServiceDependenciesTree Tree (Flow Chart)

        for (let hostOrServiceUuid in hostServiceDependenciesTree) {

            let treeItem = hostServiceDependenciesTree[hostOrServiceUuid];

            let parentIds: string[] | null = null;
            if (treeItem.parentIds.length) {
                parentIds = treeItem.parentIds.map(parentId => parentId.toString());
            }

            nodes.push({
                id: treeItem.id.toString(),
                name: treeItem.name,
                parentIds: parentIds,
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

    public fit2screen(): void {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(15, 15), true);
            this.cdr.markForCheck();
        }
    }

}
