import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    HostRadialbarChartComponent
} from '../../../components/charts/host-radialbar-chart/host-radialbar-chart.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { InstantreportFormats } from '../instantreports.enums';
import {
    getDefaultInstantreportGenerateParams,
    InstantreportGenerateParams,
    InstantreportsReportPdfParams
} from '../instantreports.interface';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { InstantreportsService } from '../instantreports.service';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-instantreports-generate',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormLoaderComponent,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        CardFooterComponent,
        RouterLink,
        NgClass,
        HostRadialbarChartComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        RequiredIconComponent,
        SelectComponent
    ],
    templateUrl: './instantreports-generate.component.html',
    styleUrl: './instantreports-generate.component.css'
})
export class InstantreportsGenerateComponent implements OnInit, OnDestroy {
    public isGeneratingReport: boolean = false;
    public selectedTab: 'generate' | 'report' = 'generate';
    public errors: GenericValidationError | null = null;

    public instantreports: SelectKeyValue[] = [];
    public params: InstantreportGenerateParams = getDefaultInstantreportGenerateParams();

    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly InstantreportsService: InstantreportsService = inject(InstantreportsService);
    private readonly route = inject(ActivatedRoute);
    private readonly notyService = inject(NotyService);

    protected readonly ReportFormatsSelect: SelectKeyValue[] = [
        {
            key: InstantreportFormats.PDF,
            value: this.TranslocoService.translate('PDF')
        },
        {
            key: InstantreportFormats.HTML,
            value: this.TranslocoService.translate('HTML')
        },
    ];

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.InstantreportsService.loadInstantreports()
            .subscribe((result) => {
                this.instantreports = result;
                this.params.instantreport_id = id;
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeTab(tab: 'generate' | 'report') {
        this.selectedTab = tab;
    }

    public generateReport() {
        if (this.params.report_format === InstantreportFormats.PDF) {
            // Create PDF Report
            this.isGeneratingReport = true;

            const params: InstantreportsReportPdfParams = {
                angular: true,
                'data[instantreport_id]': this.params.instantreport_id,
                'data[from_date]': this.params.from_date,
                'data[to_date]': this.params.to_date
            }

            this.subscriptions.add(this.InstantreportsService.validateReportFormForPdf(params)
                .subscribe((result) => {
                    if (result.success) {
                        // Success - Form data is valid - now we can generate the report
                        const filename = result.data.filename;
                        this.subscriptions.add(this.InstantreportsService.generateReportPdf(params).subscribe({
                            next: (data: Blob) => {
                                this.isGeneratingReport = false;
                                const blob = new Blob([data], {type: 'application/pdf'});

                                // Open save as dialog in all browsers
                                saveAs(blob, filename);
                            },
                            error: (data: any) => {
                                this.notyService.genericError(
                                    this.TranslocoService.translate('An error occured while generating the report')
                                );
                            }
                        }));
                    } else {
                        // Error - dispaly form validation errors
                        this.isGeneratingReport = false;
                        this.notyService.genericError();
                        this.errors = result.data as GenericValidationError;
                    }
                })
            );
        }

        if (this.params.report_format === InstantreportFormats.HTML) {
            
        }
    }

}
