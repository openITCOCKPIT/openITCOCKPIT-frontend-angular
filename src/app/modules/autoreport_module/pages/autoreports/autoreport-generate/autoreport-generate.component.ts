import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, ContainerComponent, FormControlDirective, FormDirective, FormLabelDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import {
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    formatDate,
    NgClass,
    NgForOf,
    NgIf,
    NgOptimizedImage
} from '@angular/common';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    AutoreportsIndexRoot,
    AutoreportIndex,
    ReportError
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
        CardFooterComponent,
        ColComponent,
        FormDirective,
        ContainerComponent,
        NgForOf,
        DecimalPipe,
        AlertComponent,
        AsyncPipe,
    ],
  templateUrl: './autoreport-generate.component.html',
  styleUrl: './../../../assets/autoreport.css',//'./autoreport-generate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportGenerateComponent implements OnInit, OnDestroy {

    private nowDate = new Date();
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);



    public id: number = 0;
    public tabName: string = 'reportConfig';
    public reportWasGenerated:boolean = false;
    public isGenerating: boolean = true;
    public errors: GenericValidationError | null = null;
    public report_error: ReportError | null = null;

    public autoreports!: AutoreportIndex[];
    public report:any;
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
        {key: 'pdf', value: this.TranslocoService.translate('PDV')},
        {key: 'html', value: this.TranslocoService.translate('HTML')},
        {key: 'csv', value: this.TranslocoService.translate('CSV')},
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

    public onReportChange() {

    }
    public onFormatChange() {

    }

    public submitReport() {
        this.report_error = null;
        this.post.Autoreport.from_date = formatDate(this.from, 'dd.MM.y', 'en-US');
        this.post.Autoreport.to_date = formatDate(this.to, 'dd.MM.y', 'en-US');

        if (this.post.Autoreport.format === 'pdf' || this.post.Autoreport.format === 'zip') {
        } else {
            this.reportWasGenerated = false;
            this.isGenerating = true;
            this.errors = null;


            this.subscriptions.add(this.AutoreportsService.generateHtmlReport(this.post).subscribe((result: GenericResponseWrapper): void => {
                        if (result.success) {
                            this.errors = null;
                            this.tabName = 'showReport';
                            this.reportWasGenerated = true;
                            this.isGenerating = false;
                            this.report = result.data.report;
                            this.logoUrl = result.data.logoUrl;

                            for(var hostIndex in this.report.autoreport.hosts){
                                this.reportHostIds.push(this.report.autoreport.hosts[hostIndex].id);
                            }
                            this.notyService.genericSuccess(this.TranslocoService.translate('Report created successfully'));


                        } else {
                            this.isGenerating = false;
                            this.notyService.genericError(this.TranslocoService.translate('Report could not be created'));
                            console.log(result.data)
                            if (result.data.hasOwnProperty('error')) {
                                this.errors = result.data.error;
                                this.cdr.markForCheck();
                            }

                            if (result.data.hasOwnProperty('report_error')) {
                                this.report_error = result.data.report_error;
                                this.cdr.markForCheck();
                            }

                           /* this.errors = result.data as GenericValidationError;
                            this.notyService.genericError(); */
                        }

                        this.cdr.markForCheck();
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
        //console.log(Object.keys(servicesObject));
        return Object.keys(servicesObject);
    }

    public hasGraph(hostUuid: string, serviceUuid: string){
        if(typeof this.report !== "undefined"){
            if(this.report.hasOwnProperty('GraphImageBlobs')){
                if(this.report.GraphImageBlobs.hasOwnProperty(hostUuid)){
                    if(this.report.GraphImageBlobs[hostUuid].hasOwnProperty(serviceUuid)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
