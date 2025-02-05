import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { HostdefaultsService } from '../hostdefaults.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HostDefaultsPost } from '../hostdefaults.interface';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
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
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { AsyncPipe, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { ServicetemplateTypesEnum } from '../../../../../pages/servicetemplates/servicetemplate-types.enum';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-hostdefaults-edit',
    imports: [
        AsyncPipe,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        LabelLinkComponent,
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        RegexHelperTooltipComponent,
        OitcAlertComponent,
        PermissionDirective,
        FormLoaderComponent
    ],
    templateUrl: './hostdefaults-edit.component.html',
    styleUrl: './hostdefaults-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdefaultsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly HostdefaultsService = inject(HostdefaultsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post!: HostDefaultsPost;
    public showRootAlert: boolean = false;

    public errors: GenericValidationError | null = null;
    public errors_exists_matches_servicetemplates = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public containers: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public hosttemplates: SelectKeyValue[] = [];
    public servicetemplates: SelectKeyValue[] = [];
    public servicetemplategroups: SelectKeyValue[] = [];
    public satellites: SelectKeyValue[] = [];
    public agentchecks: SelectKeyValue[] = [];
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;

    private cdr = inject(ChangeDetectorRef);


    protected readonly matchFields = [
        {
            key: 'hostname',
            value: this.TranslocoService.translate('Host name')
        },
        {
            key: 'description',
            value: this.TranslocoService.translate('Description')
        },
        {
            key: 'address',
            value: this.TranslocoService.translate('Address')
        },
        {
            key: 'software',
            value: this.TranslocoService.translate('Software')
        }
    ];

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadHostdefault();
    }

    public loadHostdefault() {
        this.subscriptions.add(this.HostdefaultsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.hostdefaults;
                this.cdr.markForCheck();
                this.loadContainers();
                this.loadElements();
            }));
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public onContainerChange() {
        this.loadElements();
        this.showRootAlert = this.post.container_id === ROOT_CONTAINER;
        this.post.host_container_id = this.post.container_id;
        this.cdr.markForCheck();
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.subscriptions.add(this.HostdefaultsService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host defaults');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['import_module', 'HostDefaults', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/import_module/HostDefaults/index']);
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

    protected loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdefaultsService.loadElements(containerId)
            .subscribe((result) => {
                this.sharingContainers = result.sharingContainers;
                this.hosttemplates = result.hosttemplates;
                this.servicetemplates = result.servicetemplates;
                this.servicetemplategroups = result.servicetemplategroups;
                this.satellites = result.satellites;
                this.agentchecks = result.agentchecks;
                this.cdr.markForCheck();
            })
        );
    }

    public addMatchServicetemplate() {
        let count = this.post.hostdefaults_to_servicetemplates.length + 1;

        this.post.hostdefaults_to_servicetemplates.push({
            id: count,
            field: 'hostname',
            regex: '',
            servicetemplate_id: null,
        });
    }

    public removeMatchServicetemplate(index: number) {
        this.post.hostdefaults_to_servicetemplates.splice(index, 1);
        this.removeErrorIfExists(index, 'hostdefaults_to_servicetemplates');
    }

    public removeMatchServicetemplategroup(index: number) {
        this.post.hostdefaults_to_servicetemplategroups.splice(index, 1);
        this.removeErrorIfExists(index, 'hostdefaults_to_servicetemplategroups');
    }

    public addMatchServicetemplategroup() {
        let count = this.post.hostdefaults_to_servicetemplategroups.length + 1;

        this.post.hostdefaults_to_servicetemplategroups.push({
            id: count,
            field: 'hostname',
            regex: '',
            servicetemplategroup_id: null,
        });
    };

    public removeMatchAgentcheck(index: number) {
        this.post.hostdefaults_to_agentchecks.splice(index, 1);
        this.removeErrorIfExists(index, 'hostdefaults_to_agentchecks');
    }

    public addMatchAgentcheck() {
        let count = this.post.hostdefaults_to_agentchecks.length + 1;

        this.post.hostdefaults_to_agentchecks.push({
            id: count,
            agentcheck_id: null,
            regex: '',
        });
    }

    public removeMatchServicetemplatesExternalMonitoring(index: number) {
        this.post.hostdefaults_to_servicetemplates_external_monitoring.splice(index, 1);

        this.removeErrorIfExists(index, 'hostdefaults_to_servicetemplates_external_monitoring');
    }

    public addMatchServicetemplatesExternalMonitoring() {
        let count = this.post.hostdefaults_to_servicetemplates_external_monitoring.length + 1;

        this.post.hostdefaults_to_servicetemplates_external_monitoring.push({
            id: count,
            servicetemplate_id: null,
            regex: '',
        });

    }

    private removeErrorIfExists(index: number, errorKey: string) {
        if (this.errors) {
            if (this.errors.hasOwnProperty(errorKey) && this.errors[errorKey].hasOwnProperty(index)) {
                if (Array.isArray(this.errors[errorKey])) {
                    // CakePHP returns an array bacuase the index with the error starts at 0
                    this.errors[errorKey].splice(index, 1);
                } else {
                    // CakePHP returns an array bacuase the index with the error starts at is > 0
                    delete this.errors[errorKey][index];
                }
            }

            // Reduce all indexes > index by 1
            // If a user remove an element with error above other elements
            const newErrors: GenericValidationError = {};
            for (const key in this.errors[errorKey]) {
                let numericKey = Number(key);
                if (numericKey > index) {
                    numericKey = numericKey - 1;
                }
                if (!newErrors.hasOwnProperty(errorKey)) {
                    newErrors[errorKey] = {};
                }

                newErrors[errorKey][numericKey] = this.errors[errorKey][key];
            }

            this.errors[errorKey] = newErrors[errorKey];

            this.errors = structuredClone(this.errors); // get new reference to trigger change detection if signals
            this.cdr.markForCheck();
        }
    }

    protected readonly ServicetemplateTypesEnum = ServicetemplateTypesEnum;
}
