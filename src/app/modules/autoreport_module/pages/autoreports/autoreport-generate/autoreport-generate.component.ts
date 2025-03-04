import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, ContainerComponent, FormControlDirective, FormDirective, FormLabelDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import {
    AsyncPipe,
    DecimalPipe,
    formatDate,
    NgClass,
    NgForOf,
    NgIf,
    KeyValuePipe
} from '@angular/common';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    AutoreportIndex,
    ReportError,
    GenerateResponse
} from '../autoreports.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { DateTime } from 'luxon';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'oitc-autoreport-generate',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        NgIf,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        BackButtonDirective,
        NavItemComponent,
        XsButtonDirective,
        NgClass,
        CardBodyComponent,
        RowComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        ReactiveFormsModule,
        FormsModule,
        ColComponent,
        NgForOf,
        DecimalPipe,
        AlertComponent,
        AsyncPipe,
        KeyValuePipe,
        FormDirective,
    ],
  templateUrl: './autoreport-generate.component.html',
  styleUrl: './autoreport-generate.component.css', //'./../../../assets/autoreport.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportGenerateComponent implements OnInit, OnDestroy {

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    protected readonly keepOrder = keepOrder;

    public id: number = 0;
    public tabName: string = 'reportConfig';
    public reportWasGenerated:boolean = false;
    public isGenerating: boolean = false;
    public errors: GenericValidationError | null = null;
    public report_error: ReportError | null = null;

    public autoreports!: AutoreportIndex[];
    public report!:GenerateResponse;
    public reportHostIds: number[] = [];
    public logoUrl:string = '';
    private now = DateTime.now();
    public post = {
        Autoreport: {
            id: this.id,
            format: 'html',
            from_date: this.now.minus({ days: 30 }).toISODate(),
            to_date: this.now.toISODate()
        }
    };
    public from = "";
    public to = "";
    public formatOptions: SelectKeyValueString[] = [
        {key: 'pdf', value: this.TranslocoService.translate('PDF')},
        {key: 'html', value: this.TranslocoService.translate('HTML')},
        {key: 'zip', value: this.TranslocoService.translate('CSV')},
    ];

    public ngOnInit(): void {
        this.from = this.post.Autoreport.from_date;
        this.to = this.post.Autoreport.to_date;
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.post.Autoreport.id = this.id;
        this.loadAutoreports()
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadAutoreports(): void {
        this.subscriptions.add(this.AutoreportsService.getAutreportsGenerateIndex().subscribe(data => {
            this.autoreports = data.autoreports;
            this.cdr.markForCheck();
        }));
    }

    public submitReport() {
        this.report_error = null;
       // this.report = null;
        this.cdr.markForCheck();
        this.post.Autoreport.from_date = formatDate(this.from, 'dd.MM.y', 'en-US');
        this.post.Autoreport.to_date = formatDate(this.to, 'dd.MM.y', 'en-US');

        if (this.post.Autoreport.format === 'pdf' || this.post.Autoreport.format === 'zip') {
            this.isGenerating = true;
            this.reportWasGenerated = false;
            this.subscriptions.add(this.AutoreportsService.generateReport(this.post).subscribe((POSTresult: GenericResponseWrapper): void => {
                this.cdr.markForCheck();
                if (POSTresult.success) {
                    this.errors = null;
                    this.report_error = null;

                    //Download PDF Report
                    let GETParams = {
                        angular: true,
                        'data[id]': this.post.Autoreport.id,
                        'data[from_date]': this.post.Autoreport.from_date,
                        'data[to_date]': this.post.Autoreport.to_date
                    };
                    if (this.post.Autoreport.format === 'pdf') {
                        this.subscriptions.add(this.AutoreportsService.generateReportPdf({
                            params: GETParams,
                            responseType: 'blob'
                        }).subscribe((res) => {
                            this.cdr.markForCheck();
                            this.isGenerating = false;
                            let blob = new Blob([res], {type: "application/pdf"});
                            saveAs(blob, POSTresult.data.filename);
                        }))
                    }
                    if (this.post.Autoreport.format === 'zip') { //zip => csv

                        this.subscriptions.add(this.AutoreportsService.generateReportZip({
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
                const errorResponse = POSTresult.data as GenericValidationError;
                this.notyService.genericError(this.TranslocoService.translate('Report could not be created'));
                if (POSTresult) {
                    this.isGenerating = false;

                    if (POSTresult.data.hasOwnProperty('error')) {
                        this.errors = POSTresult.data.error;
                        this.cdr.markForCheck();
                    }

                    if (POSTresult.data.hasOwnProperty('report_error')) {
                        this.report_error = POSTresult.data.report_error;
                        this.cdr.markForCheck();
                    }
                }

            }));
        } else {
            this.reportWasGenerated = false;
            this.isGenerating = true;
            this.errors = null;
            this.subscriptions.add(this.AutoreportsService.generateReport(this.post).subscribe((result: GenericResponseWrapper): void => {
                        if (result.success) {
                            this.errors = null;

                            this.reportWasGenerated = true;
                            this.isGenerating = false;
                            this.report = result.data.report;
                            this.logoUrl = result.data.logoUrl;
                            this.reportHostIds = [];
                            for(var hostIndex in this.report.autoreport.hosts){
                                this.reportHostIds.push(this.report.autoreport.hosts[hostIndex].id);
                            }
                            this.notyService.genericSuccess(this.TranslocoService.translate('Report created successfully'));
                            this.tabName = 'showReport';
                            this.cdr.markForCheck();


                        } else {
                            this.isGenerating = false;
                            this.notyService.genericError(this.TranslocoService.translate('Report could not be created'));
                            if (result.data.hasOwnProperty('error')) {
                                this.errors = result.data.error;
                                this.cdr.markForCheck();
                            }

                            if (result.data.hasOwnProperty('report_error')) {
                                let error: ReportError = {
                                    error: result.data.report_error.error,
                                    message: result.data.report_error.message,
                                    objects: (result.data.report_error.objects) ? Object.values(result.data.report_error.objects) : []
                                }
                                this.report_error = error;
                                //this.report_error = result.data.report_error;

                                this.cdr.markForCheck();
                            }
                        }

                    }
                )
            );
        }
    }

    public hasBitValue(option:any, value: any){
        return option & value;
    }

    public checkIfHostInReport(hostId: number){
        return  (this.reportHostIds.indexOf(hostId) !== -1);
    }

    public getServiceKeys(servicesObject: any) {
        return Object.keys(servicesObject);
    }

    public hasGraph(hostUuid: string, serviceUuid: string){
        if(typeof this.report !== "undefined"){
            if(this.report.hasOwnProperty('GraphImageBlobs')){
                if(this.report.GraphImageBlobs.hasOwnProperty(hostUuid)){
                    // @ts-ignore
                    if(this.report.GraphImageBlobs[hostUuid].hasOwnProperty(serviceUuid)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

}

const keepOrder = (a: any, b: any) => a;


