import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from "../../../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../../../history.service';
import { MapsService } from '../maps.service';
import { LoadSatellitesRoot, MapPost } from '../maps.interface';


import { PermissionsService } from '../../../../../permissions/permissions.service';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';
import _ from 'lodash';

@Component({
    selector: 'oitc-maps-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    NgSelectModule,
    PermissionDirective,
    RequiredIconComponent,
    RouterLink,
    TranslocoDirective,
    XsButtonDirective,
    MultiSelectComponent,
    FormLoaderComponent,
    AsyncPipe
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

    protected requiredContainers: number[] = [];
    protected requiredContainersList: SelectKeyValue[] = []
    protected areContainersChangeable: boolean = true;
    protected containersSelection: number[] = [];
    private init: boolean = true;

    protected mapId: number = 0;
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.MapsService.getEdit(this.mapId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.post = result.map;
                this.post.Map.refresh_interval = (parseInt(this.post.Map.refresh_interval.toString(), 10) / 1000);
                this.requiredContainers = result.requiredContainers;
                this.areContainersChangeable = result.areContainersChangeable;
                this.loadContainers();
                this.onContainerChange();
                this.init = false;
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateMap(): void {

        //update container ids if it was edited
        if (this.areContainersChangeable) {
            this.post.Map.containers._ids = this.post.Map.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
        }

        this.post.Map.containers._ids = _.uniq(
            this.post.Map.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)
        );
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
                this.containersSelection = [];
                this.requiredContainersList = [];
                this.containers = result.containers;
                this.post.Map.containers._ids.forEach(value => {
                    let permittetCheck = this.containers.find(({key}) => key === value);
                    if (permittetCheck && this.requiredContainers.indexOf(value) === -1) {
                        this.containersSelection.push(value);
                    }
                });

                this.requiredContainers.forEach(value => {
                    let existsCheck = this.containers.find(({key}) => key === value);
                    if (existsCheck) {
                        this.requiredContainersList.push({
                            key: value,
                            value: existsCheck.value
                        });
                    } else {
                        this.requiredContainersList.push({
                            key: value,
                            value: this.TranslocoService.translate('RESTRICTED CONTAINER')
                        });
                    }
                });

                this.cdr.markForCheck();
            }))
    }

    private loadSatellites(): void {

        if (this.post.Map.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            this.satellites = [];
            this.cdr.markForCheck();
            return;
        }

        //update container ids if it was edited
        if (this.areContainersChangeable && !this.init) {
            this.post.Map.containers._ids = this.post.Map.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
        }

        let containerIds = this.post.Map.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)

        this.subscriptions.add(this.MapsService.loadSatellites(containerIds)
            .subscribe((result: LoadSatellitesRoot) => {
                this.satellites = result.satellites;
                this.cdr.markForCheck();
            }))
    }

    public onContainerChange(): void {
        if (typeof this.post === "undefined") {
            return;
        }
        if (this.post.Map.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            //Create another
            this.satellites = [];
            return;
        }
        this.loadSatellites();
    }
}
