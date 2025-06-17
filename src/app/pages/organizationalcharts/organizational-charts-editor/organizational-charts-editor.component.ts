import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NodesPaletteComponent } from './nodes-palette/nodes-palette.component';
import {
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

class IFlowViewModel {
}

@Component({
    selector: 'oitc-organizational-charts-editor',
    imports: [
        NodesPaletteComponent,
        FFlowComponent,
        FFlowModule
    ],
    templateUrl: './organizational-charts-editor.component.html',
    styleUrl: './organizational-charts-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsEditorComponent implements OnInit {

    protected viewModel: IFlowViewModel = {
        nodes: [],
        connections: []
    };

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

    protected readonly eMarkerType = EFMarkerType;

    constructor(
        private changeDetectorRef: ChangeDetectorRef
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
        this.changeDetectorRef.markForCheck();
    }

    public onNodeAdded(event: FCreateNodeEvent): void {
        //this.apiService.addNode(event.data as ENodeType, event.rect);
        console.log(event);
        //this.getData();
    }

    public onReassignConnection(event: FReassignConnectionEvent): void {
        //    this.apiService.reassignConnection(event.fOutputId, event.oldFInputId, event.newFInputId);
        this.getData();
    }

    public onConnectionAdded(event: FCreateConnectionEvent): void {
        if (!event.fInputId) {
            return;
        }
        //  this.apiService.addConnection(event.fOutputId, event.fInputId);
        this.getData();
    }

    public onNodePositionChanged(point: IPoint, node: any): void {
        node.position = point;
        //this.apiService.moveNode(node.id, point);
    }

}
