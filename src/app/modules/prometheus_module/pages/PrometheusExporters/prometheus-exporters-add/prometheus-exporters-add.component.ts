import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PrometheusExportersService } from '../prometheus-exporters.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { HistoryService } from '../../../../../history.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PrometheusExporterAddRoot } from '../prometheus-exporters.interface';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';

@Component({
    selector: 'oitc-prometheus-exporters-add',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgOptionComponent,
        NgSelectComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './prometheus-exporters-add.component.html',
    styleUrl: './prometheus-exporters-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusExportersAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusExportersService: PrometheusExportersService = inject(PrometheusExportersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    protected post: PrometheusExporterAddRoot = this.getDefaultPost();
    protected createAnother: boolean = false;
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected intervals: SelectKeyValueString[] = [
        {key: "15s", value: "15 seconds"},
        {key: "30s", value: "30 seconds"},
        {key: "1m", value: "1 minute"},
        {key: "90s", value: "1 minute 30 seconds"},
        {key: "2m", value: "2 minutes"},
        {key: "5m", value: "5 minutes"},
        {key: "10m", value: "10 minutes"},
        {key: "30m", value: "30 minutes"},
        {key: "1h", value: "1 hour"}
    ];

    public ngOnInit() {
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadContainers(): void {
        this.subscriptions.add(this.PrometheusExportersService.loadContainers()
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }))
    }

    public submit(): void {
        this.subscriptions.add(this.PrometheusExportersService.add(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();


                if (result.success) {
                    const response: { usergroup: GenericIdResponse } = result.data as { usergroup: GenericIdResponse };

                    const title: string = this.TranslocoService.translate('Prometheus Exporter');
                    const msg: string = this.TranslocoService.translate('created successfully');
                    const url: (string | number)[] = ['prometheus_module', 'PrometheusExporters', 'edit', result.data.PrometheusExporter.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/usergroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = {} as GenericValidationError;
                    this.notyService.scrollContentDivToTop();

                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }

    private getDefaultPost(): PrometheusExporterAddRoot {
        return {
            PrometheusExporter: {
                name: '',
                container_id: 0,
                metric_path: '/metrics',
                port: 9010,
                scrape_interval: '30s',
                scrape_timeout: '15s',
                service: '',
                yaml: '',
                add_target_port: true
            }
        } as PrometheusExporterAddRoot
    }
}
