import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../Slas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { Report, ReportError, Sla, SlasGeneratePost, SlasGeneratePostResponse } from '../Slas.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { SlasGenerateReportFormatEnum, SlasGenerateTabs } from '../slas.enum';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
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
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { saveAs } from 'file-saver';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';

@Component({
    selector: 'oitc-slas-generate',
    standalone: true,
    imports: [
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        CoreuiComponent,
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
        NgIf,
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
        NgClass,
        NgForOf,
        AlertComponent,
        RowComponent,
        ColComponent,
        TableLoaderComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        BadgeComponent,
        AsyncPipe,
    ],
    templateUrl: './slas-generate.component.html',
    styleUrl: './slas-generate.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasGenerateComponent implements OnInit, OnDestroy {

    private readonly SlasService: SlasService = inject(SlasService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public report_error: ReportError | null = null;
    public post: SlasGeneratePost = {} as SlasGeneratePost;
    protected slaId: number = 0;

    public tabName: string = SlasGenerateTabs.ReportConfig;
    public reportWasGenerated: boolean = false;
    public isGenerating: boolean = false;
    public report: Report = {} as Report;
    public sla: Sla = {} as Sla;
    public slas: Sla[] = [];
    public logoUrl: string = '';
    public reportMessage: { successMessage: string, errorMessage: string } = {
        successMessage: this.TranslocoService.translate('Report created successfully'),
        errorMessage: this.TranslocoService.translate('Report could not be created')
    };

    protected reportFormats = [
        {key: SlasGenerateReportFormatEnum.REPORT_FORMAT_PDF, value: this.TranslocoService.translate('PDF')},
        {key: SlasGenerateReportFormatEnum.REPORT_FORMAT_HTML, value: this.TranslocoService.translate('HTML')},
        {key: SlasGenerateReportFormatEnum.REPORT_FORMAT_CSV, value: this.TranslocoService.translate('CSV')},
    ]
    protected radioButtonValues = [1, 2, 3];

    public from = "";
    public to = "";
    private cdr = inject(ChangeDetectorRef);

    private getDefaultPost(id: number): SlasGeneratePost {
        let now = new Date();
        return {
            Sla: {
                id: id,
                format: 'html',
                from_date: new Date(now.getTime() - (3600 * 24 * 30 * 1000)),
                to_date: new Date(now.getTime() + (3600 * 24 * 5)),
                evaluation: 2
            }
        };
    }

    public ngOnInit() {
        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.post = this.getDefaultPost(this.slaId);
        this.from = formatDate(this.post.Sla.from_date, 'yyyy-MM-dd', 'en-US');
        this.to = formatDate(this.post.Sla.to_date, 'yyyy-MM-dd', 'en-US');
        this.cdr.markForCheck();
        this.loadSlas();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadSlas() {
        this.subscriptions.add(this.SlasService.loadGenerateReport()
            .subscribe((result) => {
                this.slas = result.slas;
                this.cdr.markForCheck();
            }));
    }

    public submit(): void {

        // Update from and to date in $scope.post from date picker input fields
        this.post.Sla.from_date = formatDate(new Date(this.from), 'dd.MM.y', 'en-US');
        this.post.Sla.to_date = formatDate(new Date(this.to), 'dd.MM.y', 'en-US');

        if (this.post.Sla.format === 'pdf' || this.post.Sla.format === 'zip') { //zip => csv
            //Run POST request to check if the report could be generated at all / validation
            this.isGenerating = true;
            this.reportWasGenerated = false;
            this.subscriptions.add(this.SlasService.generateReportPost(this.post)
                .subscribe((POSTresult) => {
                    this.cdr.markForCheck();
                    if (POSTresult.success) {
                        this.errors = null;
                        this.report_error = null;

                        //Download PDF Report
                        let GETParams = {
                            'angular': true,
                            'Sla[id]': this.post.Sla.id,
                            'Sla[evaluation]': this.post.Sla.evaluation,
                            'Sla[from_date]': this.post.Sla.from_date,
                            'Sla[to_date]': this.post.Sla.to_date,
                        };

                        if (this.post.Sla.format === 'pdf') {
                            this.subscriptions.add(this.SlasService.generateReportPdf({
                                params: GETParams,
                                responseType: 'blob'
                            }).subscribe((res) => {
                                this.cdr.markForCheck();
                                this.isGenerating = false;
                                let blob = new Blob([res], {type: "application/pdf"});
                                saveAs(blob, POSTresult.data.filename);
                            }))
                        }
                        if (this.post.Sla.format === 'zip') { //zip => csv

                            this.subscriptions.add(this.SlasService.generateReportZip({
                                params: GETParams,
                                responseType: 'blob'
                            }).subscribe((res) => {
                                this.cdr.markForCheck();
                                this.isGenerating = false;
                                let blob = new Blob([res], {type: "application/zip"});
                                saveAs(blob, POSTresult.data.filename);
                            }))
                        }

                        return;
                    }

                    // Error
                    const errorResponse = POSTresult.data as GenericValidationError;
                    this.notyService.genericError(this.reportMessage.errorMessage);
                    if (POSTresult) {
                        this.isGenerating = false;
                        this.errors = errorResponse;
                        if (POSTresult.data.hasOwnProperty('report_error')) {
                            this.report_error = POSTresult.data.report_error;
                        }
                    }
                }));

        } else {
            //HTML Report
            this.reportWasGenerated = false;
            this.isGenerating = true;
            this.post.Sla.from_date = formatDate(new Date(this.from), 'dd.MM.y', 'en-US');
            this.post.Sla.to_date = formatDate(new Date(this.to), 'dd.MM.y', 'en-US');
            this.subscriptions.add(this.SlasService.generateReportPost(this.post)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {

                        const response = result.data as SlasGeneratePostResponse;

                        this.report = {} as Report;
                        this.errors = null;
                        this.report_error = null;
                        this.tabName = 'showReport';
                        this.reportWasGenerated = true;
                        this.isGenerating = false;
                        this.report = response.report;
                        this.sla = response.sla;
                        this.logoUrl = response.logoUrl;
                        this.cdr.markForCheck();
                        this.notyService.genericSuccess(this.reportMessage.successMessage);
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError(this.reportMessage.errorMessage);
                    if (result) {
                        this.isGenerating = false;
                        this.errors = errorResponse;
                        if (result.data.hasOwnProperty('report_error')) {
                            this.report_error = result.data.report_error;
                        }
                    }
                }));
        }
    }

    public changeTab(newTab: SlasGenerateTabs): void {
        this.tabName = newTab;
    }

    protected readonly SlasGenerateTabs = SlasGenerateTabs;
}
