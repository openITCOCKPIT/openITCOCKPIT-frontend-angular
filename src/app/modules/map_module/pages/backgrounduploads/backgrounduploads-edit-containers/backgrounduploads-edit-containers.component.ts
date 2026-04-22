import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LoadContainersRoot } from '../../../../../pages/contacts/contacts.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { MapUploadItem } from '../backgrounduploads.interface';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackgrounduploadsService } from '../../mapeditors/backgrounduploads.service';
import _ from 'lodash';

@Component({
    selector: 'oitc-backgrounduploads-edit-containers',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        RequiredIconComponent,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        CardFooterComponent,
    ],
    templateUrl: './backgrounduploads-edit-containers.component.html',
    styleUrl: './backgrounduploads-edit-containers.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgrounduploadsEditContainersComponent implements OnInit, OnDestroy {
    protected id: number = 0;
    protected requiredContainers: number[] = [];
    protected requiredContainersString: string = '';
    protected requiredContainersList: SelectKeyValue[] = []
    protected selectedContainers: number[] = [];
    protected areContainersChangeable: boolean = true;
    protected containers: SelectKeyValue[] = [];
    public post!: MapUploadItem;

    protected containersSelection: number[] = [];
    public errors: GenericValidationError | null = null;
    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);
    private readonly BackgrounduploadsService = inject(BackgrounduploadsService);
    protected invalidBackgroundMessage: string = this.TranslocoService.translate('⚠ Map uploaded image is not available!!!');


    public ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadMapUpload();
    }

    public loadMapUpload() {
        this.subscriptions.add(this.BackgrounduploadsService.getMapUploadWithContainers(this.id)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.post = result.uploadedFile;
                this.requiredContainers = result.requiredContainers
                this.areContainersChangeable = result.areContainersChangeable
                this.loadContainers();
            }));
    }

    private loadContainers(): void {
        this.subscriptions.add(this.BackgrounduploadsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containersSelection = [];
                this.requiredContainersList = [];
                this.containers = result.containers;

                this.post.containers._ids.forEach(value => {
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
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateMapUpload() {
        //update container ids if it was edited
        if (this.areContainersChangeable) {
            this.post.containers._ids = this.post.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
        }

        this.post.containers._ids = _.uniq(
            this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)
        );
        this.subscriptions.add(this.BackgrounduploadsService.updateUploadedFile(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Upload file');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['map_module', 'backgrounduploads', 'editContainers', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/backgrounduploads/backgrounds']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                    this.cdr.markForCheck();
                }
            })
        );
    }
}
