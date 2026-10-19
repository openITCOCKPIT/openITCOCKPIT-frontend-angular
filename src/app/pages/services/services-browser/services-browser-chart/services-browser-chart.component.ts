import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
    PerformanceData,
    PopoverGraphInterface,
    ServiceBrowserPerfParams
} from '../../../../components/popover-graph/popover-graph.interface';
import { Observable, Subscription } from 'rxjs';
import { PopoverGraphService } from '../../../../components/popover-graph/popover-graph.service';
import { TimezoneObject } from '../../timezone.interface';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption, VisualMapComponentOption } from 'echarts';
import * as echarts from 'echarts/core';

import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { FormsModule } from '@angular/forms';


import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue, SelectKeyValueString } from '../../../../layouts/primeng/select.interface';

import 'echarts/theme/dark.js';
import { ScaleTypes } from '../../../../components/popover-graph/scale-types';
import { DateTime } from "luxon";
import { LocalStorageService } from '../../../../services/local-storage.service';
import { GenericUnixtimerange } from '../../../../generic.interfaces';
import { LayoutService } from '../../../../layouts/coreui/layout.service';

import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    DataZoomComponent,
    VisualMapComponent
} from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent, VisualMapComponent,DataZoomComponent]);

interface ServiceBrowserChartConfig {
    showDataPoint: boolean,
    smooth: boolean,
    autoRefresh: boolean
}

