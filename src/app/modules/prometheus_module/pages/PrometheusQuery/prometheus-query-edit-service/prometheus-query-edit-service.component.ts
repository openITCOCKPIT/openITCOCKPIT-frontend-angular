import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormLabelDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    PrometheusCodeMirrorComponent
} from '../../../components/prometheus-code-mirror/prometheus-code-mirror.component';
import { PrometheusHelpComponent } from '../../../components/prometheus-help/prometheus-help.component';
import {
    PrometheusThresholdsComponent
} from '../../../components/prometheus-thresholds/prometheus-thresholds.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    getDefaultPrometheusQueryIndexParams,
    LoadCurrentValueByMetricRoot,
    LoadServicetemplates,
    PrometheusEditService,
    PrometheusEditServiceRoot,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot,
    PrometheusQueryIndexTargetDatum,
    Ramsch,
    ValidateService
} from '../prometheus-query.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { AutocompleteItem } from '../../../../../components/code-mirror-container/code-mirror-container.interface';
import { sprintf } from 'sprintf-js';
import { trim } from 'lodash';
import { PrometheusQueryService } from '../prometheus-query.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { HistoryService } from '../../../../../history.service';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-prometheus-query-edit-service',
    imports: [
        ButtonGroupComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        KeyValuePipe,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        PrometheusCodeMirrorComponent,
        PrometheusHelpComponent,
        PrometheusThresholdsComponent,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormsModule,
        BackButtonDirective,
        CardFooterComponent,
        FormLoaderComponent,
        TranslocoPipe
    ],
    templateUrl: './prometheus-query-edit-service.component.html',
    styleUrl: './prometheus-query-edit-service.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusQueryEditServiceComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected serviceId: number = 0;
    protected serviceTemplateId: number = 0;
    protected post: PrometheusEditService = {
        Service: {
            prometheus_alert_rule: {}
        }
    } as PrometheusEditService;
    protected thresholdType: string = 'scalar';
    protected executeResult: string = '';
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected promqlErrors: GenericValidationError = {} as GenericValidationError;
    protected selectedMetrics: string[] = [];
    protected index: PrometheusQueryIndexRoot = {
        targets: {data: [] as PrometheusQueryIndexTargetDatum[]},
        host: {uuid: 'not yet loaded'}
    } as PrometheusQueryIndexRoot;
    protected serviceTemplates: SelectKeyValue[] = [];
    protected hostId: number = 0;
    protected hosts: SelectKeyValue[] = [];
    protected params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
    protected timezone!: TimezoneObject;
    protected metrics: { [key: string]: LoadCurrentValueByMetricRoot } = {};
    protected AutocompleteItems: AutocompleteItem[] = [
        {description: 'host', value: 'host'},
        {description: 'service', value: 'service'},
        {description: 'metric', value: 'metric'},
        {description: 'value', value: 'value'},
        {description: 'unit', value: 'unit'},
        {description: 'time', value: 'time'},
        {description: 'threshold', value: 'threshold'},
        {description: 'thresholdType', value: 'thresholdType'},
        {description: 'thresholdWarn', value: 'thresholdWarn'},
        {description: 'thresholdCrit', value: 'thresholdCrit'},
        {description: 'thresholdLongerThan', value: 'thresholdLongerThan'}
    ];
    protected operators: SelectKeyValueString[] = [
        {key: "==", value: '== (equal)'},
        {key: "!=", value: '!= (not equal)'},
        {key: ">", value: '> (greater-than)'},
        {key: "<", value: '< (less-than)'},
        {key: ">=", value: '>= (greater-or-equal)'},
        {key: "<=", value: '<= (less-or-equal)'},
    ];
    protected onlyAutoOperator: SelectKeyValueString[] = [
        {key: "", value: 'Automatically'}
    ];
    protected longerThanValues: SelectKeyValueString[] = [
        {key: "5s", value: '5 seconds'},
        {key: "10s", value: '10 seconds'},
        {key: "15s", value: '15 seconds'},
        {key: "30s", value: '30 seconds'},
        {key: "1m", value: '1 minute'},
        {key: "90s", value: '1 minute 30 seconds'},
        {key: "2m", value: '2 minutes'},
        {key: "3m", value: '3 minutes'},
        {key: "4m", value: '4 minutes'},
        {key: "5m", value: '5 minutes'},
        {key: "10m", value: '10 minutes'},
        {key: "15m", value: '15 minutes'},
        {key: "20m", value: '20 minutes'},
        {key: "25m", value: '25 minutes'},
        {key: "30m", value: '30 minutes'},
        {key: "40m", value: '40 minutes'},
        {key: "50m", value: '50 minutes'},
        {key: "1h", value: '1 hour'},
        {key: "90m", value: '1 hour 30 minutes'},
        {key: "2h", value: '2 hours'},
        {key: "3h", value: '3 hours'},
        {key: "4h", value: '4 hours'},
        {key: "5h", value: '5 hours'},
        {key: "6h", value: '6 hours'},
        {key: "12h", value: '12 hours'},
        {key: "1d", value: '1 day'}
    ];
    protected thresholdTypes: SelectKeyValueString[] = [
        {key: "scalar", value: 'Scalar'},
        {key: "range_inclusive", value: 'Range Inclusive (≥ 10 and ≤ 20 - inside the range of 10 to 20)'},
        {key: "range_exclusive", value: 'Range Exclusive (< 10 or > 20 - outside the range of 10 to 20)'},
    ];

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));

        this.subscriptions.add(this.PrometheusQueryService.getEditService(this.serviceId)
            .subscribe((result: PrometheusEditServiceRoot) => {
                this.hostId = result.host.id;
                this.post = result.postData;
                this.selectedMetrics = result.selectedMetrics;

                this.loadServicetemplates();
                this.loadIndex();

                this.onMetricsChange();
                this.cdr.markForCheck();
            }));
    }


    private loadIndex(): void {
        let params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
        params.hostId = this.hostId;
        this.subscriptions.add(this.PrometheusQueryService.getIndex(params)
            .subscribe((result: PrometheusQueryIndexRoot) => {
                this.index = result;
                this.cdr.markForCheck();
                this.getUserTimezone();

                if (this.selectedMetrics.length > 0) {
                    this.onMetricsChange();
                }
            }));
    }

    protected onThresholdTypeChange(): void {
        if (this.post.Service.prometheus_alert_rule.threshold_type === 'scalar') {
            this.post.Service.prometheus_alert_rule.warning_operator = '';
            this.post.Service.prometheus_alert_rule.critical_operator = '';
            return;
        }
        this.post.Service.prometheus_alert_rule.warning_operator = '';
        this.post.Service.prometheus_alert_rule.critical_operator = '';
    }

    protected addMetricString(metric: string): void {
        this.post.Service.prometheus_alert_rule.promql += sprintf('%1$s{uuid="%2$s"}', metric, this.index.host.uuid);

    }

    protected addAggregationToString(aggregation: string): void {

        if (this.post.Service.prometheus_alert_rule.promql.length === 0) {
            return;
        }
        this.post.Service.prometheus_alert_rule.promql = sprintf('%1$s(%2$s)', aggregation, trim(this.post.Service.prometheus_alert_rule.promql).replace(
            /\s/g, ',')
        );
    }

    protected addToString(value: string): void {
        this.post.Service.prometheus_alert_rule.promql += value;

    }


    protected execute(): void {
        this.subscriptions.add(this.PrometheusQueryService.loadValueByMetric(this.index.host.uuid, this.post.Service.prometheus_alert_rule.promql)
            .subscribe((result: GenericResponseWrapper) => {
                if (!result.success) {
                    this.notyService.genericError();
                    this.promqlErrors = {"promql": {"error": result.data}};

                    this.cdr.markForCheck();
                    return;
                }
                let a: Ramsch = result.data.metricValue.data.result[0] as Ramsch;
                this.executeResult = '';
                if (typeof (a) !== "undefined") {
                    this.executeResult = a.value[1];
                }
                this.cdr.markForCheck();
            }));
    }

    protected updateService(): void {
        let a: ValidateService = {
            id: this.post.Service.id,
            host_id: this.post.Service.host_id,
            service_id: this.post.Service.id,
            promql: this.post.Service.prometheus_alert_rule.promql,
            unit: this.post.Service.prometheus_alert_rule.unit,
            threshold_type: this.post.Service.prometheus_alert_rule.threshold_type,
            warning_min: this.post.Service.prometheus_alert_rule.warning_min,
            warning_max: this.post.Service.prometheus_alert_rule.warning_max,
            critical_min: this.post.Service.prometheus_alert_rule.critical_min,
            critical_max: this.post.Service.prometheus_alert_rule.critical_max,
            warning_longer_as: this.post.Service.prometheus_alert_rule.warning_longer_as,
            critical_longer_as: this.post.Service.prometheus_alert_rule.critical_longer_as,
            warning_operator: this.post.Service.prometheus_alert_rule.warning_operator,
            critical_operator: this.post.Service.prometheus_alert_rule.critical_operator,
            created: this.post.Service.prometheus_alert_rule.created,
            modified: this.post.Service.prometheus_alert_rule.modified,
            service: this.post.Service.prometheus_alert_rule.service,

            longer_as: this.post.Service.prometheus_alert_rule.warning_longer_as,
            name: this.post.Service.name,
            servicetemplate_id: this.post.Service.servicetemplate_id,
        }
        this.subscriptions.add(this.PrometheusQueryService.validateService(a)
            .subscribe((result: GenericResponseWrapper) => {
                if (!result.success) {
                    this.notyService.genericError();
                    this.errors = result.data;
                    this.cdr.markForCheck();
                    return;
                }
                this.subscriptions.add(this.PrometheusQueryService.updateService(this.post)
                    .subscribe((result: GenericResponseWrapper) => {
                        if (result.success) {
                            this.cdr.markForCheck();

                            const response: { usercontainerrole: GenericIdResponse } = result.data as {
                                usercontainerrole: GenericIdResponse
                            };

                            const title: string = this.TranslocoService.translate('Prometheus Alert rule');
                            const msg: string = this.TranslocoService.translate('saved successfully');
                            const url: (string | number)[] = ['prometheus_module', 'PrometheusQuery', 'editService', this.serviceId];

                            this.notyService.genericSuccess(msg, title, url);

                            this.HistoryService.navigateWithFallback([`/prometheus_module/PrometheusAlertRules/index/${this.hostId}/`]);
                            return;
                        }

                        // Error
                        this.notyService.genericError();
                        const errorResponse: GenericValidationError = result.data as GenericValidationError;
                        if (result) {
                            this.errors = errorResponse;

                            console.warn(this.errors);
                        }
                        if (!result.success) {
                            this.notyService.genericError();
                            this.errors = result.data;
                            this.cdr.markForCheck();
                            return;
                        }

                        this.cdr.markForCheck();
                    })
                );
            })
        );
    }

    protected showModal(): void {
        this.modalService.toggle({
            show: true,
            id: 'promQLHelpModal'
        });
        this.cdr.markForCheck();
    }

    protected onMetricsChange(): void {
        this.selectedMetrics.forEach(metric => {
            this.subscriptions.add(this.PrometheusQueryService.loadCurrentValueByMetric(this.index.host.uuid, metric)
                .subscribe((result: LoadCurrentValueByMetricRoot) => {
                    this.metrics[metric] = result;
                    console.warn(this.metrics);

                    this.cdr.markForCheck();
                }));
        });
    }

    private loadServicetemplates(): void {
        this.subscriptions.add(this.PrometheusQueryService.loadServiceTemplates(this.hostId)
            .subscribe((result: LoadServicetemplates) => {
                this.serviceTemplates = result.servicetemplates;
                this.cdr.markForCheck();
            }));
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

}
