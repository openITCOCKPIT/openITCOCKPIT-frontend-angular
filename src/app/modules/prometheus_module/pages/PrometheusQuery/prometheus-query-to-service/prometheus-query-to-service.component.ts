import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
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
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { AutocompleteItem } from '../../../../../components/code-mirror-container/code-mirror-container.interface';
import { PrometheusAutocompleteService } from '../prometheus-autocomplete.service';
import { MetadataResponseRoot } from '../prometheus-autocomplete.interface';
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
        NgIf,
        NgForOf,
        TableDirective,
        RequiredIconComponent,
        FormErrorDirective,
        KeyValuePipe,
        PrometheusCodeMirrorComponent,
        FormCheckInputDirective,
        ButtonGroupComponent,
        FormFeedbackComponent,
        PrometheusThresholdsComponent,
        PrometheusHelpComponent
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
                    console.log(this.selectedMetrics);
                });
                this.getMetadata();
                this.getUserTimezone();

                if (this.selectedMetrics.length > 0) {
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
            threshold_type: 'scalar',
            warning_longer_as: '1m',
            critical_longer_as: '2m',
            warning_operator: 'automatically',
            critical_operator: 'automatically',
        } as ValidateService;
    }

    protected onThresholdTypeChange(): void {
        if (this.ValidateService.threshold_type === 'scalar') {
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
                        console.debug(this.errors);
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
                    console.warn(this.metrics);

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

    private getMetadata(): void {
        let originalData: MetadataResponseRoot = {
            "data": {
                "apt_autoremove_pending": [
                    {
                        "type": "gauge",
                        "help": "Apt package pending autoremove.",
                        "unit": ""
                    }
                ],
                "apt_upgrades_pending": [
                    {
                        "type": "gauge",
                        "help": "Apt package pending updates by origin.",
                        "unit": ""
                    }
                ],
                "go_gc_duration_seconds": [
                    {
                        "type": "summary",
                        "help": "A summary of the pause duration of garbage collection cycles.",
                        "unit": ""
                    }
                ],
                "go_goroutines": [
                    {
                        "type": "gauge",
                        "help": "Number of goroutines that currently exist.",
                        "unit": ""
                    }
                ],
                "go_info": [
                    {
                        "type": "gauge",
                        "help": "Information about the Go environment.",
                        "unit": ""
                    }
                ],
                "go_memstats_alloc_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes allocated and still in use.",
                        "unit": ""
                    }
                ],
                "go_memstats_alloc_bytes_total": [
                    {
                        "type": "counter",
                        "help": "Total number of bytes allocated, even if freed.",
                        "unit": ""
                    }
                ],
                "go_memstats_buck_hash_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes used by the profiling bucket hash table.",
                        "unit": ""
                    }
                ],
                "go_memstats_frees_total": [
                    {
                        "type": "counter",
                        "help": "Total number of frees.",
                        "unit": ""
                    }
                ],
                "go_memstats_gc_cpu_fraction": [
                    {
                        "type": "gauge",
                        "help": "The fraction of this program's available CPU time used by the GC since the program started.",
                        "unit": ""
                    }
                ],
                "go_memstats_gc_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes used for garbage collection system metadata.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_alloc_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes allocated and still in use.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_idle_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes waiting to be used.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_inuse_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes that are in use.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_objects": [
                    {
                        "type": "gauge",
                        "help": "Number of allocated objects.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_released_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes released to OS.",
                        "unit": ""
                    }
                ],
                "go_memstats_heap_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes obtained from system.",
                        "unit": ""
                    }
                ],
                "go_memstats_last_gc_time_seconds": [
                    {
                        "type": "gauge",
                        "help": "Number of seconds since 1970 of last garbage collection.",
                        "unit": ""
                    }
                ],
                "go_memstats_lookups_total": [
                    {
                        "type": "counter",
                        "help": "Total number of pointer lookups.",
                        "unit": ""
                    }
                ],
                "go_memstats_mallocs_total": [
                    {
                        "type": "counter",
                        "help": "Total number of mallocs.",
                        "unit": ""
                    }
                ],
                "go_memstats_mcache_inuse_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes in use by mcache structures.",
                        "unit": ""
                    }
                ],
                "go_memstats_mcache_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes used for mcache structures obtained from system.",
                        "unit": ""
                    }
                ],
                "go_memstats_mspan_inuse_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes in use by mspan structures.",
                        "unit": ""
                    }
                ],
                "go_memstats_mspan_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes used for mspan structures obtained from system.",
                        "unit": ""
                    }
                ],
                "go_memstats_next_gc_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of heap bytes when next garbage collection will take place.",
                        "unit": ""
                    }
                ],
                "go_memstats_other_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes used for other system allocations.",
                        "unit": ""
                    }
                ],
                "go_memstats_stack_inuse_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes in use by the stack allocator.",
                        "unit": ""
                    }
                ],
                "go_memstats_stack_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes obtained from system for stack allocator.",
                        "unit": ""
                    }
                ],
                "go_memstats_sys_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of bytes obtained from system.",
                        "unit": ""
                    }
                ],
                "go_threads": [
                    {
                        "type": "gauge",
                        "help": "Number of OS threads created.",
                        "unit": ""
                    }
                ],
                "homeassistant_automation_triggered_count_created": [
                    {
                        "type": "gauge",
                        "help": "Count of times an automation has been triggered",
                        "unit": ""
                    }
                ],
                "homeassistant_automation_triggered_count_total": [
                    {
                        "type": "counter",
                        "help": "Count of times an automation has been triggered",
                        "unit": ""
                    }
                ],
                "homeassistant_binary_sensor_state": [
                    {
                        "type": "gauge",
                        "help": "State of the binary sensor (0/1)",
                        "unit": ""
                    }
                ],
                "homeassistant_device_tracker_state": [
                    {
                        "type": "gauge",
                        "help": "State of the device tracker (0/1)",
                        "unit": ""
                    }
                ],
                "homeassistant_entity_available": [
                    {
                        "type": "gauge",
                        "help": "Entity is available (not in the unavailable or unknown state)",
                        "unit": ""
                    }
                ],
                "homeassistant_last_updated_time_seconds": [
                    {
                        "type": "gauge",
                        "help": "The last_updated timestamp",
                        "unit": ""
                    }
                ],
                "homeassistant_person_state": [
                    {
                        "type": "gauge",
                        "help": "State of the person (0/1)",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_battery_percent": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in percent",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_data_rate_mbit_per_s": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in mbit_per_s",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_data_size_gb": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in gb",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_distance_m": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in m",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_duration_ms": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in ms",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_enum_None": [
                    {
                        "type": "gauge",
                        "help": "State of the sensor",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_humidity_percent": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in percent",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_state": [
                    {
                        "type": "gauge",
                        "help": "State of the sensor",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_temperature_celsius": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in celsius",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_timestamp_seconds": [
                    {
                        "type": "gauge",
                        "help": "State of the sensor",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_unit_devices": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in devices",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_unit_percent": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in percent",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_unit_queries": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in queries",
                        "unit": ""
                    }
                ],
                "homeassistant_sensor_unit_u0x25u0x20available": [
                    {
                        "type": "gauge",
                        "help": "Sensor data measured in % available",
                        "unit": ""
                    }
                ],
                "homeassistant_state_change_created": [
                    {
                        "type": "gauge",
                        "help": "The number of state changes",
                        "unit": ""
                    }
                ],
                "homeassistant_state_change_total": [
                    {
                        "type": "counter",
                        "help": "The number of state changes",
                        "unit": ""
                    }
                ],
                "homeassistant_switch_attr_friendly_name": [
                    {
                        "type": "gauge",
                        "help": "friendly_name attribute of switch entity",
                        "unit": ""
                    }
                ],
                "homeassistant_switch_state": [
                    {
                        "type": "gauge",
                        "help": "State of the switch (0/1)",
                        "unit": ""
                    }
                ],
                "homeassistant_update_state": [
                    {
                        "type": "gauge",
                        "help": "Update state, indicating if an update is available (0/1)",
                        "unit": ""
                    }
                ],
                "node_arp_entries": [
                    {
                        "type": "gauge",
                        "help": "ARP entries by device",
                        "unit": ""
                    }
                ],
                "node_boot_time_seconds": [
                    {
                        "type": "gauge",
                        "help": "Node boot time, in unixtime.",
                        "unit": ""
                    }
                ],
                "node_context_switches_total": [
                    {
                        "type": "counter",
                        "help": "Total number of context switches.",
                        "unit": ""
                    }
                ],
                "node_cooling_device_cur_state": [
                    {
                        "type": "gauge",
                        "help": "Current throttle state of the cooling device",
                        "unit": ""
                    }
                ],
                "node_cooling_device_max_state": [
                    {
                        "type": "gauge",
                        "help": "Maximum throttle state of the cooling device",
                        "unit": ""
                    }
                ],
                "node_cpu_guest_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Seconds the CPUs spent in guests (VMs) for each mode.",
                        "unit": ""
                    }
                ],
                "node_cpu_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Seconds the CPUs spent in each mode.",
                        "unit": ""
                    }
                ],
                "node_disk_discard_time_seconds_total": [
                    {
                        "type": "counter",
                        "help": "This is the total number of seconds spent by all discards.",
                        "unit": ""
                    }
                ],
                "node_disk_discarded_sectors_total": [
                    {
                        "type": "counter",
                        "help": "The total number of sectors discarded successfully.",
                        "unit": ""
                    }
                ],
                "node_disk_discards_completed_total": [
                    {
                        "type": "counter",
                        "help": "The total number of discards completed successfully.",
                        "unit": ""
                    }
                ],
                "node_disk_discards_merged_total": [
                    {
                        "type": "counter",
                        "help": "The total number of discards merged.",
                        "unit": ""
                    }
                ],
                "node_disk_flush_requests_time_seconds_total": [
                    {
                        "type": "counter",
                        "help": "This is the total number of seconds spent by all flush requests.",
                        "unit": ""
                    }
                ],
                "node_disk_flush_requests_total": [
                    {
                        "type": "counter",
                        "help": "The total number of flush requests completed successfully",
                        "unit": ""
                    }
                ],
                "node_disk_info": [
                    {
                        "type": "gauge",
                        "help": "Info of /sys/block/<block_device>.",
                        "unit": ""
                    }
                ],
                "node_disk_io_now": [
                    {
                        "type": "gauge",
                        "help": "The number of I/Os currently in progress.",
                        "unit": ""
                    }
                ],
                "node_disk_io_time_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total seconds spent doing I/Os.",
                        "unit": ""
                    }
                ],
                "node_disk_io_time_weighted_seconds_total": [
                    {
                        "type": "counter",
                        "help": "The weighted # of seconds spent doing I/Os.",
                        "unit": ""
                    }
                ],
                "node_disk_read_bytes_total": [
                    {
                        "type": "counter",
                        "help": "The total number of bytes read successfully.",
                        "unit": ""
                    }
                ],
                "node_disk_read_time_seconds_total": [
                    {
                        "type": "counter",
                        "help": "The total number of seconds spent by all reads.",
                        "unit": ""
                    }
                ],
                "node_disk_reads_completed_total": [
                    {
                        "type": "counter",
                        "help": "The total number of reads completed successfully.",
                        "unit": ""
                    }
                ],
                "node_disk_reads_merged_total": [
                    {
                        "type": "counter",
                        "help": "The total number of reads merged.",
                        "unit": ""
                    }
                ],
                "node_disk_write_time_seconds_total": [
                    {
                        "type": "counter",
                        "help": "This is the total number of seconds spent by all writes.",
                        "unit": ""
                    }
                ],
                "node_disk_writes_completed_total": [
                    {
                        "type": "counter",
                        "help": "The total number of writes completed successfully.",
                        "unit": ""
                    }
                ],
                "node_disk_writes_merged_total": [
                    {
                        "type": "counter",
                        "help": "The number of writes merged.",
                        "unit": ""
                    }
                ],
                "node_disk_written_bytes_total": [
                    {
                        "type": "counter",
                        "help": "The total number of bytes written successfully.",
                        "unit": ""
                    }
                ],
                "node_dmi_info": [
                    {
                        "type": "gauge",
                        "help": "A metric with a constant '1' value labeled by bios_date, bios_release, bios_vendor, bios_version, board_asset_tag, board_name, board_serial, board_vendor, board_version, chassis_asset_tag, chassis_serial, chassis_vendor, chassis_version, product_family, product_name, product_serial, product_sku, product_uuid, product_version, system_vendor if provided by DMI.",
                        "unit": ""
                    }
                ],
                "node_entropy_available_bits": [
                    {
                        "type": "gauge",
                        "help": "Bits of available entropy.",
                        "unit": ""
                    }
                ],
                "node_entropy_pool_size_bits": [
                    {
                        "type": "gauge",
                        "help": "Bits of entropy pool.",
                        "unit": ""
                    }
                ],
                "node_exporter_build_info": [
                    {
                        "type": "gauge",
                        "help": "A metric with a constant '1' value labeled by version, revision, branch, and goversion from which node_exporter was built.",
                        "unit": ""
                    }
                ],
                "node_filefd_allocated": [
                    {
                        "type": "gauge",
                        "help": "File descriptor statistics: allocated.",
                        "unit": ""
                    }
                ],
                "node_filefd_maximum": [
                    {
                        "type": "gauge",
                        "help": "File descriptor statistics: maximum.",
                        "unit": ""
                    }
                ],
                "node_filesystem_avail_bytes": [
                    {
                        "type": "gauge",
                        "help": "Filesystem space available to non-root users in bytes.",
                        "unit": ""
                    }
                ],
                "node_filesystem_device_error": [
                    {
                        "type": "gauge",
                        "help": "Whether an error occurred while getting statistics for the given device.",
                        "unit": ""
                    }
                ],
                "node_filesystem_files": [
                    {
                        "type": "gauge",
                        "help": "Filesystem total file nodes.",
                        "unit": ""
                    }
                ],
                "node_filesystem_files_free": [
                    {
                        "type": "gauge",
                        "help": "Filesystem total free file nodes.",
                        "unit": ""
                    }
                ],
                "node_filesystem_free_bytes": [
                    {
                        "type": "gauge",
                        "help": "Filesystem free space in bytes.",
                        "unit": ""
                    }
                ],
                "node_filesystem_readonly": [
                    {
                        "type": "gauge",
                        "help": "Filesystem read-only status.",
                        "unit": ""
                    }
                ],
                "node_filesystem_size_bytes": [
                    {
                        "type": "gauge",
                        "help": "Filesystem size in bytes.",
                        "unit": ""
                    }
                ],
                "node_forks_total": [
                    {
                        "type": "counter",
                        "help": "Total number of forks.",
                        "unit": ""
                    }
                ],
                "node_hwmon_chip_names": [
                    {
                        "type": "gauge",
                        "help": "Annotation metric for human-readable chip names",
                        "unit": ""
                    }
                ],
                "node_intr_total": [
                    {
                        "type": "counter",
                        "help": "Total number of interrupts serviced.",
                        "unit": ""
                    }
                ],
                "node_load1": [
                    {
                        "type": "gauge",
                        "help": "1m load average.",
                        "unit": ""
                    }
                ],
                "node_load15": [
                    {
                        "type": "gauge",
                        "help": "15m load average.",
                        "unit": ""
                    }
                ],
                "node_load5": [
                    {
                        "type": "gauge",
                        "help": "5m load average.",
                        "unit": ""
                    }
                ],
                "node_memory_Active_anon_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Active_anon_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Active_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Active_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Active_file_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Active_file_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_AnonHugePages_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field AnonHugePages_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_AnonPages_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field AnonPages_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Bounce_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Bounce_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Buffers_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Buffers_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Cached_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Cached_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_CommitLimit_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field CommitLimit_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Committed_AS_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Committed_AS_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_DirectMap1G_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field DirectMap1G_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_DirectMap2M_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field DirectMap2M_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_DirectMap4k_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field DirectMap4k_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Dirty_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Dirty_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_FileHugePages_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field FileHugePages_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_FilePmdMapped_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field FilePmdMapped_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_HardwareCorrupted_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field HardwareCorrupted_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_HugePages_Free": [
                    {
                        "type": "gauge",
                        "help": "Memory information field HugePages_Free.",
                        "unit": ""
                    }
                ],
                "node_memory_HugePages_Rsvd": [
                    {
                        "type": "gauge",
                        "help": "Memory information field HugePages_Rsvd.",
                        "unit": ""
                    }
                ],
                "node_memory_HugePages_Surp": [
                    {
                        "type": "gauge",
                        "help": "Memory information field HugePages_Surp.",
                        "unit": ""
                    }
                ],
                "node_memory_HugePages_Total": [
                    {
                        "type": "gauge",
                        "help": "Memory information field HugePages_Total.",
                        "unit": ""
                    }
                ],
                "node_memory_Hugepagesize_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Hugepagesize_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Hugetlb_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Hugetlb_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Inactive_anon_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Inactive_anon_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Inactive_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Inactive_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Inactive_file_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Inactive_file_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_KReclaimable_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field KReclaimable_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_KernelStack_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field KernelStack_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Mapped_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Mapped_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_MemAvailable_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field MemAvailable_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_MemFree_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field MemFree_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_MemTotal_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field MemTotal_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Mlocked_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Mlocked_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_NFS_Unstable_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field NFS_Unstable_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_PageTables_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field PageTables_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Percpu_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Percpu_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_SReclaimable_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field SReclaimable_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_SUnreclaim_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field SUnreclaim_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_ShmemHugePages_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field ShmemHugePages_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_ShmemPmdMapped_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field ShmemPmdMapped_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Shmem_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Shmem_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Slab_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Slab_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_SwapCached_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field SwapCached_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_SwapFree_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field SwapFree_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_SwapTotal_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field SwapTotal_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Unevictable_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Unevictable_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_VmallocChunk_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field VmallocChunk_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_VmallocTotal_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field VmallocTotal_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_VmallocUsed_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field VmallocUsed_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_WritebackTmp_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field WritebackTmp_bytes.",
                        "unit": ""
                    }
                ],
                "node_memory_Writeback_bytes": [
                    {
                        "type": "gauge",
                        "help": "Memory information field Writeback_bytes.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp6_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic Icmp6InErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp6_InMsgs": [
                    {
                        "type": "unknown",
                        "help": "Statistic Icmp6InMsgs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp6_OutMsgs": [
                    {
                        "type": "unknown",
                        "help": "Statistic Icmp6OutMsgs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic IcmpInErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp_InMsgs": [
                    {
                        "type": "unknown",
                        "help": "Statistic IcmpInMsgs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Icmp_OutMsgs": [
                    {
                        "type": "unknown",
                        "help": "Statistic IcmpOutMsgs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Ip6_InOctets": [
                    {
                        "type": "unknown",
                        "help": "Statistic Ip6InOctets.",
                        "unit": ""
                    }
                ],
                "node_netstat_Ip6_OutOctets": [
                    {
                        "type": "unknown",
                        "help": "Statistic Ip6OutOctets.",
                        "unit": ""
                    }
                ],
                "node_netstat_IpExt_InOctets": [
                    {
                        "type": "unknown",
                        "help": "Statistic IpExtInOctets.",
                        "unit": ""
                    }
                ],
                "node_netstat_IpExt_OutOctets": [
                    {
                        "type": "unknown",
                        "help": "Statistic IpExtOutOctets.",
                        "unit": ""
                    }
                ],
                "node_netstat_Ip_Forwarding": [
                    {
                        "type": "unknown",
                        "help": "Statistic IpForwarding.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_ListenDrops": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtListenDrops.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_ListenOverflows": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtListenOverflows.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_SyncookiesFailed": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtSyncookiesFailed.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_SyncookiesRecv": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtSyncookiesRecv.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_SyncookiesSent": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtSyncookiesSent.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_TCPSynRetrans": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtTCPSynRetrans.",
                        "unit": ""
                    }
                ],
                "node_netstat_TcpExt_TCPTimeouts": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpExtTCPTimeouts.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_ActiveOpens": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpActiveOpens.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_CurrEstab": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpCurrEstab.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_InErrs": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpInErrs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_InSegs": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpInSegs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_OutRsts": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpOutRsts.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_OutSegs": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpOutSegs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_PassiveOpens": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpPassiveOpens.",
                        "unit": ""
                    }
                ],
                "node_netstat_Tcp_RetransSegs": [
                    {
                        "type": "unknown",
                        "help": "Statistic TcpRetransSegs.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_InDatagrams": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6InDatagrams.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6InErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_NoPorts": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6NoPorts.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_OutDatagrams": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6OutDatagrams.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_RcvbufErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6RcvbufErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp6_SndbufErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic Udp6SndbufErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_UdpLite6_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpLite6InErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_UdpLite_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpLiteInErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_InDatagrams": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpInDatagrams.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_InErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpInErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_NoPorts": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpNoPorts.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_OutDatagrams": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpOutDatagrams.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_RcvbufErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpRcvbufErrors.",
                        "unit": ""
                    }
                ],
                "node_netstat_Udp_SndbufErrors": [
                    {
                        "type": "unknown",
                        "help": "Statistic UdpSndbufErrors.",
                        "unit": ""
                    }
                ],
                "node_network_address_assign_type": [
                    {
                        "type": "gauge",
                        "help": "address_assign_type value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_carrier": [
                    {
                        "type": "gauge",
                        "help": "carrier value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_carrier_changes_total": [
                    {
                        "type": "counter",
                        "help": "carrier_changes_total value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_carrier_down_changes_total": [
                    {
                        "type": "counter",
                        "help": "carrier_down_changes_total value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_carrier_up_changes_total": [
                    {
                        "type": "counter",
                        "help": "carrier_up_changes_total value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_device_id": [
                    {
                        "type": "gauge",
                        "help": "device_id value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_dormant": [
                    {
                        "type": "gauge",
                        "help": "dormant value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_flags": [
                    {
                        "type": "gauge",
                        "help": "flags value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_iface_id": [
                    {
                        "type": "gauge",
                        "help": "iface_id value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_iface_link": [
                    {
                        "type": "gauge",
                        "help": "iface_link value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_iface_link_mode": [
                    {
                        "type": "gauge",
                        "help": "iface_link_mode value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_info": [
                    {
                        "type": "gauge",
                        "help": "Non-numeric data from /sys/class/net/<iface>, value is always 1.",
                        "unit": ""
                    }
                ],
                "node_network_mtu_bytes": [
                    {
                        "type": "gauge",
                        "help": "mtu_bytes value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_name_assign_type": [
                    {
                        "type": "gauge",
                        "help": "name_assign_type value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_net_dev_group": [
                    {
                        "type": "gauge",
                        "help": "net_dev_group value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_protocol_type": [
                    {
                        "type": "gauge",
                        "help": "protocol_type value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_receive_bytes_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_bytes.",
                        "unit": ""
                    }
                ],
                "node_network_receive_compressed_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_compressed.",
                        "unit": ""
                    }
                ],
                "node_network_receive_drop_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_drop.",
                        "unit": ""
                    }
                ],
                "node_network_receive_errs_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_errs.",
                        "unit": ""
                    }
                ],
                "node_network_receive_fifo_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_fifo.",
                        "unit": ""
                    }
                ],
                "node_network_receive_frame_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_frame.",
                        "unit": ""
                    }
                ],
                "node_network_receive_multicast_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_multicast.",
                        "unit": ""
                    }
                ],
                "node_network_receive_packets_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic receive_packets.",
                        "unit": ""
                    }
                ],
                "node_network_speed_bytes": [
                    {
                        "type": "gauge",
                        "help": "speed_bytes value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_bytes_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_bytes.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_carrier_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_carrier.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_colls_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_colls.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_compressed_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_compressed.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_drop_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_drop.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_errs_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_errs.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_fifo_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_fifo.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_packets_total": [
                    {
                        "type": "counter",
                        "help": "Network device statistic transmit_packets.",
                        "unit": ""
                    }
                ],
                "node_network_transmit_queue_length": [
                    {
                        "type": "gauge",
                        "help": "transmit_queue_length value of /sys/class/net/<iface>.",
                        "unit": ""
                    }
                ],
                "node_network_up": [
                    {
                        "type": "gauge",
                        "help": "Value is 1 if operstate is 'up', 0 otherwise.",
                        "unit": ""
                    }
                ],
                "node_nf_conntrack_entries": [
                    {
                        "type": "gauge",
                        "help": "Number of currently allocated flow entries for connection tracking.",
                        "unit": ""
                    }
                ],
                "node_nf_conntrack_entries_limit": [
                    {
                        "type": "gauge",
                        "help": "Maximum size of connection tracking table.",
                        "unit": ""
                    }
                ],
                "node_nfsd_connections_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd TCP connections.",
                        "unit": ""
                    }
                ],
                "node_nfsd_disk_bytes_read_total": [
                    {
                        "type": "counter",
                        "help": "Total NFSd bytes read.",
                        "unit": ""
                    }
                ],
                "node_nfsd_disk_bytes_written_total": [
                    {
                        "type": "counter",
                        "help": "Total NFSd bytes written.",
                        "unit": ""
                    }
                ],
                "node_nfsd_file_handles_stale_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd stale file handles",
                        "unit": ""
                    }
                ],
                "node_nfsd_packets_total": [
                    {
                        "type": "counter",
                        "help": "Total NFSd network packets (sent+received) by protocol type.",
                        "unit": ""
                    }
                ],
                "node_nfsd_read_ahead_cache_not_found_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd read ahead cache not found.",
                        "unit": ""
                    }
                ],
                "node_nfsd_read_ahead_cache_size_blocks": [
                    {
                        "type": "gauge",
                        "help": "How large the read ahead cache is in blocks.",
                        "unit": ""
                    }
                ],
                "node_nfsd_reply_cache_hits_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd Reply Cache hits (client lost server response).",
                        "unit": ""
                    }
                ],
                "node_nfsd_reply_cache_misses_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd Reply Cache an operation that requires caching (idempotent).",
                        "unit": ""
                    }
                ],
                "node_nfsd_reply_cache_nocache_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd Reply Cache non-idempotent operations (rename/delete/…).",
                        "unit": ""
                    }
                ],
                "node_nfsd_requests_total": [
                    {
                        "type": "counter",
                        "help": "Total number NFSd Requests by method and protocol.",
                        "unit": ""
                    }
                ],
                "node_nfsd_rpc_errors_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd RPC errors by error type.",
                        "unit": ""
                    }
                ],
                "node_nfsd_server_rpcs_total": [
                    {
                        "type": "counter",
                        "help": "Total number of NFSd RPCs.",
                        "unit": ""
                    }
                ],
                "node_nfsd_server_threads": [
                    {
                        "type": "gauge",
                        "help": "Total number of NFSd kernel threads that are running.",
                        "unit": ""
                    }
                ],
                "node_os_info": [
                    {
                        "type": "gauge",
                        "help": "A metric with a constant '1' value labeled by build_id, id, id_like, image_id, image_version, name, pretty_name, variant, variant_id, version, version_codename, version_id.",
                        "unit": ""
                    }
                ],
                "node_os_version": [
                    {
                        "type": "gauge",
                        "help": "Metric containing the major.minor part of the OS version.",
                        "unit": ""
                    }
                ],
                "node_power_supply_info": [
                    {
                        "type": "gauge",
                        "help": "info of /sys/class/power_supply/<power_supply>.",
                        "unit": ""
                    }
                ],
                "node_power_supply_online": [
                    {
                        "type": "gauge",
                        "help": "online value of /sys/class/power_supply/<power_supply>.",
                        "unit": ""
                    }
                ],
                "node_pressure_cpu_waiting_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total time in seconds that processes have waited for CPU time",
                        "unit": ""
                    }
                ],
                "node_pressure_io_stalled_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total time in seconds no process could make progress due to IO congestion",
                        "unit": ""
                    }
                ],
                "node_pressure_io_waiting_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total time in seconds that processes have waited due to IO congestion",
                        "unit": ""
                    }
                ],
                "node_pressure_memory_stalled_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total time in seconds no process could make progress due to memory congestion",
                        "unit": ""
                    }
                ],
                "node_pressure_memory_waiting_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total time in seconds that processes have waited for memory",
                        "unit": ""
                    }
                ],
                "node_procs_blocked": [
                    {
                        "type": "gauge",
                        "help": "Number of processes blocked waiting for I/O to complete.",
                        "unit": ""
                    }
                ],
                "node_procs_running": [
                    {
                        "type": "gauge",
                        "help": "Number of processes in runnable state.",
                        "unit": ""
                    }
                ],
                "node_reboot_required": [
                    {
                        "type": "gauge",
                        "help": "Node reboot is required for software updates.",
                        "unit": ""
                    }
                ],
                "node_schedstat_running_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Number of seconds CPU spent running a process.",
                        "unit": ""
                    }
                ],
                "node_schedstat_timeslices_total": [
                    {
                        "type": "counter",
                        "help": "Number of timeslices executed by CPU.",
                        "unit": ""
                    }
                ],
                "node_schedstat_waiting_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Number of seconds spent by processing waiting for this CPU.",
                        "unit": ""
                    }
                ],
                "node_scrape_collector_duration_seconds": [
                    {
                        "type": "gauge",
                        "help": "node_exporter: Duration of a collector scrape.",
                        "unit": ""
                    }
                ],
                "node_scrape_collector_success": [
                    {
                        "type": "gauge",
                        "help": "node_exporter: Whether a collector succeeded.",
                        "unit": ""
                    }
                ],
                "node_sockstat_FRAG6_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of FRAG6 sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_FRAG6_memory": [
                    {
                        "type": "gauge",
                        "help": "Number of FRAG6 sockets in state memory.",
                        "unit": ""
                    }
                ],
                "node_sockstat_FRAG_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of FRAG sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_FRAG_memory": [
                    {
                        "type": "gauge",
                        "help": "Number of FRAG sockets in state memory.",
                        "unit": ""
                    }
                ],
                "node_sockstat_RAW6_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of RAW6 sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_RAW_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of RAW sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP6_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP6 sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_alloc": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state alloc.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_mem": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state mem.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_mem_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state mem_bytes.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_orphan": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state orphan.",
                        "unit": ""
                    }
                ],
                "node_sockstat_TCP_tw": [
                    {
                        "type": "gauge",
                        "help": "Number of TCP sockets in state tw.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDP6_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of UDP6 sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDPLITE6_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of UDPLITE6 sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDPLITE_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of UDPLITE sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDP_inuse": [
                    {
                        "type": "gauge",
                        "help": "Number of UDP sockets in state inuse.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDP_mem": [
                    {
                        "type": "gauge",
                        "help": "Number of UDP sockets in state mem.",
                        "unit": ""
                    }
                ],
                "node_sockstat_UDP_mem_bytes": [
                    {
                        "type": "gauge",
                        "help": "Number of UDP sockets in state mem_bytes.",
                        "unit": ""
                    }
                ],
                "node_sockstat_sockets_used": [
                    {
                        "type": "gauge",
                        "help": "Number of IPv4 sockets in use.",
                        "unit": ""
                    }
                ],
                "node_softnet_dropped_total": [
                    {
                        "type": "counter",
                        "help": "Number of dropped packets",
                        "unit": ""
                    }
                ],
                "node_softnet_processed_total": [
                    {
                        "type": "counter",
                        "help": "Number of processed packets",
                        "unit": ""
                    }
                ],
                "node_softnet_times_squeezed_total": [
                    {
                        "type": "counter",
                        "help": "Number of times processing packets ran out of quota",
                        "unit": ""
                    }
                ],
                "node_systemd_socket_accepted_connections_total": [
                    {
                        "type": "counter",
                        "help": "Total number of accepted socket connections",
                        "unit": ""
                    }
                ],
                "node_systemd_socket_current_connections": [
                    {
                        "type": "gauge",
                        "help": "Current number of socket connections",
                        "unit": ""
                    }
                ],
                "node_systemd_socket_refused_connections_total": [
                    {
                        "type": "gauge",
                        "help": "Total number of refused socket connections",
                        "unit": ""
                    }
                ],
                "node_systemd_system_running": [
                    {
                        "type": "gauge",
                        "help": "Whether the system is operational (see 'systemctl is-system-running')",
                        "unit": ""
                    }
                ],
                "node_systemd_timer_last_trigger_seconds": [
                    {
                        "type": "gauge",
                        "help": "Seconds since epoch of last trigger.",
                        "unit": ""
                    }
                ],
                "node_systemd_unit_state": [
                    {
                        "type": "gauge",
                        "help": "Systemd unit",
                        "unit": ""
                    }
                ],
                "node_systemd_units": [
                    {
                        "type": "gauge",
                        "help": "Summary of systemd unit states",
                        "unit": ""
                    }
                ],
                "node_systemd_version": [
                    {
                        "type": "gauge",
                        "help": "Detected systemd version",
                        "unit": ""
                    }
                ],
                "node_textfile_mtime_seconds": [
                    {
                        "type": "gauge",
                        "help": "Unixtime mtime of textfiles successfully read.",
                        "unit": ""
                    }
                ],
                "node_textfile_scrape_error": [
                    {
                        "type": "gauge",
                        "help": "1 if there was an error opening or reading a file, 0 otherwise",
                        "unit": ""
                    }
                ],
                "node_time_clocksource_available_info": [
                    {
                        "type": "gauge",
                        "help": "Available clocksources read from '/sys/devices/system/clocksource'.",
                        "unit": ""
                    }
                ],
                "node_time_clocksource_current_info": [
                    {
                        "type": "gauge",
                        "help": "Current clocksource read from '/sys/devices/system/clocksource'.",
                        "unit": ""
                    }
                ],
                "node_time_seconds": [
                    {
                        "type": "gauge",
                        "help": "System time in seconds since epoch (1970).",
                        "unit": ""
                    }
                ],
                "node_time_zone_offset_seconds": [
                    {
                        "type": "gauge",
                        "help": "System time zone offset in seconds.",
                        "unit": ""
                    }
                ],
                "node_timex_estimated_error_seconds": [
                    {
                        "type": "gauge",
                        "help": "Estimated error in seconds.",
                        "unit": ""
                    }
                ],
                "node_timex_frequency_adjustment_ratio": [
                    {
                        "type": "gauge",
                        "help": "Local clock frequency adjustment.",
                        "unit": ""
                    }
                ],
                "node_timex_loop_time_constant": [
                    {
                        "type": "gauge",
                        "help": "Phase-locked loop time constant.",
                        "unit": ""
                    }
                ],
                "node_timex_maxerror_seconds": [
                    {
                        "type": "gauge",
                        "help": "Maximum error in seconds.",
                        "unit": ""
                    }
                ],
                "node_timex_offset_seconds": [
                    {
                        "type": "gauge",
                        "help": "Time offset in between local system and reference clock.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_calibration_total": [
                    {
                        "type": "counter",
                        "help": "Pulse per second count of calibration intervals.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_error_total": [
                    {
                        "type": "counter",
                        "help": "Pulse per second count of calibration errors.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_frequency_hertz": [
                    {
                        "type": "gauge",
                        "help": "Pulse per second frequency.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_jitter_seconds": [
                    {
                        "type": "gauge",
                        "help": "Pulse per second jitter.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_jitter_total": [
                    {
                        "type": "counter",
                        "help": "Pulse per second count of jitter limit exceeded events.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_shift_seconds": [
                    {
                        "type": "gauge",
                        "help": "Pulse per second interval duration.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_stability_exceeded_total": [
                    {
                        "type": "counter",
                        "help": "Pulse per second count of stability limit exceeded events.",
                        "unit": ""
                    }
                ],
                "node_timex_pps_stability_hertz": [
                    {
                        "type": "gauge",
                        "help": "Pulse per second stability, average of recent frequency changes.",
                        "unit": ""
                    }
                ],
                "node_timex_status": [
                    {
                        "type": "gauge",
                        "help": "Value of the status array bits.",
                        "unit": ""
                    }
                ],
                "node_timex_sync_status": [
                    {
                        "type": "gauge",
                        "help": "Is clock synchronized to a reliable server (1 = yes, 0 = no).",
                        "unit": ""
                    }
                ],
                "node_timex_tai_offset_seconds": [
                    {
                        "type": "gauge",
                        "help": "International Atomic Time (TAI) offset.",
                        "unit": ""
                    }
                ],
                "node_timex_tick_seconds": [
                    {
                        "type": "gauge",
                        "help": "Seconds between clock ticks.",
                        "unit": ""
                    }
                ],
                "node_udp_queues": [
                    {
                        "type": "gauge",
                        "help": "Number of allocated memory in the kernel for UDP datagrams in bytes.",
                        "unit": ""
                    }
                ],
                "node_uname_info": [
                    {
                        "type": "gauge",
                        "help": "Labeled system information as provided by the uname system call.",
                        "unit": ""
                    }
                ],
                "node_vmstat_oom_kill": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field oom_kill.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pgfault": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pgfault.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pgmajfault": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pgmajfault.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pgpgin": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pgpgin.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pgpgout": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pgpgout.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pswpin": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pswpin.",
                        "unit": ""
                    }
                ],
                "node_vmstat_pswpout": [
                    {
                        "type": "unknown",
                        "help": "/proc/vmstat information field pswpout.",
                        "unit": ""
                    }
                ],
                "process_cpu_seconds_total": [
                    {
                        "type": "counter",
                        "help": "Total user and system CPU time spent in seconds.",
                        "unit": ""
                    }
                ],
                "process_max_fds": [
                    {
                        "type": "gauge",
                        "help": "Maximum number of open file descriptors.",
                        "unit": ""
                    }
                ],
                "process_open_fds": [
                    {
                        "type": "gauge",
                        "help": "Number of open file descriptors.",
                        "unit": ""
                    }
                ],
                "process_resident_memory_bytes": [
                    {
                        "type": "gauge",
                        "help": "Resident memory size in bytes.",
                        "unit": ""
                    }
                ],
                "process_start_time_seconds": [
                    {
                        "type": "gauge",
                        "help": "Start time of the process since unix epoch in seconds.",
                        "unit": ""
                    }
                ],
                "process_virtual_memory_bytes": [
                    {
                        "type": "gauge",
                        "help": "Virtual memory size in bytes.",
                        "unit": ""
                    }
                ],
                "process_virtual_memory_max_bytes": [
                    {
                        "type": "gauge",
                        "help": "Maximum amount of virtual memory available in bytes.",
                        "unit": ""
                    }
                ],
                "promhttp_metric_handler_errors_total": [
                    {
                        "type": "counter",
                        "help": "Total number of internal errors encountered by the promhttp metric handler.",
                        "unit": ""
                    }
                ],
                "promhttp_metric_handler_requests_in_flight": [
                    {
                        "type": "gauge",
                        "help": "Current number of scrapes being served.",
                        "unit": ""
                    }
                ],
                "promhttp_metric_handler_requests_total": [
                    {
                        "type": "counter",
                        "help": "Total number of scrapes by HTTP status code.",
                        "unit": ""
                    }
                ],
                "python_gc_collections_total": [
                    {
                        "type": "counter",
                        "help": "Number of times this generation was collected",
                        "unit": ""
                    }
                ],
                "python_gc_objects_collected_total": [
                    {
                        "type": "counter",
                        "help": "Objects collected during gc",
                        "unit": ""
                    }
                ],
                "python_gc_objects_uncollectable_total": [
                    {
                        "type": "counter",
                        "help": "Uncollectable objects found during GC",
                        "unit": ""
                    }
                ],
                "python_info": [
                    {
                        "type": "gauge",
                        "help": "Python platform information",
                        "unit": ""
                    }
                ],
                "smartmon_device_active": [
                    {
                        "type": "gauge",
                        "help": "SMART metric device_active",
                        "unit": ""
                    }
                ],
                "smartmon_device_info": [
                    {
                        "type": "gauge",
                        "help": "SMART metric device_info",
                        "unit": ""
                    }
                ],
                "smartmon_device_smart_available": [
                    {
                        "type": "gauge",
                        "help": "SMART metric device_smart_available",
                        "unit": ""
                    }
                ],
                "smartmon_device_smart_enabled": [
                    {
                        "type": "gauge",
                        "help": "SMART metric device_smart_enabled",
                        "unit": ""
                    }
                ],
                "smartmon_device_smart_healthy": [
                    {
                        "type": "gauge",
                        "help": "SMART metric device_smart_healthy",
                        "unit": ""
                    }
                ],
                "smartmon_smartctl_run": [
                    {
                        "type": "gauge",
                        "help": "SMART metric smartctl_run",
                        "unit": ""
                    }
                ],
                "smartmon_smartctl_version": [
                    {
                        "type": "gauge",
                        "help": "SMART metric smartctl_version",
                        "unit": ""
                    }
                ]
            }
        }
        this.AutocompleteItems = Object.entries(originalData.data).map(([key, value]) => ({
            value: key,
            description: value[0].help
        } as AutocompleteItem))
        return;
    }

}
