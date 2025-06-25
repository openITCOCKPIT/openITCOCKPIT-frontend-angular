import { ChangeDetectionStrategy, ChangeDetectorRef, Component, model, OnInit, ViewChild } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsEditorComponent implements OnInit {

    // Two-way binding for the organizational charts tree from the add or edit component
    public nodeTree = model<OrganizationalChartsTreeNode[]>([]);

    public nodes: OcTreeNode[] = [];
    public connections: OrganizationalChartsTreeConnection[] = [];

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

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
        this.nodeTree.update((nodes) => {
            return [...nodes, newNode];
        });

        this.cdr.markForCheck();


        //this.getData();
    }

    public onReassignConnection(event: FReassignConnectionEvent): void {
        console.log('onReassignConnection');
        console.log(event);
        //    this.apiService.reassignConnection(event.fOutputId, event.oldFInputId, event.newFInputId);
        this.getData();
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
        this.cdr.markForCheck();
    }

    public onNodePositionChanged(point: IPoint, node: any): void {
        node.position = point;

        const x = Math.floor(node.position.x);
        const y = Math.floor(node.position.y);

        console.log('onNodePositionChanged');
        console.log(point);
        console.log(node);

        //this.apiService.moveNode(node.id, point);
    }

    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
}
