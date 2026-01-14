import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../slas.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SlaPost, SlaPostResponse } from '../slas.interface';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { SlasReportFormatEnum } from '../slas.enum';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
    NavItemComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { AsyncPipe } from '@angular/common';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { UsersService } from '../../../../../pages/users/users.service';
import { TimeperiodsService } from '../../../../../pages/timeperiods/timeperiods.service';

@Component({
    selector: 'oitc-slas-edit',
    imports: [
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    FaIconComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    BackButtonDirective,
    CardBodyComponent,
    RequiredIconComponent,
    SelectComponent,
    FormErrorDirective,
    FormFeedbackComponent,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    TimeperiodDetailsTooltipComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    TrueFalseDirective,
    FormCheckLabelDirective,
    MultiSelectComponent,
    CardFooterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    FaStackComponent,
    FaStackItemSizeDirective,
    PermissionDirective,
    FormLoaderComponent,
    AsyncPipe
],
    templateUrl: './slas-edit.component.html',
    styleUrl: './slas-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasEditComponent implements OnInit, OnDestroy {

    private readonly SlasService: SlasService = inject(SlasService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);

    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post!: SlaPost;
    protected slaId: number = 0;
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
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.SlasService.getEdit(this.slaId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.post = result.sla;
                this.send_zip = this.post.report_format & this.filetypes.zip;
                if (this.post.report_format & this.filetypes.pdf) {
                    this.files.push(this.filetypes.pdf);
                }
                if (this.post.report_format & this.filetypes.csv) {
                    this.files.push(this.filetypes.csv);
                }
                this.loadContainers();
                this.loadTimeperiods();
                this.loadUsers();

                this.onReportSendInterval();
                this.onSendZipOrFileChange();
            }));

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateSla(redirectToHostMappingRules: boolean = false): void {
        this.subscriptions.add(this.SlasService.updateSla(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as SlaPostResponse;
                    const title = this.TranslocoService.translate('SLA');
                    const msg = this.TranslocoService.translate('updated successfully');
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

    private loadContainers() {
        if (!this.post.container_id) {
            return;
        }
        this.subscriptions.add(this.ContainersService.loadAllContainers().subscribe((result) => {
            this.containers = result;
            this.cdr.markForCheck();
        }));
    }

    private loadUsers() {
        if (!this.post.container_id) {
            return;
        }
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(this.post.container_id, this.post.users._ids).subscribe((result) => {
            this.users = result;
            this.cdr.markForCheck();
        }));
    }


    private loadTimeperiods() {
        if (!this.post.container_id) {
            return;
        }
        this.subscriptions.add(this.TimeperiodsService.loadTimeperiodsByContainerId(this.post.container_id).subscribe((result) => {
            this.timeperiods = result;
            this.cdr.markForCheck();
        }));
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
            this.cdr.markForCheck();
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
        this.cdr.markForCheck();
    }
}
