import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { SelectItemOptionGroup, SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ExternalSystemConnect, ExternalSystemPost, IdoitObjectTypeResult } from '../external-systems.interface';
import {
    IdoitOverviewComponent
} from '../../../components/additional-host-information/idoit/idoit-overview/idoit-overview.component';
import {
    ItopOverviewComponent
} from '../../../components/additional-host-information/itop/itop-overview/itop-overview.component';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ExternalSystemsService } from '../external-systems.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import {
    MultiSelectOptgroupComponent
} from '../../../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { SystemnameService } from '../../../../../services/systemname.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { HistoryService } from '../../../../../history.service';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';

@Component({
    selector: 'oitc-external-systems-add',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgOptionTemplateDirective,
        NgSelectComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgIf,
        SelectComponent,
        IdoitOverviewComponent,
        ItopOverviewComponent,
        ColComponent,
        RowComponent,
        ContainerComponent,
        InputGroupComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        InputGroupTextDirective,
        DebounceDirective,
        FormCheckComponent,
        FormCheckLabelDirective,
        AlertComponent,
        AlertHeadingDirective,
        MultiSelectComponent,
        MultiSelectOptgroupComponent,
        AsyncPipe,
        JsonPipe,
        NgForOf,
        TrueFalseDirective,
        RegexHelperTooltipComponent
    ],
    templateUrl: './external-systems-add.component.html',
    styleUrl: './external-systems-add.component.css'
})
export class ExternalSystemsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post = this.getClearForm();
    public objectTypesForOptionGroup: SelectItemOptionGroup[] = [];
    public objectTypes: IdoitObjectTypeResult[] = [];

    public errors: GenericValidationError | null = null;
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    public readonly SystemnameService = inject(SystemnameService);


    protected readonly ExternalSystemTypes = [
        {
            key: 'idoit',
            value: this.TranslocoService.translate('i-doit System'),
            placeholder: 'i-doit.system/src/jsonrpc.php'
        },
        {
            key: 'itop',
            value: this.TranslocoService.translate('iTop System'),
            placeholder: 'itop/webservices/rest.php?version=1.3'
        }
    ];

    protected readonly InterfaceTypes = [
        {
            key: 'custom',
            value: this.TranslocoService.translate('Custom')
        },
        {
            key: 'PhysicalInterface',
            value: this.TranslocoService.translate('PhysicalInterface')
        },
        {
            key: 'LogicalInterface',
            value: this.TranslocoService.translate('LogicalInterface')
        }
    ];

    public containers: SelectKeyValue[] = [];
    public hostgroup_containers: SelectKeyValue[] = [];
    public connectStatus: boolean | null = null;
    public connectMessage: string = '';

    public ngOnInit(): void {
        this.loadContainers();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
            }));
    }

    public getClearForm(): ExternalSystemPost {
        return {
            container_id: null,
            name: '',
            description: '',
            api_url: '',
            api_key: '',
            api_user: '',
            api_password: '',
            use_https: 1, //number
            use_proxy: 1, //number
            ignore_ssl_certificate: 0, //number
            system_type: 'idoit',
            object_type_ids: [],
            custom_data: {
                custom_mappings: [],
                hostgroup_mappings: []
            }
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public submit() {
        console.log('submit!!!');
        this.subscriptions.add(this.ExternalSystemsService.createExternalSystem(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('External system');
                    const msg = this.TranslocoService.translate('created successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/import_module/ExternalSystems/index']);
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

    public checkConnection() {
        this.subscriptions.add(this.ExternalSystemsService.testConnection(this.post)
            .subscribe((result: ExternalSystemConnect) => {
                this.connectStatus = result.status.status;
                if (result.status.msg) {
                    this.connectMessage = result.status.msg.message;
                }
                if (result.status.result) {
                    this.objectTypes = result.status.result;
                    this.objectTypesForOptionGroup = this.ExternalSystemsService.parseElementsForOptionGroup(this.objectTypes);
                }
            }));
    }


    public addCustomMapping() {
        this.post.custom_data.custom_mappings.push({
            'classname': '',
            'interface_type': 'custom',
            'hostname': '',
            'address': '',
            'description': '',
            'software': ''
        });
    }

    public removeCustomMapping($index: any) {
        this.post.custom_data.custom_mappings.splice($index, 1);
    }

    public addCustomHostgroupMapping() {
        this.post.custom_data.hostgroup_mappings.push({
            'classname': '',
            'name_regex': '',
            'ci_regex': '',
            'container_id': 0
        });
    }

    public removeCustomHostgroupMapping($index: any) {
        this.post.custom_data.hostgroup_mappings.splice($index, 1);
    }

    public loadHostgroupContainers() {
        if (this.post.container_id) {
            this.subscriptions.add(this.ExternalSystemsService.loadHostgroupContainers(this.post.container_id)
                .subscribe((result: SelectKeyValue[]) => {
                    this.hostgroup_containers = result;
                }));
        }
    }
}
