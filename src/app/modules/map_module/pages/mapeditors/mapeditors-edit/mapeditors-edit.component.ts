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
import { ContextAction, Mapitem } from '../../../components/map-item/map-item.interface';
import { MapItemLabelComponent } from '../../../components/map-item-label/map-item-label.component';
import { MapItemContentComponent } from '../../../components/map-item-content/map-item-content.component';
import { parseInt } from 'lodash';

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
        MapCanvasComponent,
        MapItemLabelComponent,
        MapItemContentComponent
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
    protected gridSizes = [5, 10, 15, 20, 25, 30, 50, 80];

    public Mapeditor = {
        grid: {
            enabled: true,
            size: 15
        },
        helplines: {
            enabled: true,
            size: 15
        },
        synchronizeGridAndHelplinesSize: true

    };

    public MapItems: Mapitem[] = [
        {
            id: 1,
            map_id: 1,
            x: 24,
            y: 24,
            z_index: "1",
            label_possition: 2,
            show_label: true,
        },
        {
            id: 2,
            map_id: 1,
            x: 900,
            y: 24,
            z_index: "2",
            label_possition: 2,
            show_label: true,
        }
    ];

    private route = inject(ActivatedRoute);

    protected mapId: number = 0;
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public gridSize: { x: number, y: number } = {x: 25, y: 25};

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

    public onDropItem(mapItem: Mapitem) {
        console.error("Item dropped", mapItem);
    }

    public changeGridSize(size: number) {
        this.Mapeditor.grid.size = parseInt(size.toString(), 10);
        if (this.Mapeditor.synchronizeGridAndHelplinesSize) {
            if (this.Mapeditor.grid.size != this.Mapeditor.helplines.size) {
                this.changeHelplinesSize(this.Mapeditor.grid.size);
            }
        }
        if (this.Mapeditor.grid.enabled) {
            this.gridSize = {x: size, y: size};
            //makeDraggable();
        }
    }

    public changeHelplinesSize(size: number) {
        this.Mapeditor.helplines.size = parseInt(size.toString(), 10);
        if (this.Mapeditor.synchronizeGridAndHelplinesSize) {
            if (this.Mapeditor.grid.size != this.Mapeditor.helplines.size) {
                this.changeGridSize(this.Mapeditor.helplines.size);
            }
        }
        this.onHelplinesChange();
    }

    public onHelplinesChange() {
        this.Mapeditor.helplines = {...this.Mapeditor.helplines};
        this.cdr.markForCheck();
    }

    public onContextAction($event: ContextAction) {
        const type = $event.type;
        let index;
        console.error('ContextAction', $event);
        if (type === 'labelPosition') {
            for (let i = 0; i < this.MapItems.length; i++) {
                if (this.MapItems[i].id === $event.data.id) {
                    this.MapItems[i].label_possition = $event.data.label_possition!;
                    index = i;
                    break;
                }
            }
        }
        if (type === 'Edit') {
            console.error('Edit');
        }
        if (type === 'Delete') {
            console.error('Delete');
        }
        if (index) {
            this.MapItems[index] = {...this.MapItems[index]};
            this.cdr.markForCheck();
        }
    }
}
