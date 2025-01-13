import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    getDefaultPrometheusQueryIndexParams,
    LoadServicetemplates,
    LoadValueByMetricRoot,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot, PrometheusQueryIndexTargetDatum
} from '../prometheus-query.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { PrometheusQueryService } from '../prometheus-query.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GenericValidationError } from '../../../../../generic-responses';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
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
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PrometheusPopoverGraphComponent
} from '../../../components/prometheus-popover-graph/prometheus-popover-graph.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';

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
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectComponent,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        NgIf,
        TableLoaderComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        MatSort,
        MatSortHeader,
        NgForOf,
        TableDirective,
        NoRecordsComponent,
        PrometheusPopoverGraphComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        NgClass,
        OitcAlertComponent,
        ItemSelectComponent,
        SelectAllComponent,
        RequiredIconComponent,
        FormErrorDirective
    ],
    templateUrl: './prometheus-query-to-service.component.html',
    styleUrl: './prometheus-query-to-service.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusQueryToServiceComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected selectedMetrics: string[] = [];
    protected index: PrometheusQueryIndexRoot = {targets: {data: [] as PrometheusQueryIndexTargetDatum[]}} as PrometheusQueryIndexRoot;
    protected serviceTemplates: SelectKeyValue[] = [];
    protected hostId: number = 0;
    protected hosts: SelectKeyValue[] = [];
    protected params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
    protected timezone!: TimezoneObject;
    protected operators: SelectKeyValueString[] = [
        {key: "==", value: '== (equal)'},
        {key: "!=", value: '!= (not equal)'},
        {key: ">", value: '> (greater-than)'},
        {key: "<", value: '< (less-than)'},
        {key: ">=", value: '>= (greater-or-equal)'},
        {key: "<=", value: '<= (less-or-equal)'},
    ];
    protected longerThanValues: SelectKeyValueString[] = [
        {key:  "5s", value: '5 seconds'},
        {key: "10s", value: '10 seconds'},
        {key: "15s", value: '15 seconds'},
        {key: "30s", value: '30 seconds'},
        {key:  "1m", value: '1 minute'},
        {key: "90s", value: '1 minute 30 seconds'},
        {key:  "2m", value: '2 minutes'},
        {key:  "3m", value: '3 minutes'},
        {key:  "4m", value: '4 minutes'},
        {key:  "5m", value: '5 minutes'},
        {key: "10m", value: '10 minutes'},
        {key: "15m", value: '15 minutes'},
        {key: "20m", value: '20 minutes'},
        {key: "25m", value: '25 minutes'},
        {key: "30m", value: '30 minutes'},
        {key: "40m", value: '40 minutes'},
        {key: "50m", value: '50 minutes'},
        {key:  "1h", value: '1 hour'},
        {key: "90m", value: '1 hour 30 minutes'},
        {key:  "2h", value: '2 hours'},
        {key:  "3h", value: '3 hours'},
        {key:  "4h", value: '4 hours'},
        {key:  "5h", value: '5 hours'},
        {key:  "6h", value: '6 hours'},
        {key: "12h", value: '12 hours'},
        {key:  "1d", value: '1 day'}
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
        this.loadServicetemplates(Number(this.route.snapshot.paramMap.get('hostId')));
        let params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
        params.hostId = this.hostId;

        this.subscriptions.add(this.PrometheusQueryService.getIndex(params)
            .subscribe((result: PrometheusQueryIndexRoot) => {
                this.index = result;
                this.cdr.markForCheck();
            }));
        this.getUserTimezone();
    }

    protected metrics: { [key: string]: LoadValueByMetricRoot } = {};

    protected onMetricsChange(): void {
        this.selectedMetrics.forEach(metric => {
            this.subscriptions.add(this.PrometheusQueryService.loadValueByMetric(this.index.host.uuid, metric)
                .subscribe((result: LoadValueByMetricRoot) => {
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

}
