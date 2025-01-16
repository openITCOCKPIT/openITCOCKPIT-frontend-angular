import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { ImporterConfig, ImporterHostDefaultsResponse, ImportersPost } from '../importers.interface';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ImportersService } from '../importers.service';
import _ from 'lodash';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { DynamicalFormFields } from '../../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
import {
    DynamicalFormFieldsComponent
} from '../../../../../components/dynamical-form-fields/dynamical-form-fields.component';

@Component({
    selector: 'oitc-importers-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
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
        TrueFalseDirective,
        FormCheckComponent,
        NgClass,
        NgForOf,
        DynamicalFormFieldsComponent,
        AlertComponent,
        FormCheckLabelDirective,
        AsyncPipe,
        TranslocoPipe
    ],
    templateUrl: './importers-add.component.html',
    styleUrl: './importers-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportersAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ImportersService = inject(ImportersService);
    public containers: SelectKeyValue[] = [];
    public hostdefaults: { [key: string]: ImporterHostDefaultsResponse } = {};
    public hostdefaultsAsList: SelectKeyValueString[] = [];
    public externalsystems: SelectKeyValue[] = [];
    public externalmonitorings: SelectKeyValue[] = [];

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;
    public formFields?: DynamicalFormFields;

    protected readonly DataSourceTypes = [
        {
            key: 'csv_with_header',
            value: this.TranslocoService.translate('CSV with header')
        },
        {
            key: 'csv_without_header',
            value: this.TranslocoService.translate('CSV without header')
        },
        {
            key: 'idoit',
            value: this.TranslocoService.translate('i-doit')
        },
        {
            key: 'openitcockpit_agent',
            value: this.TranslocoService.translate('openITCOCKPIT Agent')
        },
        {
            key: 'itop',
            value: this.TranslocoService.translate('iTop')
        },
        {
            key: 'external_monitoring',
            value: this.TranslocoService.translate('External Monitoring')
        }
    ];

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

    ngOnInit(): void {
        this.loadContainers();
        this.loadConfigFieldsByDataSource();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy(): void {
    }

    public getClearForm(): ImportersPost {
        return {
            container_id: null,
            name: '',
            description: '',
            data_source: 'csv_with_header',
            hostname_regex: '',
            allow_empty_hosts: 0,
            disable_updates: 0,     // only create new hosts
            force_disable_hosts: 0, // hosts
            re_enable_hosts: 0, // hosts
            force_delete: 0,        // services
            keep_container_settings: 1,
            keep_satellite_settings: 1,
            config: {},
            hostdefault_id: 0,
            external_system_id: null,
            external_monitorings: {
                _ids: []
            },
            importers_to_hostdefaults: []
        }
    }

    public submit() {
        this.subscriptions.add(this.ImportersService.createImporter(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Importer');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['import_module', 'Importers', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    // Create another
                    this.post = this.getClearForm();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

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

    public onContainerChange() {
        this.loadElements();
        this.cdr.markForCheck();
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ImportersService.loadElements(containerId, this.post.data_source)
            .subscribe((result) => {
                this.hostdefaultsAsList = _.map(result.hostdefaults, function (value, key) {
                    return {key: key, value: value.name};
                });
                this.hostdefaults = result.hostdefaults;
                this.externalsystems = result.externalsystems.externalsystems;
                this.externalmonitorings = result.externalMonitorings.externalMonitorings;
                this.cdr.markForCheck();
            })
        );

    }

    public loadConfigFieldsByDataSource() {
        if (this.post.data_source) {
            this.subscriptions.add(this.ImportersService.loadConfig(this.post.data_source)
                .subscribe((result: ImporterConfig) => {
                    this.errors = null;
                    _.forEach(result.config.formFields, (value, key) => {
                        _.assign(this.post, {
                            [
                                value.ngModel]: result.config.config.mapping[value.ngModel]
                        });
                    });
                    this.formFields = result.config.formFields;
                    this.cdr.markForCheck();
                })
            );
        }
    }


    protected readonly Object = Object;

    public addMatch() {
        let count = this.post.importers_to_hostdefaults.length +1;
        let highest = 0;
        if(this.post.importers_to_hostdefaults.length > 0) {
            highest = Math.max.apply(Math, _.map(this.post.importers_to_hostdefaults, 'index')) + 1;
        }

        this.post.importers_to_hostdefaults.push({
            id: count,
            field: 'hostname',
            regex: '',
            hostdefault_id: null,
            index: highest,
            order: count
        });

        if (this.errors !== null) {
            if (!(typeof this.errors['validate_matches'] !== 'undefined' ||
                typeof this.errors['hostdefault_matches'] !== 'undefined')) {
                this.post.importers_to_hostdefaults = _(this.post.importers_to_hostdefaults)
                    .chain()
                    .flatten()
                    .sortBy(
                        function (match) {
                            return [match.index];
                        })
                    .value();
            }
        }
    }

    public removeMatch(index: number | undefined) {
        let importers_to_hostdefaults = [];
        for (var i in this.post.importers_to_hostdefaults) {
            if (this.post.importers_to_hostdefaults[i]['index'] !== index) {
                importers_to_hostdefaults.push(this.post.importers_to_hostdefaults[i])
            }
        }
        if (this.errors?.hasOwnProperty('validate_matches') && typeof this.errors['validate_matches'] !== 'undefined' ||
            this.errors?.hasOwnProperty('hostdefault_matches') && typeof this.errors['hostdefault_matches'] !== 'undefined') {
            this.post.importers_to_hostdefaults = importers_to_hostdefaults;
        } else {
            this.post.importers_to_hostdefaults = _(importers_to_hostdefaults)
                .chain()
                .flatten()
                .sortBy(
                    function (match) {
                        return [match.field, match.regex];
                    })
                .value();
        }
    }
}
