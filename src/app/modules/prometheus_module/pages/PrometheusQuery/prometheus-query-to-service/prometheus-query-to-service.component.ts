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
import {
    EditablePrometheusAlertRule,
    getDefaultPrometheusQueryIndexParams,
    LoadCurrentValueByMetricRoot,
    LoadServicetemplates,
    PrometheusCreateService,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot,
    PrometheusQueryIndexTargetDatum,
    Ramsch,
    ValidateService
} from '../prometheus-query.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { PrometheusQueryService } from '../prometheus-query.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { KeyValuePipe } from '@angular/common';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { AutocompleteItem } from '../../../../../components/code-mirror-container/code-mirror-container.interface';
import { PrometheusAutocompleteService } from '../prometheus-autocomplete.service';
import {
    PrometheusCodeMirrorComponent
} from '../../../components/prometheus-code-mirror/prometheus-code-mirror.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    PrometheusThresholdsComponent
} from '../../../components/prometheus-thresholds/prometheus-thresholds.component';
import { sprintf } from 'sprintf-js';
import { trim } from 'lodash';
import { PrometheusHelpComponent } from '../../../components/prometheus-help/prometheus-help.component';
import { PrometheusThresholdType } from '../prometheus.enum';

@Component({
    selector: 'oitc-prometheus-query-to-service',
    imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    SelectComponent,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    ColComponent,
    FormControlDirective,
    FormsModule,
    MultiSelectComponent,
    ReactiveFormsModule,
    RowComponent,
    TranslocoPipe,
    TableDirective,
    RequiredIconComponent,
    FormErrorDirective,
    KeyValuePipe,
    PrometheusCodeMirrorComponent,
    FormCheckInputDirective,
    ButtonGroupComponent,
    FormFeedbackComponent,
    PrometheusThresholdsComponent,
    PrometheusHelpComponent,
    CardFooterComponent
],
    templateUrl: './prometheus-query-to-service.component.html',
    styleUrl: './prometheus-query-to-service.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusQueryToServiceComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private readonly PrometheusAutocompleteService: PrometheusAutocompleteService = inject(PrometheusAutocompleteService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected serviceTemplateId: number = 0;
    protected createServicesArray: PrometheusCreateService[] = [];
    protected ValidateService: ValidateService = this.createDefaultValidateService();
    protected createAnother: boolean = false;
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
        this.hostId = Number(this.route.snapshot.paramMap.get('hostId'));
        this.loadServicetemplates(this.hostId);
        let params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
        params.hostId = this.hostId;

        this.subscriptions.add(this.PrometheusQueryService.getIndex(params)
            .subscribe((result: PrometheusQueryIndexRoot) => {
                this.index = result;
                this.cdr.markForCheck();
                this.route.queryParams.subscribe(params => {
                    let myMetrix = params['metrics[]'];
                    if (typeof (myMetrix) === "string") {
                        this.selectedMetrics = [myMetrix];
                    } else {
                        this.selectedMetrics = myMetrix;
                    }
                });
                this.getUserTimezone();

                if (this.selectedMetrics && this.selectedMetrics.length > 0) {
                    this.onMetricsChange();
                }
            }));
    }

    private createDefaultValidateService(): ValidateService {
        return {
            longer_as: '1m',
            name: '',
            promql: '',
            unit: '',
            warning_max: null,
            critical_max: null,
            threshold_type: PrometheusThresholdType.scalar,
            warning_longer_as: '1m',
            critical_longer_as: '2m',
            warning_operator: 'automatically',
            critical_operator: 'automatically',
        } as ValidateService;
    }

    protected onThresholdTypeChange(): void {
        if (this.ValidateService.threshold_type === PrometheusThresholdType.scalar) {
            this.ValidateService.warning_max = null;
            this.ValidateService.critical_max = null;
            this.ValidateService.warning_operator = '';
            this.ValidateService.critical_operator = '';
            return;
        }
        this.ValidateService.warning_operator = '';
        this.ValidateService.critical_operator = '';
    }

    protected addMetricString(metric: string): void {
        this.ValidateService.promql += sprintf('%1$s{uuid="%2$s"}', metric, this.index.host.uuid);

    }

    protected addAggregationToString(aggregation: string): void {

        if (this.ValidateService.promql.length === 0) {
            return;
        }
        this.ValidateService.promql = sprintf('%1$s(%2$s)', aggregation, trim(this.ValidateService.promql).replace(
            /\s/g, ',')
        );
    }

    protected addToString(value: string): void {
        this.ValidateService.promql += value;

    }


    protected execute(): void {
        this.subscriptions.add(this.PrometheusQueryService.loadValueByMetric(this.index.host.uuid, this.ValidateService.promql)
            .subscribe((result: GenericResponseWrapper) => {
                if (!result.success) {
                    this.notyService.genericError();
                    this.promqlErrors = {"promql": {"error": result.data}};

                    this.cdr.markForCheck();
                    return;
                }
                let a: Ramsch = result.data.metricValue.data.result[0] as Ramsch;
                this.promqlErrors = {} as GenericValidationError;
                this.executeResult = '';
                if (typeof (a) !== "undefined") {
                    this.executeResult = a.value[1];
                }
                this.cdr.markForCheck();
            }));
    }

    protected removeService(index: number): void {
        this.createServicesArray.splice(index, 1);
    }


    protected createServices(): void {
        this.createServicesArray.forEach((service: PrometheusCreateService) => {
            this.subscriptions.add(this.PrometheusQueryService.createServices(service)
                .subscribe((result: GenericResponseWrapper) => {
                    if (!result.success) {
                        this.notyService.genericError();
                        this.errors = result.data;
                        this.cdr.markForCheck();
                        return;
                    }
                    this.router.navigate(['/prometheus_module/PrometheusAlertRules/index/' + this.hostId]);
                }));
        });

    }

    protected validateService(): void {
        this.subscriptions.add(this.PrometheusQueryService.validateService(this.ValidateService)
            .subscribe((result: GenericResponseWrapper) => {
                if (!result.success) {
                    this.notyService.genericError();
                    this.errors = result.data;
                    this.cdr.markForCheck();
                    return;
                }

                let createService: PrometheusCreateService = {
                    host_id: `${this.hostId}`,
                    name: this.ValidateService.name,
                    prometheus_alert_rule: {
                        critical_longer_as: this.ValidateService.critical_longer_as,
                        critical_max: this.ValidateService.critical_max,
                        critical_min: this.ValidateService.critical_min,
                        critical_operator: this.ValidateService.critical_operator,

                        host_id: this.hostId,

                        promql: this.ValidateService.promql,

                        servicetemplate_id: this.ValidateService.servicetemplate_id,
                        threshold_type: this.ValidateService.threshold_type,
                        unit: this.ValidateService.unit,

                        warning_longer_as: this.ValidateService.warning_longer_as,
                        warning_max: this.ValidateService.warning_max,
                        warning_min: this.ValidateService.warning_min,
                        warning_operator: this.ValidateService.warning_operator,
                    } as EditablePrometheusAlertRule,
                    servicetemplate_id: this.ValidateService.servicetemplate_id,
                };

                this.createServicesArray.push(createService);

                this.errors = {} as GenericValidationError;

                if (!this.createAnother) {
                    this.ValidateService = this.createDefaultValidateService();
                }

                this.cdr.markForCheck();
            }));
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

                    this.cdr.markForCheck();
                }));
        });
    }

    private loadServicetemplates(hostId: number): void {
        this.subscriptions.add(this.PrometheusQueryService.loadServiceTemplates(hostId)
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

    protected readonly PrometheusThresholdType = PrometheusThresholdType;
}
