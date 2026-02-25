import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import {
    ExternalMonitoringConfig,
    ExternalMonitoringConfigFlowChief,
    ExternalMonitoringConfigIcinga2,
    ExternalMonitoringConfigLibreNMS,
    ExternalMonitoringConfigOpmanager,
    ExternalMonitoringConfigPrtg,
    ExternalMonitoringConnect,
    ExternalMonitoringPost
} from '../external-monitorings.interface';


import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';

import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ExternalMonitoringsService } from '../external-monitorings.service';


import { SystemnameService } from '../../../../../services/systemname.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

import { HistoryService } from '../../../../../history.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { DynamicalFormFields } from '../../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
import {
    DynamicalFormFieldsComponent
} from '../../../../../components/dynamical-form-fields/dynamical-form-fields.component';
import { ExternalMonitoringSystems } from '../external-monitoring-systems.enum';

@Component({
    selector: 'oitc-external-monitorings-add',
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
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        ContainerComponent,
        DynamicalFormFieldsComponent,
        MultiSelectComponent,
        AlertComponent,
        RowComponent,
        ColComponent
    ],
    templateUrl: './external-monitorings-add.component.html',
    styleUrl: './external-monitorings-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalMonitoringsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly ExternalMonitoringsService = inject(ExternalMonitoringsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post = this.getClearForm();

    public errors: GenericValidationError | null = null;
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    public readonly SystemnameService = inject(SystemnameService);
    public formFields?: DynamicalFormFields;

    public connectStatus: boolean | null = null;
    public connectMessage: string = '';

    public messageTemplates: SelectKeyValue[] = [];

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
        },
        {
            key: ExternalMonitoringSystems.LibreNMS,
            value: this.TranslocoService.translate('LibreNMS')
        }
    ];

    public containers: SelectKeyValue[] = [];
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainers();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public getClearForm(): ExternalMonitoringPost {
        return {
            container_id: null,
            name: '',
            description: '',
            system_type: '',
            json_data: {},
            message_template_ids: []
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.subscriptions.add(this.ExternalMonitoringsService.createExternalMonitoring(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('External Monitoring system');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['import_module', 'ExternalMonitorings', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/import_module/ExternalMonitorings/index']);
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

    public loadConfigFieldsBySystemType() {
        if (this.post.system_type) {
            this.subscriptions.add(this.ExternalMonitoringsService.loadConfig(this.post.system_type)
                .subscribe((result: ExternalMonitoringConfig) => {
                    this.errors = null;
                    switch (this.post.system_type) {
                        case ExternalMonitoringSystems.Icinga2:
                            const icinga2 = result.config.config as ExternalMonitoringConfigIcinga2;
                            this.post.json_data = icinga2;
                            break;

                        case ExternalMonitoringSystems.OpManager:
                            const opmanager = result.config.config as ExternalMonitoringConfigOpmanager;
                            this.post.json_data = opmanager;
                            break;

                        case ExternalMonitoringSystems.PRTG:
                            const prtg = result.config.config as ExternalMonitoringConfigPrtg;
                            this.post.json_data = prtg;
                            break;

                        case ExternalMonitoringSystems.FlowChief:
                            const flowChief = result.config.config as ExternalMonitoringConfigFlowChief;
                            this.post.json_data = flowChief;
                            break;

                        case ExternalMonitoringSystems.LibreNMS:
                            const LibreNMS = result.config.config as ExternalMonitoringConfigLibreNMS;
                            this.post.json_data = LibreNMS;
                            break;
                    }

                    this.formFields = result.config.formFields;
                    this.cdr.markForCheck();
                })
            );
        }
    }

    public checkConnection() {
        this.subscriptions.add(this.ExternalMonitoringsService.testConnection(this.post)
            .subscribe((result: ExternalMonitoringConnect) => {
                this.connectStatus = result.status.status;
                if (result.status.msg) {
                    this.connectMessage = result.status.msg.message;
                }
                if (result.messageTemplates) {
                    this.messageTemplates = result.messageTemplates;
                }
                this.cdr.markForCheck();
            }));
    }

    protected readonly Object = Object;
    protected readonly ExternalMonitoringSystems = ExternalMonitoringSystems;
}
