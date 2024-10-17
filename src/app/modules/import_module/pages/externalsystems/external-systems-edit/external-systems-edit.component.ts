import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { AsyncPipe, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import {
    MultiSelectOptgroupComponent
} from '../../../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    ExternalSystemConnect,
    ExternalSystemGet,
    ExternalSystemPost,
    IdoitObjectTypeResult
} from '../external-systems.interface';
import { Subscription } from 'rxjs';
import { SelectItemOptionGroup, SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ExternalSystemsService } from '../external-systems.service';

import { SystemnameService } from '../../../../../services/systemname.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { HistoryService } from '../../../../../history.service';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';

@Component({
    selector: 'oitc-external-systems-edit',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        AsyncPipe,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,

        DebounceDirective,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
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
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectOptgroupComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        TranslocoPipe,
        RegexHelperTooltipComponent
    ],
    templateUrl: './external-systems-edit.component.html',
    styleUrl: './external-systems-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalSystemsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post!: ExternalSystemPost;
    public get!: ExternalSystemGet;
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
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadExternalSystem();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public loadExternalSystem() {
        this.subscriptions.add(this.ExternalSystemsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.externalSystem;
                this.cdr.markForCheck();
                this.loadContainers();
                this.checkConnection();
                this.loadHostgroupContainers();
            }));
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
                this.cdr.markForCheck();
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
                    this.cdr.markForCheck();
                }));
        }
    }

    public submit() {
        this.subscriptions.add(this.ExternalSystemsService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('External system');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['import_module', 'ExternalSystems', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);


                    this.HistoryService.navigateWithFallback(['/import_module/ExternalSystems/index']);
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
}
