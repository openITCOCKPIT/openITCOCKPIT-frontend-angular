import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { MapPost } from '../../maps/Maps.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { MapeditorsService } from '../Mapeditors.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoryService } from '../../../../../history.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MapItemComponent } from '../../../components/map-item/map-item.component';
import { MapCanvasComponent } from '../../../components/map-canvas/map-canvas.component';
import { Mapitem } from '../../../components/map-item/map-item.interface';

@Component({
    selector: 'oitc-mapeditors-edit',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        XsButtonDirective,
        CardBodyComponent,
        CardFooterComponent,
        RouterLink,
        TranslocoDirective,
        FFlowModule,
        NgOptimizedImage,
        BadgeComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormFeedbackComponent,
        FormsModule,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        NgForOf,
        NgIf,
        MapItemComponent,
        MapCanvasComponent
    ],
    templateUrl: './mapeditors-edit.component.html',
    styleUrl: './mapeditors-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapeditorsEditComponent implements OnInit, OnDestroy {

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    private subscriptions: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public map!: MapPost;
    protected helplineSizes: number[] = [5, 10, 15, 20, 25, 30, 50, 80];

    private route = inject(ActivatedRoute);
    protected showHelplines: boolean = true;

    protected mapId: number = 0;
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public gridSize: { x: number, y: number } = {x: 25, y: 25};
    public gridEnabled: boolean = true;

    public ngOnInit(): void {
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        /*this.subscriptions.add(this.MapeditorsService.getEdit(this.mapId)
            .subscribe((result) => {
                this.cdr.markForCheck();
            }));*/
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onShowHelplines(event: Event) {
        this.showHelplines = !this.showHelplines;
    }

    public onDropItem(mapItem: Mapitem) {
        console.error("Item dropped", mapItem);
    }

}
