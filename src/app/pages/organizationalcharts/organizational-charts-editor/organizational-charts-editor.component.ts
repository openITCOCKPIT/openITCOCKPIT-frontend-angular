import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    model,
    OnInit,
    ViewChild
} from '@angular/core';
import { NodesPaletteComponent } from './nodes-palette/nodes-palette.component';
import {
    EFConnectionBehavior,
    EFConnectionType,
    EFMarkerType,
    FCanvasComponent,
    FCreateConnectionEvent,
    FCreateNodeEvent,
    FFlowComponent,
    FFlowModule,
    FReassignConnectionEvent,
    FZoomDirective
} from '@foblex/flow';
import { IPoint, Point } from '@foblex/2d';
import { OcConnection, OrganizationalChartsTreeNode } from '../organizationalcharts.interface';
import { UUID } from '../../../classes/UUID';
import { TenantNodeComponent } from './tenant-node/tenant-node.component';
import { OcTreeNode } from './organizational-charts-editor.interface';
import { JsonPipe, NgClass } from '@angular/common';


@Component({
    selector: 'oitc-organizational-charts-editor',
    imports: [
        NodesPaletteComponent,
        FFlowComponent,
        FFlowModule,
        TenantNodeComponent,
        NgClass,
        JsonPipe
    ],
    templateUrl: './organizational-charts-editor.component.html',
    styleUrl: './organizational-charts-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalChartsEditorComponent implements OnInit {

    // Two-way binding for the organizational charts tree from the add or edit component
    public nodeTree = model<OrganizationalChartsTreeNode[]>([]);

    // Two-way binding for the organizational chart connections from add or edit component
    public connections = model<OcConnection[]>([]);

    public nodes: OcTreeNode[] = [];

    @ViewChild(FFlowComponent, {static: false})
    public fFlowComponent!: FFlowComponent;

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }


        switch (event.key) {
            case 'Backspace':
            case 'Delete':

                const selection = this.fFlowComponent.getSelection();
                console.log(selection);

                // Are there any connections selected? If so, remove them
                selection.fConnectionIds.forEach((connectionId) => {
                    this.onRemoveConnection(connectionId);
                });

                // Are any nodes selected? If so, remove them
                selection.fNodeIds.forEach((nodeId) => {
                    this.onNodeRemoved(nodeId);
                });

                break;
        }
    }

    protected readonly eMarkerType = EFMarkerType;

    constructor(
        private cdr: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
    }

    public onInitialized(): void {
        this.fCanvasComponent.fitToScreen(new Point(40, 40), false);
    }


    public onNodeAdded(event: FCreateNodeEvent): void {
        const x = Math.floor(event.rect.x);
        const y = Math.floor(event.rect.y);


        // Create a new node for the database / two-way binding
        const uuid = new UUID();
        const newNodeUuid: string = uuid.v4();

        const newNode: OrganizationalChartsTreeNode = {
            id: newNodeUuid,
            uuid: newNodeUuid,
            container_id: 1, // todo set back to 0
            users_to_organizational_chart_nodes: [],
            organizational_chart_id: 0,
            x_position: x,
            y_position: y
        };

        // Add new node to the f-flow canvas
        this.nodes.push({
            fNodeId: newNodeUuid,
            fNodeParentId: undefined,
            position: {
                x: x,
                y: y
            },
            node: newNode
        });

        // Update two-way binding
        this.addNodeToTree(newNode);
    }

    public onNodeRemoved(nodeId: string): void {
        // Find the node to remove
        const node = this.nodes.find((n) => n.node.id === nodeId);

        // Remove the node from the two-way binding
        if (node?.node) {
            this.removeNodeInTree(node.node);
        }
    }

    public onConnectionAdded(event: FCreateConnectionEvent): void {
        if (!event.fInputId) {
            return;
        }

        // So we can track connections in @for loop
        const uuid = new UUID();

        const newConnection: OcConnection = {
            id: uuid.v4(),
            organizational_chart_input_node_id: event.fInputId,
            organizational_chart_output_node_id: event.fOutputId
        };

        // Update the two-way binding
        this.connections.update((connections) => {
            return [...connections, newConnection];
        });

        this.cdr.markForCheck();
    }

    public onReassignConnection(event: FReassignConnectionEvent): void {
        if (!event.newFInputId) {
            // newFInputId undefined means that the connection has been reassigned to the same input/node
            // nothing to do in this case
            return;
        }

        // Delete old connection from f-flow canvas and add new one
        const connections = this.connections().filter((c) => c.id !== event.fConnectionId);

        // So we can track connections in @for loop
        const uuid = new UUID();
        const newConnection: OcConnection = {
            id: uuid.v4(),
            organizational_chart_input_node_id: event.newFInputId,
            organizational_chart_output_node_id: event.fOutputId
        };


        // Update the two-way binding
        this.connections.update((oldConnections) => {
            return connections
        });
    }

    public onRemoveConnection(connectionId: string | number) {
        let connections = this.connections();

        const connection = connections.find((c) => c.id === connectionId);
        if (!connection) {
            console.log('Connection not found:', connectionId);
            return;
        }

        // Remove the connection from the f-flow canvas
        connections = connections.filter((c) => c.id !== connectionId);

        // Update the two-way binding
        this.connections.update((oldConnections) => {
            return connections;
        });

        this.cdr.markForCheck();
    }

    public onNodePositionChanged(point: IPoint, node: OcTreeNode): void {
        node.position = point;

        const x = Math.floor(node.position.x);
        const y = Math.floor(node.position.y);

        node.node.x_position = x;
        node.node.y_position = y;

        this.updateNodeInTree(node.node);
    }

    private addNodeToTree(node: OrganizationalChartsTreeNode): void {
        this.nodeTree.update((nodes) => {
            return [...nodes, node];
        });

        this.cdr.markForCheck();
    }

    private updateNodeInTree(node: OrganizationalChartsTreeNode): void {
        this.nodeTree.update((nodes) => {
            console.log(nodes.map((n) => n.id === node.id ? node : n));
            return nodes.map((n) => n.id === node.id ? node : n);
        });

        this.cdr.markForCheck();
    }

    private removeNodeInTree(node: OrganizationalChartsTreeNode): void {
        // Remove any connections that reference this node
        this.connections().forEach((c) => {
            // Remove connections above (the node is the child of the connection)
            if (c.organizational_chart_input_node_id === node.id) {
                this.onRemoveConnection(c.id);
            }

            // Remove connections below (the node is the parent of the connection)
            // in this case we need to set the parent_id of the child node to null
            // the onRemoveConnection method will handle this
            if (c.organizational_chart_output_node_id === node.id) {
                this.onRemoveConnection(c.id);
            }
        });

        // Remove the node from the f-flow canvas
        this.nodes = this.nodes.filter((n) => n.node.id !== node.id);

        // Remove the node from the two-way binding
        this.nodeTree.update((nodes) => {
            return nodes.filter((n) => n.id !== node.id);
        });

        this.cdr.markForCheck();
    }

    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
    protected readonly String = String;
}
