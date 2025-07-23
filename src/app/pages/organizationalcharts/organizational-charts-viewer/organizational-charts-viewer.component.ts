import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    model,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective
} from '@coreui/angular';
import {
    EFConnectionBehavior,
    EFConnectionType,
    EFMarkerType,
    FBackgroundComponent,
    FCanvasComponent,
    FCirclePatternComponent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective
} from '@foblex/flow';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NodesPaletteComponent } from './nodes-palette/nodes-palette.component';
import { OcNodeComponent } from './oc-node/oc-node.component';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import { OcConnection, OrganizationalChartsTreeNode } from '../organizationalcharts.interface';
import { OcTreeNode } from '../organizational-charts-editor/organizational-charts-editor.interface';
import { Subscription } from 'rxjs';
import { OrganizationalChartNodesService } from '../organizationalchartnodes.service';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { Point } from '@foblex/2d';

@Component({
    selector: 'oitc-organizational-charts-viewer',
    imports: [
        ButtonCloseDirective,
        FBackgroundComponent,
        FCanvasComponent,
        FCirclePatternComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NodesPaletteComponent,
        OcNodeComponent,
        ReactiveFormsModule,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './organizational-charts-viewer.component.html',
    styleUrl: './organizational-charts-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsViewerComponent implements OnInit, OnDestroy {

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

    @ViewChild('ocNodeDetailsModal', {static: false}) ocNodeDetailsModal: ModalComponent | undefined;
    private readonly modalService = inject(ModalService);

    public currentNodeForModal: OcTreeNode | undefined;

    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    private readonly OrganizationalChartNodesService: OrganizationalChartNodesService = inject(OrganizationalChartNodesService);
    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef
    ) {

    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onInitialized(): void {
        this.fCanvasComponent.fitToScreen(new Point(40, 40), false);
    }

    protected readonly eMarkerType = EFMarkerType;
    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
    protected readonly String = String;
    protected readonly ContainerTypesEnum = ContainerTypesEnum;

}