@Component({
    selector: 'oitc-services-browser-chart',
    imports: [
        NgxEchartsDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TranslocoDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule,
        SelectComponent,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        AlertComponent
    ],
    templateUrl: './services-browser-chart.component.html',
    styleUrl: './services-browser-chart.component.css',
    providers: [
        provideEchartsCore({echarts}),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesBrowserChartComponent implements OnInit, OnDestroy {

    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly LocalStorageService = inject(LocalStorageService);

    public config: ServiceBrowserChartConfig = {
        showDataPoint: false,
        smooth: false,
        autoRefresh: true
    };

    @Input() public hostUuid: string = '';
    @Input() public serviceUuid: string = '';
    @Input() public availableDataSources: SelectKeyValueString[] = [];
    @Input() public timezone!: TimezoneObject;
    @Input() public autoRefreshInterval: number = 0; // value in seconds
    @Input() public timerange$?: Observable<GenericUnixtimerange>;
    @Output() onGraphChange: EventEmitter<GenericUnixtimerange> = new EventEmitter<GenericUnixtimerange>();

    private cdr = inject(ChangeDetectorRef);

    private autoRefreshIntervalId: any = null;

    public selectedDatasource: string = '';

    public theme: string = '';

    public availableTimeranges: SelectKeyValue[] = [
        {key: 1, value: this.TranslocoService.translate('1 hour')},
        {key: 2, value: this.TranslocoService.translate('2 hours')},
        {key: 3, value: this.TranslocoService.translate('3 hours')},
        {key: 4, value: this.TranslocoService.translate('4 hours')},
        {key: 8, value: this.TranslocoService.translate('8 hours')},
        {key: 24, value: this.TranslocoService.translate('1 day')},
        {key: 48, value: this.TranslocoService.translate('2 days')},
        {key: 120, value: this.TranslocoService.translate('5 days')},
        {key: 168, value: this.TranslocoService.translate('7 days')},
        {key: 720, value: this.TranslocoService.translate('30 days')},
        {key: 2160, value: this.TranslocoService.translate('90 days')},
        {key: 4464, value: this.TranslocoService.translate('6 months')},
        {key: 8760, value: this.TranslocoService.translate('1 year')},
    ];
    public selectedTimerange: number = 3; // selected timerange is 3 hours
    public selectedOverviewTimerange: number = 8760; // Overview range is 1 year

    private clientTimeAtLoad = Date.now();
    public timerangePlaceholder: string = this.TranslocoService.translate('Custom'); // Is displayed when the user zooms in/out

    public availableAggregation: SelectKeyValueString[] = [
        {key: 'min', value: this.TranslocoService.translate('Minimum')},
        {key: 'avg', value: this.TranslocoService.translate('Average')},
        {key: 'max', value: this.TranslocoService.translate('Maximum')},
    ];
    public selectedAggregation: 'min' | 'max' | 'avg' = 'avg';

    public isLoading: boolean = false;

    public overviewTimeRange: GenericUnixtimerange = {start: 0, end: 0};
    public detailTimeRange: GenericUnixtimerange = {start: 0, end: 0};

    public currentGraphUnit: string | null = null;

    public currentYMinDetail: number | undefined = undefined;
    public currentYMaxDetail: number | undefined = undefined;

    private PopoverGraphService = inject(PopoverGraphService);
    private readonly LayoutService = inject(LayoutService);

    private subscriptions: Subscription = new Subscription();
    public detailRangeLabel = '';
    private syncingSlider = false;
    private detailTimer: any = null;

    private overviewSub: Subscription = new Subscription();
    private detailSub: Subscription = new Subscription();

    public chartOption: EChartsOption = {};
    public chartOptionDetails: EChartsOption = {};

    // any :(
    public overviewEchartsInstance: any;
    public detailEchartsInstance: any;

    private zoomEnabled: boolean = false;

    // Contains the last time stamp in ISO format which contains data
    // This timestamp is used by the auto refresh, to only load new data.
    private lastTimestampWithData: Date = new Date();
    private ServerTime: Date = new Date();

    public hasEnoughData: boolean = true;

    private readonly MIN_SPAN_SECONDS = 60;
    private readonly EXPAND_TOLERANCE_SECONDS = 15 * 60;

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));
    }

    public ngOnInit(): void {
        this.config.smooth = this.LocalStorageService.getItemWithDefault('ServiceBrowerChartSmooth', 'false') === 'true';
        this.config.showDataPoint = this.LocalStorageService.getItemWithDefault('ServiceBrowerChartShowPoints', 'false') === 'true';

        // Save the current server time on load and never overwrite it again
        this.ServerTime = new Date(this.timezone.server_time_iso);
        this.clientTimeAtLoad = Date.now();

        this.overviewTimeRange = this.getOverviewRange();
        this.detailTimeRange = this.getDetailRange(this.selectedTimerange);

        this.updateDetailLabel();

        this.loadOverviewPerfdata();
        this.loadDetailPerfdata();

        if (this.config.autoRefresh && this.autoRefreshInterval > 1) {
            this.startAutoRefresh();
        }

        if (this.timerange$) {
            // We have an observable for the timerange.
            // We subscribe to it and update the chart when the timeline changes
            this.subscriptions.add(this.timerange$.subscribe((timerange) => {
                if (timerange.start > 0 && timerange.end > 0) {
                    if (timerange.start !== this.detailTimeRange.start || timerange.end !== this.detailTimeRange.end) {
                        //console.log("External timerange change detected", timerange);
                        this.syncChartWithTimeline(timerange.start, timerange.end);
                        this.cdr.markForCheck();
                    }
                }
            }));
        }
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.zoomEnabled = false;
        this.cancelAutoRefresh();
        clearTimeout(this.detailTimer);
        this.subscriptions.unsubscribe();
    }

    public onDetailChartInit(ec: any): void {
        this.detailEchartsInstance = ec;
    }

    public onOverviewChartInit(ec: any): void {
        this.overviewEchartsInstance = ec;
    }

    // Called on page load, on zoom, on data source change, on timerange change
    public loadOverviewPerfdata() {
        if (this.availableDataSources.length === 0) {
            // This service has no datasources
            return;
        }

        if (this.selectedDatasource === '') {
            // Select the first datasource
            this.selectedDatasource = this.availableDataSources[0].key;
        }

        let params: ServiceBrowserPerfParams = {
            aggregation: this.selectedAggregation,
            host_uuid: this.hostUuid,
            service_uuid: this.serviceUuid,
            gauge: this.selectedDatasource,
            jsTimestamp: 0,
            isoTimestamp: 1,
            angular: true,
            start: this.overviewTimeRange.start,
            end: this.overviewTimeRange.end,
            disableGlobalLoader: true
        };

        if (this.currentGraphUnit !== null) {
            // Append new data in the same unit
            params.forcedUnit = this.currentGraphUnit;
        }

        this.isLoading = true;
        this.overviewSub?.unsubscribe();

        this.overviewSub = this.PopoverGraphService.getPerfdata(params)
            .subscribe({
                next: (perfdata) => {
                    this.cdr.markForCheck();
                    this.isLoading = false;

                    const gauge = perfdata.performance_data?.[0];
                    if (!gauge) {
                        return;
                    }

                    if (this.currentGraphUnit === null) {
                        // First load of data - save the unit we got
                        this.currentGraphUnit = gauge.datasource.unit;
                    }
                    this.renderChart(perfdata);
                }, error: () => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
        this.subscriptions.add(this.overviewSub);
    }

    // Called on page load, on zoom, on data source change, on timerange change
    // Called basically on every change - except the AutoRefresh !!
    public loadDetailPerfdata() {
        if (this.availableDataSources.length === 0) {
            // This service has no datasources
            return;
        }

        if (this.selectedDatasource === '') {
            // Select the first datasource
            this.selectedDatasource = this.availableDataSources[0].key;
        }

        let params: ServiceBrowserPerfParams = {
            aggregation: this.selectedAggregation,
            host_uuid: this.hostUuid,
            service_uuid: this.serviceUuid,
            gauge: this.selectedDatasource,
            jsTimestamp: 0,
            isoTimestamp: 1,
            angular: true,
            start: this.detailTimeRange.start,
            end: this.detailTimeRange.end,
            disableGlobalLoader: true
        };

        if (this.currentGraphUnit !== null) {
            // Append new data in the same unit
            params.forcedUnit = this.currentGraphUnit;
        }

        this.isLoading = true;
        const range = {...this.detailTimeRange};

        this.detailSub?.unsubscribe();
        this.detailSub = this.PopoverGraphService.getPerfdata(params)
            .subscribe({
                next : (perfdata) => {
                    this.cdr.markForCheck();
                    this.isLoading = false;



                    if (this.currentGraphUnit === null) {
                        // First load of data - save the unit we got
                        this.currentGraphUnit = perfdata.performance_data[0].datasource.unit;
                    }

                    // Reset min/max values on reload of data
                    // This is important if the use changes the data source
                    this.currentYMinDetail = undefined;
                    this.currentYMaxDetail = undefined;

                    /**
                     * If the plugin leaves one of the values for minimum or maximum blank, the server API will return
                     * a "best guess" 🚀 value instead of blank. This was probably implemented for the tachometer gauges.
                     * However, for charts, this is bad. Instead of using the "best guess" value, we use the original
                     * plugin output to make sure that min or max are present, and if they are, we use the min or max
                     * values.
                     *
                     * If min is empty, we simply do not set the corresponding value in the graph.
                     */
                    if (perfdata.performance_data[0].datasource.min !== null) {
                        this.currentYMinDetail = perfdata.performance_data[0].datasource.setup.scale.min ?? undefined;
                    }


                    /**
                     * If the plugin leaves one of the values for minimum or maximum blank, the server API will return
                     * a "best guess" 🚀 value instead of blank. This was probably implemented for the tachometer gauges.
                     * However, for charts, this is bad. Instead of using the "best guess" value, we use the original
                     * plugin output to make sure that min or max are present, and if they are, we use the min or max
                     * values.
                     *
                     * If max is empty, we simply do not set the corresponding value in the graph.
                     */
                    if (perfdata.performance_data[0].datasource.max !== null) {
                        this.currentYMaxDetail = perfdata.performance_data[0].datasource.setup.scale.max ?? undefined;
                    }

                    this.lastTimestampWithData = new Date(range.start * 1000);

                    // Store the last timestamp with data
                    // This is used by the auto refresh to only load new data
                    for (const isoTimestamp in perfdata.performance_data[0].data) {
                        let timestamp = new Date(isoTimestamp);
                        if (timestamp > this.lastTimestampWithData) {
                            this.lastTimestampWithData = timestamp;
                        }
                    }

                    // ECharts needs at least 2 data points to render the chart
                    this.hasEnoughData = (Object.keys(perfdata.performance_data[0].data).length >= 2);
                    // Emit the new end time to the parent component
                    this.onGraphChange.emit(range);
                    this.renderChartDetails(perfdata, range);

                }, error: () => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });

        this.subscriptions.add(this.detailSub);

    }

    // Gets called by the Auto Refresh Timer - will only load new perfdata and append to the existing data
    public updateAndAppendPerfdata(start: number, end: number) {
        if (this.availableDataSources.length === 0) {
            // This service has no datasources
            this.cancelAutoRefresh();
            return;
        }

        if (this.selectedDatasource === '') {
            // No data source selected - something is wrong
            this.cancelAutoRefresh();
            return;
        }

        if (!this.detailEchartsInstance) {
            // No Detail Echarts Instance - something is wrong
            return;
        }

        if (this.detailSub && !this.detailSub.closed) {
            // Skip if a request is already in progress - is still open
            return;
        }

        let params: ServiceBrowserPerfParams = {
            aggregation: this.selectedAggregation,
            host_uuid: this.hostUuid,
            service_uuid: this.serviceUuid,
            gauge: this.selectedDatasource,
            jsTimestamp: 0,
            isoTimestamp: 1,
            angular: true,
            start: start,
            end: end,
            disableGlobalLoader: true
        };

        if (this.currentGraphUnit !== null) {
            // Append new data in the same unit
            params.forcedUnit = this.currentGraphUnit;
        }

        const rangeStartAtRequest = this.detailTimeRange.start;
        this.isLoading = true;
        this.subscriptions.add(this.PopoverGraphService.getPerfdata(params)
            .subscribe({ next: (perfdata) => {
                    this.cdr.markForCheck();
                    this.isLoading = false;

                    if (this.currentGraphUnit === null) {
                        // First load of data - save the unit we got
                        this.currentGraphUnit = perfdata.performance_data[0].datasource.unit;
                    }

                    if (Object.keys(perfdata.performance_data[0].data).length === 0) {
                        // No new data available
                        return;
                    }
                    if (rangeStartAtRequest !== this.detailTimeRange.start) {
                        // Prevents race conditions: if the time range changed while the request was in flight.
                        return;
                    }

                    // Store the last timestamp with data
                    const prevLast = this.lastTimestampWithData.getTime();
                    // This is used by the auto refresh to only load new data
                    let data = [];
                    for (const isoTimestamp in perfdata.performance_data[0].data) {
                        const value = perfdata.performance_data[0].data[isoTimestamp];
                        const timestamp = new Date(isoTimestamp);
                        if (timestamp.getTime() <= prevLast) {
                            continue;
                        }

                        data.push([isoTimestamp, value]);
                        if (timestamp > this.lastTimestampWithData) {
                            this.lastTimestampWithData = timestamp;
                        }
                    }

                    // get the new Timestamp for end time
                    const newEnd = Math.max(this.detailTimeRange.end, Math.floor(this.lastTimestampWithData.getTime() / 1000));
                    // update Detail
                    const detailSource = this.detailEchartsInstance.getOption().dataset?.[0]?.source ?? [];

                    // Store the new Timestamp when no data is available, so we can still update the end time of the chart
                    if (detailSource.length === 0) {
                        this.detailTimeRange = {start: this.detailTimeRange.start, end: newEnd};
                        this.loadDetailPerfdata();
                        return;
                    }

                    // Append new data
                    this.detailEchartsInstance.setOption({
                        dataset: {source: [...detailSource, ...data]},
                        xAxis: {max: newEnd * 1000}
                    });

                    // ECharts needs at least 2 data points to render the chart
                    this.hasEnoughData = (detailSource.length + data.length) >= 2;

                    // Store the new Timestamp for end time
                    this.detailTimeRange = {start: this.detailTimeRange.start, end: newEnd};

                    // update Overview
                    if (this.overviewEchartsInstance) {
                        const overviewSource = this.overviewEchartsInstance.getOption().dataset?.[0]?.source;
                        if (overviewSource) {
                            this.overviewTimeRange = {start: this.overviewTimeRange.start, end: Math.max(this.overviewTimeRange.end, newEnd)};
                            this.syncingSlider = true;
                            this.overviewEchartsInstance.setOption({
                                dataset: {source: [...overviewSource, ...data]},
                                xAxis: [{max: this.overviewTimeRange.end * 1000}, {max: this.overviewTimeRange.end * 1000}],
                                dataZoom: [{startValue: this.detailTimeRange.start * 1000, endValue: this.detailTimeRange.end * 1000}]
                            });
                            this.syncingSlider = false;
                        }
                    }


                    this.updateDetailLabel();
                    // Emit the new end time to the parent component
                    this.onGraphChange.emit(this.detailTimeRange);

                }, error : () => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            })
        );
    }

    private renderChartDetails(perfdata: PopoverGraphInterface, range: GenericUnixtimerange) {
        let gauge = perfdata.performance_data[0];
        let data = [];

        // Data format for eCharts
        // https://stackoverflow.com/a/68461548
        for (let isoTimestamp in gauge.data) {
            data.push([isoTimestamp, gauge.data[isoTimestamp]]);
        }
        const hasData = Object.keys(gauge.data).length > 0;

        this.chartOptionDetails = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    // Maybe add a loop if we want to support multiple gauges in one chart
                    const gauge = params[0];
                    const dateTime = DateTime.fromISO(gauge.data[0]).setZone(this.timezone.user_timezone);
                    const value = gauge.data[1];
                    const seriesName = gauge.seriesName;
                    const color = gauge.color;
                    const marker = params[0].marker;

                    const html = `<div class="row">
                        <div class="col-12">
                            ${dateTime.toFormat('dd.MM.yyyy HH:mm:ss')}
                        </div>
                        <div class="col-12">
                            ${marker} ${seriesName} <span class="float-end bold" style="color:${color};">${value} ${this.currentGraphUnit ? this.currentGraphUnit : ''}</span>
                        </div>
                        </div>`;

                    return html;
                }
            },
            xAxis: {
                type: 'time',
                min: range.start * 1000,
                max: range.end * 1000,
                axisLabel: {
                    formatter: (value) => {
                        const dateTime = DateTime.fromMillis(value).setZone(this.timezone.user_timezone);
                        return dateTime.toFormat('dd.LL.yyyy HH:mm:ss');
                    },
                    //rotate: 30,
                    hideOverlap: true, // Hide overlapping labels (When zoomed out)
                    showMinLabel: true,
                    showMaxLabel: true,
                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: true,
                },
                minorSplitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        return `${value} ${this.currentGraphUnit ? this.currentGraphUnit : ''}`
                    }
                },
                //name: gauge.datasource.setup.metric.unit,
                minorTick: {
                    show: true
                },
                minorSplitLine: {
                    show: true
                },
                min: this.currentYMinDetail ?? (hasData ? undefined : 0), // If no data is available, we set the min to 0, so the chart is still visible and not empty
                max: this.currentYMaxDetail ?? (hasData ? undefined : 2), // If no data is available, we set the max to 2, so the chart is still visible and not empty
            },

            grid: {left: 80, right: 50, top: '1%', bottom: 30},


            /*
            toolbox: {
                show: true,
                left: 'center',
                itemSize: 25,
                top: 55,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',

                    },
                    restore: {}
                }
            },

            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                //{
                //     type: 'slider',
                //     start: 0,
                //     end: 100
                //}
            ],
            */


            // Workaround to hide the toolbar and to auto select the dataZoom in this.onChartFinished method
            // https://github.com/apache/echarts/issues/13397#issuecomment-814864873
            toolbox: {
                orient: 'vertical',
                itemSize: 13,
                top: 15,
                right: -6,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        //filterMode: 'none',
                        icon: {
                            zoom: 'path://', // hack to remove zoom button
                            back: 'path://', // hack to remove restore button
                        },
                    },
                },
            },

            dataset: {
                source: data,
                dimensions: ['timestamp', gauge.datasource.name],
            },

            // thresholds
            // visualMap: {
            //    show: false,
            //    pieces: [],
            //},

            // https://stackoverflow.com/a/76809216
            // https://echarts.apache.org/examples/en/editor.html?c=line-sections&code=MYewdgzgLgBAJgQygmBeGBtAUDGBvADwC4YAGAGhgE8SBmU0gX0sJIEZKaYAmADiZbEenEtwCsA_ENoieANkmsYAFlncA7IqFjZ9LSTmyxE5lJLqjDZjjMxes5VcEkAnLpf6YbCtTr9TSmwcvjC0HgFCbNwOTrZsMiESnmyqIQrJOiHqJuQ2gYYh_MkWWbGB9mllkW4hjkxYALoA3FhYoJCwEACmAE4All0QADJ90GiYzW3gYwBmfQA2UL1dcAAiSAjdUBDjGJNYMwCuYMBQfeAwwD1dSF0Ayr0Dw6NQABSIyACU-DYzID0wV7zLqwPpgOBdAjjUhNGBgiFQgA88A2ADpgWAAOZQAAWMAAtF5YfDIQBqUnfPA2XDtMYfTYggCScHGAHJ6VsAPqsmCkuHgyEtXA06awDkgu7zPrAFbjemoiBSmWvEkESiq3k8T5C4VzRbLNYbLYQVEAB0OEBxrypwuFfTgJHFUGZuVtuAgIEOPRljqNEqVK2pMEY2qDfRmgI1yLkMAAPrH-QiYAA-Lwx-ORgVQ1PqGAAMjzichMGRKU-lKD7segxG0DNFqtNrduCgVFNXRIrKlYC6rNdzZRyC2zN9Q6ZcH7zdA83-ncx1y6YD7leFCGuCDureBJDwlxAM56nalmJxUHnXUXPMYK5DOtwjBgXXm3R-ze6_RrL3rlutK5bbY7GAuzBXtJzdJ0R0HBlnQnP89wPTtrjgZcBxgNcbk3Kht3weDZyAnpMQAIwQV5xEyNh1ASCj1E-K8b1DW1r3vLBryuG4lgeD9nmgd4NlDLAQFNM4LnQJsnRIPUliQ9Yx22fszigbCmxbSEoE7VYXn6QjDmEsAYBACMAFFgVOfpgD6VsUOFCBDkIpYCDUoCADEEAAay6GAZIQVkbGsFsQH3M5TR3IMoH6TFMV6TsEAIUYrNwGLRgABRAMEpJC5tW3bTsrhACAIB8xjfPkgL5kIkAhGUmBLRAAB3EgwsOLowJmdivUAqr3QQAA3LoAEEIEZABbBBIp3JjhQmvyYAIPrYogDLhSywDWWAW5MX-Kh4pgcrjkQHoqAAcQQYKYBmBBn2aoMAHprpgU1rigM5enxPpMTAf4uiDekSAwVkGCIBg-yA0g2CINgxGB_7uCIegodIWgiGUSHKH-sRAdIeG5HBlGQfUWHMdR0heCR3HWW8DGoaCHGqZhuHUfiUmqfRoGGexiGqfx-mgLYEnkah7hSEp1HuDBjmRbpwmgO4RH-YaYqbCoObRkW_9sqA7qLqa7bEuGBBCKfVXdX-EanqioC8E1-YmofAB1QrJrA3WUrS83OuqsAToanomqDKb-3fJ4SEDz9oBYpogA&lang=ts
            series: [
                {
                    name: gauge.datasource.name,
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        //color: 'rgb(88,86,214)',
                    },

                    smooth: this.config.smooth, // Smooth the line
                    showSymbol: this.config.showDataPoint, // Show/hide the dots on the line
                    areaStyle: {
                        opacity: 0.2
                    },
                    encode: {
                        x: 'timestamp',
                        y: gauge.datasource.name // refer gauge (rta) value
                    }
                },
            ],
        };

        let thresholds = this.getThresholds(gauge);
        if (thresholds) {
            this.chartOptionDetails.visualMap = thresholds;
        } else {
            // Set default line color to primary
            // @ts-ignore
            this.chartOptionDetails.series[0].lineStyle.color = 'rgb(88,86,214)';
        }

        this.zoomEnabled = false;
        this.cdr.markForCheck();
    }

    /* Overview Slider */
    private renderChart(perfdata: PopoverGraphInterface) {
        const gauge = perfdata.performance_data[0];
        const data = [];

        // Data format for eCharts
        // https://stackoverflow.com/a/68461548
        for (const isoTimestamp in gauge.data) {
            data.push([isoTimestamp, gauge.data[isoTimestamp]]);
        }

        const axisMin = this.overviewTimeRange.start * 1000;
        const axisMax = this.overviewTimeRange.end * 1000;

        this.chartOption = {
            animation: false,
            tooltip: {show: false},
            // Two identical hidden time axes --- DON'T remove them, otherwise the slider will not work --

            // [Axis 0] -> controlled by the slider (selection) -> Details
            // [Axis 1] -> only carries the series, so the slider can never zoom/shift the drawing -> Overview
            xAxis: [
                {type: 'time', show: false, min: axisMin, max: axisMax}, // [Axis 0]
                {type: 'time', show: false, min: axisMin, max: axisMax}  // [Axis 1]
            ],
            yAxis: {type: 'value', show: false, scale: true },
            grid: {show: false, left: 80, right: 50, top: 3, height: 45},
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: 0, // ONLY [Axis 0]
                    left: 80, right: 50, top: 0, height: 45,
                    realtime: false,
                    startValue: this.detailTimeRange.start * 1000,
                    endValue: this.detailTimeRange.end * 1000,
                    labelFormatter: (value: number) => {
                        const dateTime = DateTime.fromMillis(value).setZone(this.timezone.user_timezone);
                        return dateTime.toFormat('dd.LL.yyyy\nHH:mm:ss');
                    },
                    minValueSpan: this.MIN_SPAN_SECONDS * 1000,
                    filterMode: 'none',
                    showDataShadow: false, // the series is the preview
                    //borderColor: 'rgba(128, 128, 128, 0.3)',
                    backgroundColor: 'rgba(128, 128, 128, 0.08)',
                    fillerColor: 'rgba(84, 112, 198, 0.25)',
                }
            ],
            dataset: {
                source: data,
                dimensions: ['timestamp', gauge.datasource.name],
            },
            series: [{
                name: gauge.datasource.name,
                type: 'line',
                xAxisIndex: 1, // the fixed [Axis 1]
                yAxisIndex: 0,
                silent: true,
                showSymbol: false,
                sampling: 'lttb',
                lineStyle: {width: 1, color: '#8392a5'},
                areaStyle: { opacity: 0.3},
                encode: {
                    x: 'timestamp',
                    y: gauge.datasource.name
                }
            }],
        };

        this.cdr.markForCheck();
    }

    public updateChart() {
        if (this.chartOptionDetails && this.chartOptionDetails.series) {

            // Store settings in local storage
            this.LocalStorageService.setItem('ServiceBrowerChartSmooth', (this.config.smooth ? 'true' : 'false'));
            this.LocalStorageService.setItem('ServiceBrowerChartShowPoints', (this.config.showDataPoint ? 'true' : 'false'));

            //@ts-ignore
            this.chartOptionDetails.series[0].smooth = this.config.smooth;
            //@ts-ignore
            this.chartOptionDetails.series[0].showSymbol = this.config.showDataPoint;

            this.detailEchartsInstance.setOption({
                series: [{smooth: this.config.smooth, showSymbol: this.config.showDataPoint}]
            });
            this.cdr.markForCheck();
        }

    }

    public onTimeRangeChange(): void {
        if (this.selectedTimerange <= 0) {
            // no timerange selected - do not load data
            return;
        }

        this.currentGraphUnit = null; // Reset the unit to get the new one from the API
        const r = this.getDetailRange(this.selectedTimerange);
        this.detailTimeRange = r;
        this.timerangePlaceholder = this.TranslocoService.translate('Custom');
        this.updateDetailLabel();

        if (r.start < this.overviewTimeRange.start || r.end > this.overviewTimeRange.end + this.EXPAND_TOLERANCE_SECONDS) {
            this.overviewTimeRange = {
                start: Math.min(r.start, this.overviewTimeRange.start),
                end: Math.max(r.end, this.overviewTimeRange.end)
            };
            this.loadOverviewPerfdata();
        } else {
            this.syncSlider(r.start, r.end);
        }

        this.zoomEnabled = false; // After a re-render we have to re-enable the zoom
        clearTimeout(this.detailTimer);
        this.detailTimer = setTimeout(() => this.loadDetailPerfdata(), 0);
    }

    public reloadChart(): void {
        this.zoomEnabled = false; // After a re-render we have to re-enable the zoom
        clearTimeout(this.detailTimer);
        this.detailSub?.unsubscribe();

        this.currentGraphUnit = null; // Reset the unit to get the new one from the API
        const duration = this.detailTimeRange.end - this.detailTimeRange.start;
        const wasLive = this.detailTimeRange.end >= this.overviewTimeRange.end - 120;

        this.overviewTimeRange = this.getOverviewRange();

        if (this.selectedTimerange > 0) {
            this.detailTimeRange = this.getDetailRange(this.selectedTimerange);
        } else if (wasLive) {
            this.detailTimeRange = {start: Math.max(this.overviewTimeRange.start, this.overviewTimeRange.end - duration), end: this.overviewTimeRange.end};
        }

        this.updateDetailLabel();
        this.loadOverviewPerfdata();
        this.loadDetailPerfdata();
    }

    private getOverviewRange(): GenericUnixtimerange {
        if (!this.timezone) {
            const now = new Date();
            const end = Math.floor(now.getTime() / 1000);
            const start = Math.floor((end - (this.selectedOverviewTimerange * 3600)));
            return {start, end};
        }
        // On load, we get the current server time (12:00:00)
        // If we want to refresh the data, we need to add the seconds since the last reload to now (12:00:30)
        // to also get the latest data
        const end = this.getNowSeconds();
        return {start: end - this.selectedOverviewTimerange * 3600, end};
    }

    private getDetailRange(hours: number): GenericUnixtimerange {
        // Get the latest data
        // end: now is the current server time (12:00:00)
        // start: now - hours is the start time (12:00:00 - 1h = 11:00:00)
        const end = this.getNowSeconds();
        return {start: end - hours * 3600, end};
    }

    private getThresholds(gauge: PerformanceData): VisualMapComponentOption | false {

        let pieces: any[] = []; // VisualPiece is not public

        switch (gauge.datasource.setup.scale.type) {
            case ScaleTypes.O:
                // We do not have any thresholds
                break;

            case ScaleTypes.W_O:
                // ✅
                pieces.push({
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                // +0.00001 because a bug in echarts that does not render if both values are the same
                // https://github.com/apache/echarts/issues/18948
                // https://echarts.apache.org/examples/en/editor.html?c=line-simple&code=PYBwLglsB2AEC8sDeAoWsCeBBAHhAzgFzIC-ANGrDrgcUrGBiAKbEDkAxgIZjMDmwAE4Y2scpXzNBEZkVgBtSulTpVDJq1hsANhGjM2ZWLv0BlRts30A7hAAmYABbEArGIpr0XQcy7mMlnQkSmKUALoesHY8XJJgxIpqKp52EAC2zND4UFkJbBi-goZaIILAAGYQYGwRIej4wACughyaiZ7KdZ4F3uwATAAMAIwDhl1qpRVVxCMD4-7zyR3oPYL9w0Njy6qTlfGwg3Pb4ttLy6vrQ31b27C707AAtEMuR8sny2cdF1qDQwDMN22932_wGbw6wQ6YRCUNgtXQADcCI0uNoALJcEAJEJfBigVwDSJqaR8Rz7IldEAyVpydodejaXjER4DAB04OGRg4wG0QnYPjsog-HQA9KLYGi0sB8GBYPhGhxWsw7PjYI57MwGI4tQAvKTAYxcABGzG0i1gfH2rI54KGRiZxHZnPtsB5fLWWjAgi4WRA3ky1QdJrN7C0Is89Ctmmddu5vP5WmN2kaBlC0OJqiaYAA8uUAEq-vhWebuxNsADEADZmDWa2wunD0HCYSQANxAA
                pieces.push({
                    gt: (Number(gauge.datasource?.setup.warn.low) + 0.00001), // -3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                break;

            case ScaleTypes.C_W_O:
                // ✅

                pieces.push({
                    lte: gauge.datasource?.setup.crit.low, // -5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.crit.low, // -5
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });
                break;


            case ScaleTypes.O_W:
                // ✅
                pieces.push({
                    lt: gauge.datasource?.setup.warn.high, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                // +0.00001 because a bug in echarts that does not render if both values are the same
                pieces.push({
                    gte: Number(gauge.datasource?.setup.warn.high) + 0.00001, // 3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });
                break;

            case ScaleTypes.O_W_C:
                // ✅
                if (gauge.datasource?.setup.warn.low === gauge.datasource?.setup.crit.low) {
                    // If all values are the zero, this breaks the gradient
                    break;
                }

                pieces.push({
                    lt: gauge.datasource?.setup.warn.low, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.low, // 3
                    lt: gauge.datasource?.setup.crit.low, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.low, // 5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });
                break;

            case ScaleTypes.C_W_O_W_C:
                // ✅
                let green = (Number(gauge.datasource.setup.warn.high) + Number(gauge.datasource.setup.warn.low)) / 2;

                pieces.push({
                    lte: gauge.datasource?.setup.crit.low, // -5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical low')
                });

                pieces.push({
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning low')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.low, // -3
                    lt: gauge.datasource?.setup.warn.high, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.high, // 3
                    lt: gauge.datasource?.setup.crit.high, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning high')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.high, // 5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical high')
                });

                break;


            case ScaleTypes.O_W_C_W_O:
                // ✅

                pieces.push({
                    lt: gauge.datasource?.setup.warn.low, // -5
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.low, // -5
                    lt: gauge.datasource?.setup.crit.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning low')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.low, // -3
                    lte: gauge.datasource?.setup.crit.high, // 3
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.crit.high, // 3
                    lte: gauge.datasource?.setup.warn.high, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning high')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.high, // 5
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });
                break;
        }


        let cssSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();
        // Add some transparency to the background color
        cssSecondaryBg += '66';

        if (pieces.length > 0) {
            let visualMap: VisualMapComponentOption = {
                show: true,
                top: 50,
                right: 10,
                pieces: pieces,
                backgroundColor: cssSecondaryBg,
                outOfRange: {
                    //color: 'rgba(86, 166, 75, 1)'
                    color: 'rgba(204, 204, 204, 0.6)'
                }
            };

            return visualMap;
        }

        return false;
    }

    public onChartDataZoom(event: any) {
        const start = Math.floor(event.batch[0].startValue / 1000);
        const end = Math.floor(event.batch[0].endValue / 1000);
        this.syncChartWithTimeline(start, end);
    }

    public onOverviewDataZoom(event: any): void {
        if (this.syncingSlider || !this.overviewEchartsInstance) {
            // Prevent infinite sync loops or uninitialized ECharts instance
            return;
        }

        // dz: get current dataZoom settings from the overview chart, to get the start/end values in seconds
        const dz = (this.overviewEchartsInstance.getOption() as any)?.dataZoom?.[0];
        if (!dz || dz.startValue === undefined || dz.endValue === undefined){
            // No data yet, or the chart is not rendered yet
            return;
        }

        const start = Math.floor(dz.startValue / 1000);
        const end = Math.floor(dz.endValue / 1000);
        if (Math.abs(start - this.detailTimeRange.start) <= 1 && Math.abs(end - this.detailTimeRange.end) <= 1) {
            // Skip update if the time range difference is <= 1 second.
            return;
        }

        // The slider is already the source of the selected range, so do not move it again.
        this.syncingSlider = true;
        this.syncChartWithTimeline(start, end);
        this.syncingSlider = false;
    }

    public onChartFinished(event: any) {
        // Disable the animation after the chart is rendered
        // This is a workaround, to enable zooming after the chart is rendered
        // https://github.com/apache/echarts/issues/13397#issuecomment-814864873
        if (!this.zoomEnabled) {
            setTimeout(() => {
                this.zoomEnabled = true;
                this.detailEchartsInstance.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    dataZoomSelectActive: true,
                });
                this.cdr.markForCheck();
            }, 250);
        }
    }


    /**
     * Formats a timestamp to a human-readable date
     * Depending on the duration, the date will be formatted differently (only hours and minutes, day, month, year)
     * @param timestamp
     * @param duration
     * @private
     */
    private getDateFormatted(timestamp: number, duration: number = 0): string {
        let dateTime = DateTime.fromSeconds(timestamp);

        if (duration < (3600)) {
            // Duration is less than 60 minutes - be more precise
            // Example: 10:20:42 - 10:37:25
            return dateTime.toFormat('HH:mm:ss');
        } else if (duration < (3600 * 24)) {
            // Duration is less than 24h
            // Example: Mon 9, 10:01 - Mon 9, 17:18
            return dateTime.toFormat('EEE d, HH:mm');
        } else if (duration < (3600 * 24 * 30)) {
            // Duration is less than 30 days
            // Example: 17.08 06:49 - 30.08 07:38
            return dateTime.toFormat('dd.MM HH:mm');
        }

        // Example: 13.09.2023 16:00 - 05.09.2024 10:09
        return dateTime.toFormat('dd.MM.yyyy HH:mm');
    }

    private startAutoRefresh() {
        if (this.autoRefreshIntervalId === null) {
            this.autoRefreshIntervalId = setInterval(() => {

                let start = this.lastTimestampWithData.getTime() / 1000;
                let end = this.getNowSeconds();

                // Get back to server time
                if ((end - start) > 0) {
                    this.updateAndAppendPerfdata(start, end);
                }
                this.cdr.markForCheck();

            }, this.autoRefreshInterval * 1000);
            this.cdr.markForCheck();
        }
    }

    private cancelAutoRefresh() {
        this.config.autoRefresh = false;
        if (this.autoRefreshIntervalId) {
            clearInterval(this.autoRefreshIntervalId);
            this.autoRefreshIntervalId = null;
        }
        this.cdr.markForCheck();
    }

    public onAutorefreshChange() {
        if (this.config.autoRefresh && this.autoRefreshInterval > 1) {
            this.startAutoRefresh();
        } else {
            this.cancelAutoRefresh();
        }
    }

    private syncChartWithTimeline(start: number, end: number) {
        start = Math.floor(start);
        end = Math.floor(end);
        if (end - start < this.MIN_SPAN_SECONDS) {
            return;
        }

        // Set selectedTimerange to zero to get the placeholder displayed in the select
        // and to tell the detail loading logic that we use the provided start/end timestamps.
        this.selectedTimerange = 0;

        this.detailTimeRange = {start, end};

        const duration = end - start;
        this.timerangePlaceholder = `${this.getDateFormatted(start, duration)} - ${this.getDateFormatted(end, duration)}`;

        // Only enable auto refresh, if graphEnd timestamp is near to now.
        // We don't need to auto refresh data from the past.
        if ((end + this.autoRefreshInterval + 120) < this.getNowSeconds()) {
            this.cancelAutoRefresh();
        }

        // Keep the overview slider synchronized with detail zoom/timeline changes.
        if (!this.syncingSlider) {
            const ov = this.overviewTimeRange;
            if (start < ov.start || end > ov.end + this.EXPAND_TOLERANCE_SECONDS) {
                this.overviewTimeRange = {
                    start: Math.min(start, ov.start),
                    end: Math.max(end, ov.end)
                };
                this.loadOverviewPerfdata();
            } else {
                this.syncSlider(start, end);
            }
        }
        this.updateDetailLabel();

        // Reload detailed data.
        this.zoomEnabled = false; // After a re-render we have to re-enable the zoom
        clearTimeout(this.detailTimer);
        // Debounces detail data fetching (300ms delay) to prevent spamming the backend while dragging the slider.
        this.detailTimer = setTimeout(() => this.loadDetailPerfdata(), 300);

        this.cdr.markForCheck();
    }

    private syncSlider(start: number, end: number): void {
        if (!this.overviewEchartsInstance) {
            // uninitialized ECharts instance
            return;
        }
        this.syncingSlider = true;
        this.overviewEchartsInstance.dispatchAction({
            type: 'dataZoom',
            dataZoomIndex: 0,
            startValue: start * 1000,
            endValue: end * 1000
        });
        this.syncingSlider = false;
    }

    /**
     * updateDetailLabel():
     * Calculates the total time duration and updates the string variable detailRangeLabel
     * with formatted start and end date-time labels for the UI.
     **/
    private updateDetailLabel(): void {
        const duration = this.overviewTimeRange.end - this.overviewTimeRange.start;
        this.detailRangeLabel = `${this.getDateFormatted(this.overviewTimeRange.start, duration)} - ${this.getDateFormatted(this.overviewTimeRange.end, duration)}`;
    }


    private getNowSeconds(): number {
        if (!this.timezone || !this.ServerTime) {
            return Math.floor(Date.now() / 1000) ;
        }

        // we get the current server time (12:00:00)
        // If we want to refresh the data, we need to add the seconds since the last reload to now (12:00:30)
        return Math.floor(this.ServerTime.getTime() / 1000)
            + Math.floor((Date.now() - this.clientTimeAtLoad) / 1000);
    }
}