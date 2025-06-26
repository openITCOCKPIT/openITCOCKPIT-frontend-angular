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
import { OrganizationalChartsTreeConnection, OrganizationalChartsTreeNode } from '../organizationalcharts.interface';
import { UUID } from '../../../classes/UUID';
import { TenantNodeComponent } from './tenant-node/tenant-node.component';
import { OcTreeNode } from './organizational-charts-editor.interface';
import { NgClass } from '@angular/common';


@Component({
    selector: 'oitc-organizational-charts-editor',
    imports: [
        NodesPaletteComponent,
        FFlowComponent,
        FFlowModule,
        TenantNodeComponent,
        NgClass
    ],
    templateUrl: './organizational-charts-editor.component.html',
    styleUrl: './organizational-charts-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalChartsEditorComponent implements OnInit {

    // Two-way binding for the organizational charts tree from the add or edit component
    public nodeTree = model<OrganizationalChartsTreeNode[]>([]);

    public nodes: OcTreeNode[] = [];
    public connections: OrganizationalChartsTreeConnection[] = [];

    @ViewChild(FFlowComponent, {static: false})
    public fFlowComponent!: FFlowComponent;

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        console.log('Keydown event:', event);
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        console.log('Key pressed:', event.key, 'KeyCode:', event.keyCode);

        switch (event.key) {
            case 'Backspace':
            case 'Delete':
                console.log('Backspace pressed');

                const selection = this.fFlowComponent.getSelection();

                // Are there any connections selected? If so, remove them
                selection.fConnectionIds.forEach((connectionId) => {
                    this.onRemoveConnection(connectionId);
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
        this.getData();
    }

    public onInitialized(): void {
        this.fCanvasComponent.fitToScreen(new Point(40, 40), false);
    }

    private getData(): void {
        // this.viewModel = this.apiService.getFlow();
        this.cdr.markForCheck();
    }

    public onNodeAdded(event: FCreateNodeEvent): void {
        const x = Math.floor(event.rect.x);
        const y = Math.floor(event.rect.y);


        // Create a new node for the database / two-way binding
        const uuid = new UUID();

        const newNode: OrganizationalChartsTreeNode = {
            id: uuid.v4(),
            parent_id: null,
            container_id: 0,
            users_to_organizational_chart_structures: [],
            organizational_chart_id: 0,
            x_position: x,
            y_position: y
        };

        // Add new node to the f-flow canvas
        this.nodes.push({
            fNodeId: '1',
            fNodeParentId: '2',
            position: {
                x: x,
                y: y
            },
            node: newNode
        });

        // Update two-way binding
        this.addNodeToTree(newNode);


        //this.getData();
    }

    public onConnectionAdded(event: FCreateConnectionEvent): void {
        if (!event.fInputId) {
            return;
        }

        // So we can track connections in @for loop
        const uuid = new UUID();

        const newConnection: OrganizationalChartsTreeConnection = {
            uuid: uuid.v4(),
            fInputId: event.fInputId,
            fOutputId: event.fOutputId
        };

        this.connections = [...this.connections, newConnection];

        // Update the two-way binding
        const node = this.nodeTree().find((n) => n.id === event.fInputId);
        if (!node) {
            console.log('Node not found for connection input:', event.fInputId);
            return;
        }

        node.parent_id = event.fOutputId;
        this.updateNodeInTree(node);

        this.cdr.markForCheck();
    }

    public onReassignConnection(event: FReassignConnectionEvent): void {
        if (!event.newFInputId) {
            // newFInputId undefined means that the connection has been reassigned to the same input/node
            // nothing to do in this case
            return;
        }

        // Delete old connection from f-flow canvas and add new one
        this.connections = this.connections.filter((c) => c.uuid !== event.fConnectionId);

        // So we can track connections in @for loop
        const uuid = new UUID();
        const newConnection: OrganizationalChartsTreeConnection = {
            uuid: uuid.v4(),
            fInputId: event.newFInputId,
            fOutputId: event.fOutputId
        };

        this.connections = [...this.connections, newConnection];

        // Remove the parent_id from the old node
        const oldNode = this.nodeTree().find((n) => n.id === event.oldFInputId);
        if (!oldNode) {
            console.log('Old node not found for connection reassignment:', event.oldFInputId);
            return;
        }

        oldNode.parent_id = null;
        this.updateNodeInTree(oldNode);

        // Update the parent_id of the new node
        const newNode = this.nodeTree().find((n) => n.id === event.newFInputId);
        if (!newNode) {
            console.log('New node not found for connection reassignment:', event.newFInputId);
            return;
        }

        newNode.parent_id = event.fOutputId;
        this.updateNodeInTree(newNode);
    }

    public onRemoveConnection(connectionId: string) {
        const connection = this.connections.find((c) => c.uuid === connectionId);
        if (!connection) {
            console.log('Connection not found:', connectionId);
            return;
        }

        // Remove the connection from the f-flow canvas
        this.connections = this.connections.filter((c) => c.uuid !== connectionId);

        // Find the node that had this connection as input and remove the parent_id
        const node = this.nodeTree().find((n) => n.id === connection.fInputId);
        if (node) {
            node.parent_id = null;
            this.updateNodeInTree(node);
        }
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

    private removeNodeFromTree(node: OrganizationalChartsTreeNode): void {
        this.nodeTree.update((nodes) => {
            return nodes.filter((n) => n.id !== node.id);
        });

        this.cdr.markForCheck();
    }

    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
    protected readonly String = String;
}
