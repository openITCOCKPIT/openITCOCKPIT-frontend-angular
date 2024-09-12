import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../Slas.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
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
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import {
    LoadTimeperiodsParams,
    LoadTimeperiodsRoot,
    LoadUsersParams,
    LoadUsersRoot,
    SlaAddResponse,
    SlaPost
} from '../Slas.interface';
import { LoadContainersRoot } from '../../../../../pages/contacts/contacts.interface';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { SlasReportFormatEnum } from '../slas.enum';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';

@Component({
    selector: 'oitc-slas-index',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        NgClass,
        FaStackComponent,
        FaStackItemSizeDirective,
        BackButtonDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        LabelLinkComponent,
        MacrosComponent,
        MultiSelectComponent,
        RequiredIconComponent,
        SelectComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        TrueFalseDirective,
        TimeperiodDetailsTooltipComponent
    ],
    templateUrl: './slas-add.component.html',
    styleUrl: './slas-add.component.css',
})
export class SlasAddComponent implements OnInit, OnDestroy {

    private readonly SlasService: SlasService = inject(SlasService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: SlaPost = {} as SlaPost;
    protected createAnother: boolean = false;
    protected containers: SelectKeyValue[] = [];
    protected users: SelectKeyValue[] = [];
    protected timeperiods: SelectKeyValue[] = [];
    protected evaluationPeriods = [
        {key: 'MONTH', value: this.TranslocoService.translate('Month')},
        {key: 'QUARTER', value: this.TranslocoService.translate('Quarter')},
        {key: 'YEAR', value: this.TranslocoService.translate('Year')},
        {key: 'DAY', value: this.TranslocoService.translate('Day')},
        {key: 'WEEK', value: this.TranslocoService.translate('Week')}
    ];
    protected hardStates = [
        {key: 0, value: this.TranslocoService.translate('soft and hard state')},
        {key: 1, value: this.TranslocoService.translate('only hard state')}
    ];
    protected reportSendIntervals = [
        {key: 'NEVER', value: this.TranslocoService.translate('never')},
        {key: 'YEAR', value: this.TranslocoService.translate('yearly')},
        {key: 'QUARTER', value: this.TranslocoService.translate('quarterly')},
        {key: 'MONTH', value: this.TranslocoService.translate('monthly')},
        {key: 'WEEK', value: this.TranslocoService.translate('weekly')},
        {key: 'DAY', value: this.TranslocoService.translate('daily')}
    ];
    protected reportFormats = [
        {key: SlasReportFormatEnum.REPORT_FORMAT_CSV, value: this.TranslocoService.translate('CSV')},
        {key: SlasReportFormatEnum.REPORT_FORMAT_PDF, value: this.TranslocoService.translate('PDF')},
    ]
    protected radioButtonValues = [1, 2, 3];

    protected files: number[] = [];
    protected send_zip: number = 0;
    protected filetypes = {
        csv: 1 << 0,
        pdf: 1 << 1,
        zip: 1 << 2
    };

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): SlaPost {
        return {
            container_id: null,
            timeperiod_id: null,
            name: '',
            description: '',
            minimal_availability: null,
            warning_threshold: null,
            start_date: null,
            evaluation_interval: 'MONTH',
            consider_downtimes: 1,
            hard_state_only: 0,
            report_send_interval: 'MONTH',
            report_format: 0,
            report_evaluation: 2,
            users: {
                _ids: []
            }
        };
    }

    public ngOnInit() {
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(redirectToHostMappingRules: boolean = false): void {
        this.subscriptions.add(this.SlasService.add(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as SlaAddResponse;
                    const title = this.TranslocoService.translate('SLA');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['sla_module', 'slas', 'edit', response.sla.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!redirectToHostMappingRules) {
                        this.HistoryService.navigateWithFallback(['/sla_module/slas/index']);
                        return;
                    } else {
                        this.router.navigate(['/sla_module/host_mapping_rules/assignToHosts/' + response.sla.id]);
                    }
                    this.notyService.scrollContentDivToTop();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

    private loadContainers(): void {
        this.subscriptions.add(this.SlasService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
            }))
    }

    private loadUsers(): void {
        if (this.post.container_id !== null) {

            const params: LoadUsersParams = {
                containerId: this.post.container_id,
                'selected[]': this.post.users._ids
            };

            this.subscriptions.add(this.SlasService.loadUsers(params)
                .subscribe((result: LoadUsersRoot) => {
                    this.users = result.users;
                }))
        }
    }

    private loadTimeperiods(): void {
        if (this.post.container_id !== null) {

            const params: LoadTimeperiodsParams = {
                containerId: this.post.container_id
            };

            this.subscriptions.add(this.SlasService.loadTimeperiods(params)
                .subscribe((result: LoadTimeperiodsRoot) => {
                    this.timeperiods = result.timeperiods;
                }))
        }
    }

    public onContainerChange(): void {
        this.loadUsers();
        this.loadTimeperiods();
    }

    public onReportSendInterval(): void {
        if (this.post.report_send_interval === 'NEVER') {
            //reset unnecessary fields
            this.post.users._ids = [];
            this.post.report_format = 2;
            this.files = [];
            this.send_zip = 0;
        }
    }

    public onSendZipOrFileChange(): void {
        if (this.post.report_send_interval === 'NEVER') {
            return;
        }
        this.post.report_format = this.files.reduce(function (a, b) {
            return a | b;
        }, 0);
        this.post.report_format |= this.send_zip;
    }
}
