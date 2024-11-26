import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from "../../../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../../../history.service';
import { MapsService } from '../Maps.service';
import { LoadContainersRoot, LoadSatellitesRoot, MapPost } from '../Maps.interface';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../../sla_module/components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-maps-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,

        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        RouterLink,
        TooltipDirective,
        TranslocoDirective,
        XsButtonDirective,
        MultiSelectComponent,
        FormLoaderComponent,
        AsyncPipe,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        SelectComponent,
        TimeperiodDetailsTooltipComponent,
        TranslocoPipe,
        TrueFalseDirective
    ],
    templateUrl: './maps-edit.component.html',
    styleUrl: './maps-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsEditComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private MapsService: MapsService = inject(MapsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post!: MapPost;

    protected containers: SelectKeyValue[] = [];
    protected satellites: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);

    protected mapId: number = 0;
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadContainers();
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.MapsService.getEdit(this.mapId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.post = result.map;
                this.post.Map.refresh_interval = (parseInt(this.post.Map.refresh_interval.toString(), 10) / 1000);
                this.onContainerChange();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateMap(): void {

        this.subscriptions.add(this.MapsService.updateMap(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Map');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['map_module', 'maps', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/maps/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.MapsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private loadSatellites(): void {
        this.subscriptions.add(this.MapsService.loadSatellites(this.post.Map.containers._ids)
            .subscribe((result: LoadSatellitesRoot) => {
                this.satellites = result.satellites;
                this.cdr.markForCheck();
            }))
    }

    public onContainerChange(): void {
        if (typeof this.post === "undefined") {
            return;
        }
        if (this.post.Map.containers._ids.length === 0) {
            //Create another
            return;
        }
        this.loadSatellites();
    }
}
