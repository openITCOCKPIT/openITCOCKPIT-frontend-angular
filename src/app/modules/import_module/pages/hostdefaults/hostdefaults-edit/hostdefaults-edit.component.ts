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
import _ from 'lodash';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { AgentHttpClientErrors } from '../../../../../pages/agentconnector/agentconnector.enums';
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
            index: Object.keys(this.post.hostdefaults_to_servicetemplates).length
        });

        if (this.errors !== null) {
            if (!(typeof this.errors['validate_matches_servicetemplates'] !== 'undefined' ||
                typeof this.errors['hostdefaults_to_servicetemplates'] !== 'undefined')) {
                this.errors_exists_matches_servicetemplates = true;
                this.post.hostdefaults_to_servicetemplates = _(this.post.hostdefaults_to_servicetemplates)
                    .chain()
                    .flatten()
                    .sortBy(
                        function (match) {
                            return [match.regex, match.field];
                        })
                    .value();
            }
        }
    }

    public removeMatchServicetemplate(index: number | undefined) {
        let hostdefault_matches_servicetemplates = [];
        for (var i in this.post.hostdefaults_to_servicetemplates) {
            if (this.post.hostdefaults_to_servicetemplates[i]['index'] !== index) {
                hostdefault_matches_servicetemplates.push(this.post.hostdefaults_to_servicetemplates[i])
            }
        }
        if (this.errors?.hasOwnProperty('validate_matches_servicetemplates') && typeof this.errors['validate_matches_servicetemplates'] !== 'undefined' ||
            this.errors?.hasOwnProperty('validate_matches_servicetemplates') && typeof this.errors['hostdefault_matches_servicetemplates'] !== 'undefined') {
            this.post.hostdefaults_to_servicetemplates = hostdefault_matches_servicetemplates;
        } else {
            this.post.hostdefaults_to_servicetemplates = _(hostdefault_matches_servicetemplates)
                .chain()
                .flatten()
                .sortBy(
                    function (match) {
                        return [match.field, match.regex];
                    })
                .value();
        }
    }

    public removeMatchServicetemplategroup(index: number | undefined) {
        let hostdefault_matches_servicetemplategroups = [];
        for (var i in this.post.hostdefaults_to_servicetemplategroups) {
            if (this.post.hostdefaults_to_servicetemplategroups[i]['index'] !== index) {
                hostdefault_matches_servicetemplategroups.push(this.post.hostdefaults_to_servicetemplategroups[i])
            }
        }
        if (this.errors?.hasOwnProperty('validate_matches_servicetemplategroup') && typeof this.errors['validate_matches_servicetemplategroup'] !== 'undefined' ||
            this.errors?.hasOwnProperty('validate_matches_servicetemplategroup') && typeof this.errors['validate_matches_servicetemplategroup'] !== 'undefined') {
            this.post.hostdefaults_to_servicetemplategroups = hostdefault_matches_servicetemplategroups;
        } else {
            this.post.hostdefaults_to_servicetemplategroups = _(hostdefault_matches_servicetemplategroups)
                .chain()
                .flatten()
                .sortBy(
                    function (match) {
                        return [match.field, match.regex];
                    })
                .value();
        }
    }

    public addMatchServicetemplategroup() {
        let count = this.post.hostdefaults_to_servicetemplategroups.length + 1;

        this.post.hostdefaults_to_servicetemplategroups.push({
            id: count,
            field: 'hostname',
            regex: '',
            servicetemplategroup_id: null,
            index: Object.keys(this.post.hostdefaults_to_servicetemplategroups).length
        });

        if (this.errors !== null) {
            if (!(typeof this.errors['validate_matches_servicetemplategroups'] !== 'undefined' ||
                typeof this.errors['hostdefaults_to_servicetemplategroups'] !== 'undefined')) {
                this.post.hostdefaults_to_servicetemplategroups = _(this.post.hostdefaults_to_servicetemplategroups)
                    .chain()
                    .flatten()
                    .sortBy(
                        function (match) {
                            return [match.regex, match.field];
                        })
                    .value();
            }
        }
    };

    public removeMatchAgentcheck(index: any) {
        let hostdefault_matches_agentchecks = [];
        for (let i in this.post.hostdefaults_to_agentchecks) {
            if (this.post.hostdefaults_to_agentchecks[i]['index'] !== index) {
                hostdefault_matches_agentchecks.push(this.post.hostdefaults_to_agentchecks[i])
            }
        }
        if (typeof this.post.hostdefaults_to_agentchecks !== 'undefined' ||
            (this.errors?.hasOwnProperty('validate_matches_servicetemplategroup') && typeof this.errors['validate_matches_agentchecks'] !== 'undefined')) {
            this.post.hostdefaults_to_agentchecks = hostdefault_matches_agentchecks;
        } else {
            this.post.hostdefaults_to_agentchecks = _(hostdefault_matches_agentchecks)
                .chain()
                .flatten()
                .value();
        }
    }

    public addMatchAgentcheck() {
        let count = this.post.hostdefaults_to_agentchecks.length + 1;

        this.post.hostdefaults_to_agentchecks.push({
            id: count,
            agentcheck_id: null,
            regex: '',
            index: Object.keys(this.post.hostdefaults_to_agentchecks).length
        });

        if (this.errors !== null) {
            if (!(typeof this.errors['validate_matches_agentchecks'] !== 'undefined' ||
                typeof this.errors['hostdefaults_to_agentchecks'] !== 'undefined')) {
                this.post.hostdefaults_to_agentchecks = _(this.post.hostdefaults_to_agentchecks)
                    .chain()
                    .flatten()
                    .sortBy(
                        function (match) {
                            return [match.regex];
                        })
                    .value();
            }
        }
    }

    public removeMatchServicetemplatesExternalMonitoring(index: number | undefined) {
        let hostdefault_matches_servicetemplates_external_monitoring = [];
        for (var i in this.post.hostdefaults_to_servicetemplates_external_monitoring) {
            if (this.post.hostdefaults_to_servicetemplates_external_monitoring[i]['index'] !== index) {
                hostdefault_matches_servicetemplates_external_monitoring.push(this.post.hostdefaults_to_servicetemplates_external_monitoring[i])
            }
        }
        if (typeof this.post.hostdefaults_to_agentchecks !== 'undefined' ||
            (this.errors?.hasOwnProperty('validate_matches_servicetemplates_external_monitoring') && typeof this.errors['validate_matches_servicetemplates_external_monitoring'] !== 'undefined')) {
            this.post.hostdefaults_to_servicetemplates_external_monitoring = hostdefault_matches_servicetemplates_external_monitoring;
        } else {
            this.post.hostdefaults_to_servicetemplates_external_monitoring = _(hostdefault_matches_servicetemplates_external_monitoring)
                .chain()
                .flatten()
                .value();
        }
    }

    public addMatchServicetemplatesExternalMonitoring() {
        let count = this.post.hostdefaults_to_servicetemplates_external_monitoring.length + 1;

        this.post.hostdefaults_to_servicetemplates_external_monitoring.push({
            id: count,
            servicetemplate_id: null,
            regex: '',
            index: Object.keys(this.post.hostdefaults_to_servicetemplates_external_monitoring).length
        });

        if (this.errors !== null) {
            if (!(typeof this.errors['validate_matches_servicetemplates_external_monitoring'] !== 'undefined' ||
                typeof this.errors['hostdefaults_to_servicetemplates_external_monitoring'] !== 'undefined')) {
                this.post.hostdefaults_to_servicetemplates_external_monitoring = _(this.post.hostdefaults_to_servicetemplates_external_monitoring)
                    .chain()
                    .flatten()
                    .sortBy(
                        function (match) {
                            return [match.regex];
                        })
                    .value();
            }
        }
    }
    protected readonly ServicetemplateTypesEnum = ServicetemplateTypesEnum;
}
