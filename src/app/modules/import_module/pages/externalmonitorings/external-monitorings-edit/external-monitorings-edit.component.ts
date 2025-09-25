import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import {
    DynamicalFormFieldsComponent
} from '../../../../../components/dynamical-form-fields/dynamical-form-fields.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { DynamicalFormFields } from '../../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ExternalMonitoringsService } from '../external-monitorings.service';
import { HistoryService } from '../../../../../history.service';
import { ExternalMonitoringConfig, ExternalMonitoringPost } from '../external-monitorings.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { SystemnameService } from '../../../../../services/systemname.service';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { ExternalMonitoringSystems } from '../external-monitoring-systems.enum';


@Component({
    selector: 'oitc-external-monitorings-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        DynamicalFormFieldsComponent,
        FaIconComponent,
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
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './external-monitorings-edit.component.html',
    styleUrl: './external-monitorings-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalMonitoringsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly ExternalMonitoringsService = inject(ExternalMonitoringsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post!: ExternalMonitoringPost;

    public errors: GenericValidationError | null = null;
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    public readonly SystemnameService = inject(SystemnameService);
    public formFields?: DynamicalFormFields;

    protected readonly ExternalMonitoringTypes = [
        {
            key: ExternalMonitoringSystems.FlowChief,
            value: this.TranslocoService.translate('FlowChief')
        },
        {
            key: ExternalMonitoringSystems.Icinga2,
            value: this.TranslocoService.translate('Icinga 2')
        },
        {
            key: ExternalMonitoringSystems.OpManager,
            value: this.TranslocoService.translate('ManageEngine OpManager')
        },
        {
            key: ExternalMonitoringSystems.PRTG,
            value: this.TranslocoService.translate('Paessler PRTG System')
        }
    ];
    protected readonly Object = Object;
    public containers: SelectKeyValue[] = [];
    private cdr = inject(ChangeDetectorRef);


    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadExternalMonitoring();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public loadConfigFieldsBySystemType() {
        if (this.post.system_type) {
            this.subscriptions.add(this.ExternalMonitoringsService.loadConfig(this.post.system_type)
                .subscribe((result: ExternalMonitoringConfig) => {
                    this.errors = null;
                    this.formFields = result.config.formFields;
                    this.cdr.markForCheck();
                })
            );
        }
    }

    public loadExternalMonitoring() {
        this.subscriptions.add(this.ExternalMonitoringsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.externalMonitoring;
                this.cdr.markForCheck();
                this.loadContainers();
                this.loadConfigFieldsBySystemType();
            }));
    }

    public submit() {
        this.subscriptions.add(this.ExternalMonitoringsService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('External system');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['import_module', 'ExternalMonitorings', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/import_module/ExternalMonitorings/index']);
                    this.notyService.scrollContentDivToTop();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected readonly ExternalMonitoringSystems = ExternalMonitoringSystems;
}
