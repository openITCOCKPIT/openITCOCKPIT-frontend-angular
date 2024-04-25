import {
    Component,
    inject,
    Input,
    OnChanges,
    ViewChild,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,

} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    ColComponent,
    ContainerComponent,
    RowComponent,
    ButtonDirective, FormSelectDirective, FormCheckInputDirective, FormCheckLabelDirective
} from '@coreui/angular';
import { JsonPipe, KeyValuePipe, NgStyle, DatePipe, NgIf, NgForOf } from '@angular/common';
import * as _uPlot from 'uplot';
import { from, fromEvent, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { UplotGraphService } from './uplot-graph.service';
import { UplotGraphInterface, PerfParams, Gauges, Datasource } from "./uplot-graph.interface";
import { TimezoneObject } from "../../pages/services-browser-page/timezone.interface";
import { UPlotConfigBuilder } from './uplot-config-builder';
import { FormsModule } from '@angular/forms';
import { timer, interval } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

const uPlot: any = (_uPlot as any)?.default;

type availableAggregations = [
    { type: string, name: string },
    { type: string, name: string },
    { type: string, name: string }
];

type availableTimeranges =  { hours: number, name: string }[];


@Component({
    selector: 'oitc-uplot-graph',
    standalone: true,
    imports: [
        ColComponent,
        ContainerComponent,
        ButtonDirective,
        RowComponent,
        JsonPipe,
        KeyValuePipe,
        NgIf,
        NgForOf,
        FormsModule,
        FormSelectDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
    ],
    templateUrl: './uplot-graph.component.html',
    styleUrl: './uplot-graph.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class UplotGraphComponent implements OnInit, OnDestroy, OnChanges {
    @Input() service: string = '';
    @Input() host: string = '';
    @Input()
    get gauges() {
        return this.availableGauges;
    }

    set gauges(gauges: any) {
        this.availableGauges = gauges;
    }
    @Input() timezone: TimezoneObject = {
        user_timezone: '',
        user_time_to_server_offset: 0,
        user_offset: 0,
        server_time_utc: 0,
        server_time: '',
        server_timezone_offset: 0,
        server_time_iso: '',
        server_timezone: '',
    };
    _cursor: _uPlot.Cursor = {};
    @Input() customTooltip: boolean = false;
    @Output() showTooltip: EventEmitter<any> = new EventEmitter<any>();
    @Output() hideTooltip: EventEmitter<void> = new EventEmitter<void>();

    @Input() set cursor(val: _uPlot.Cursor) {
        this._cursor = val;
        if (this.options.cursor) {
            this.options.cursor = Object.assign(this.options.cursor, val);
        } else {
            this.options.cursor = val;
        }
    }

    get cursor(): _uPlot.Cursor {
        return this._cursor;
    }

    @Input() tooltips: boolean = true;
    @ViewChild('chartUPlot', {static: true}) chartUPlot: any | HTMLElement;
    protected currentGauge: string = '';
    protected autoReload: boolean = false;
    protected availableGauges: {key: string, displayName: string}[] =[];
    private subscriptions: Subscription = new Subscription();
    resizeObservable$: Observable<Event> = fromEvent(window, 'resize');
    stopPlay$: Subject<any> = new Subject();
    ngOnInit() {
        this.resizeObservable$ = fromEvent(window, 'resize');
        this.subscriptions.add(
            this.resizeObservable$.subscribe(e => {
                this.uPlotChart.setSize(this.getSize());
            })
        );
        this.currentGauge= this.availableGauges[0].key
    }

    currentSelectedTimerange: number = 3;
    protected availableTimeranges:availableTimeranges = [
        { hours: 1, name: '1 hour' },
        { hours: 3, name: '3 hours' },
        { hours: 8, name: '8 hours' },
        { hours: 24, name: '1 day' },
        { hours: 168, name: '7 days' },
        { hours: 720, name: '30 days' },
        { hours: 2160, name: '90 days' },
        { hours: 4320, name: '6 month' },
        { hours: 8760, name: '1 year' }
    ];
    protected currentAggregation: string = 'avg';

    protected availableAggregations: availableAggregations = [
        { type: 'avg', name: 'Average' },
        { type: 'min', name: 'Minimum' },
        { type: 'max', name: 'Maximum' }
    ];

    private config: UPlotConfigBuilder;
    protected colors:any;
    private UplotGraphService = inject(UplotGraphService);

    private perfdata!: UplotGraphInterface;
    private perfParams: PerfParams = {
        aggregation: '',
        angular: true,
        gauge: '',
        host_uuid: '',
        service_uuid: '',
        start: 0,
        end: 0
    };
    private timezoneObject: TimezoneObject = {
        user_timezone: '',
        user_time_to_server_offset: 0,
        user_offset: 0,
        server_time_utc: 0,
        server_time: '',
        server_timezone_offset: 0,
        server_time_iso: '',
        server_timezone: '',
    };
    private serverTimeDateObject?: string | number | Date;
    private performance_data: object = {};
    public datasource: Datasource = {
        ds: '',
        name: '',
        label: '',
        metric: '',
        unit:  '',
        act: '',
        warn: null,
        crit: null,
        min: null,
        max: null
    };
    private data: any = [];

    private uPlotChart: any;

    private htGradBorder: string [][] = [];
    private htGradFill: string [][] = [];


    fmtVal = (u: any, raw: any, sidx: any, didx: any) => {
        if (didx == null) {
            let d = u.data[sidx];
            return `${d[d.length - 1]} (last)`;
        }

        return raw == null ? '' : raw;
    };

    private options: _uPlot.Options = {
        plugins: [this.tooltipPlugin({x: 10, y: 10})],
        height: 300, width: 900,
        cursor: {
            drag: {
                x: true,
                y: false
            },
            focus: {
                prox: 3,
            },
        },
        scales: {
            x: {
                time: true,
                auto: true,
                min: 0,
                max: new Date().getTime()
            },
            y: {
                auto: true,
                // range: (self, dataMin, dataMax) => uPlot.rangeNum(0, dataMax, 0.2, true),
                distr: 1

            }
        },
        series: [
            {},
            {
                label: "",
                width: 2,
                stroke: (u: uPlot, seriesIdx: number) => {
                    return this.config.scaleGradient(u, 'x', 0, this.htGradBorder, true);
                },
                fill: (u: uPlot, seriesIdx: number) => {
                    return this.config.scaleGradient(u, 'x', 0, this.htGradFill, true);
                },
                value: this.fmtVal,
                points: {show: false}
            },
        ],
        axes: [
            {
                label: "Time",
                values: [
                    // tick incr  default       year                        month   day                  hour   min               sec  mode
                    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
                    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600 * 24, "{D}/{M}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600, "{HH}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
                    [60, "{HH}:{mm}\n{DD}/{MM}/{YY}", null, null, null, null, null, null, 1],
                    [1, ":{ss}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
                    [0.001, ":{ss}.{fff}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
                ]
            },
            {
                label: "",
                values: function(u, vals, space) {
                    return vals.map((v) => {
                        return v;
                    });
                }
            }
        ],
        legend: {
            show: false
        },
        hooks: {
            setSelect: [
                u => {
                    if (u.select.width > 0) {
                        let min = Math.floor(u.posToVal(u.select.left, 'x'));
                        let max = Math.floor(u.posToVal(u.select.left + u.select.width, 'x'));
                        this.setZoom(min, max);
                    }
                }
            ],

        }
    };

    private perfData!: UplotGraphInterface;

    constructor() {
        this.config =  new UPlotConfigBuilder();
        this.colors = this.config.getColors();
    }

    ngOnChanges() {
        if (this.service) {

            this.perfParams.service_uuid = this.service;
        }
        if (this.host) {
            this.perfParams.host_uuid = this.host;
        }

        if (this.timezone) {
            this.timezoneObject = this.timezone;
            this.prepare();
        }
    }

    protected onTimerangeChange(range: number) {
        this.prepare();
    }

    protected onAgregationChange(val: string) {
        this.prepare();
    }

    protected onGaugeChange(val: string) {
        this.currentGauge = val;
        this.prepare();
    }
    protected reload() {
        this.prepare();
    }

    protected autoreload() {
        if(this.autoReload){
            timer(0, 30000).pipe(
                takeUntil(this.stopPlay$,)
            ).subscribe(t => this.prepare());
        }else {
            this.stopPlay$.next(true);
        }
    }

    private getSize() {
        return {
            width: window.innerWidth - 500,
            height: 300,
        }
    }

    private prepare() {
        this.serverTimeDateObject = new Date(this.timezoneObject.server_time_iso);
        this.perfParams.start = this.serverTimeDateObject.getTime() / 1000 - (this.currentSelectedTimerange * 3600);
        this.perfParams.end = this.serverTimeDateObject.getTime() / 1000;
        this.perfParams.aggregation= this.currentAggregation;
        if(this.currentGauge === ''){
            this.perfParams.gauge = this.availableGauges[0].key;
        } else {
            this.perfParams.gauge = this.currentGauge;
        }
        this.datasource.warn = null;
        this.datasource.crit = null;
        this.datasource.min = null;
        this.datasource.max = null;
        this.getPerfData()
    }

    private setZoom(min: number, max: number) {
        this.perfParams.start = min;
        this.perfParams.end = max;
        this.getPerfData()
    }

    public getPerfData() {
        this.subscriptions.add(this.UplotGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                this.perfData = perfdata;
               // this.performance_data = perfdata.performance_data[0].data;
                this.datasource = perfdata.performance_data[0].datasource;
                if (this.datasource.unit == null) {
                    this.datasource.unit = "";
                }

                this.makeGraph();
            })
        );
    }


    public makeGraph() {

        if(this.options.series.length > 2){
            this.options.series.pop();
            this.options.series.pop();
        }
        let data: any = [];
        let xData: string[] = [];
        let yData: number [] = [];
        xData.push(this.perfParams.start.toString()); //necessary for threshold lines in full graph-width
        // @ts-ignore
        yData.push(null);

        const graphData = this.perfData.performance_data[0].data
        for (let timestamp in graphData) {
            xData.push(timestamp); // Timestamps
            yData.push(graphData[timestamp]); // values
        }
        data.push(xData);
        data.push(yData);
        if (
            this.datasource.warn !== "" &&
            this.datasource.crit !== "" &&
            this.datasource.warn !== null &&
            this.datasource.crit !== null
        ) {
            this.htGradBorder = [];
            this.htGradFill = [];
            this.options.series.push({
                label: "warning",
                width: 2,
                stroke: this.colors.stroke.warn,
                points: {show: false}
            });
            this.options.series.push({
                label: "critical",
                width: 2,
                stroke: this.colors.stroke.crit,
                points: {show: false}
            })

            let thresholdWarn = parseFloat(this.datasource.warn);
            let thresholdCrit = parseFloat(this.datasource.crit);

            if (thresholdCrit > thresholdWarn) {
                for (let i = 0; i < yData.length; i++) {
                    if (yData[i] < thresholdWarn) {
                        this.htGradBorder.push([xData[i], this.colors.stroke.ok]);
                        this.htGradFill.push([xData[i], this.colors.fill.ok]);
                    }
                    if (yData[i] >= thresholdWarn && yData[i] < thresholdCrit) {
                        this.htGradBorder.push([xData[i], this.colors.stroke.warn]);
                        this.htGradFill.push([xData[i], this.colors.fill.warn]);
                    }
                    if (yData[i] > thresholdCrit) {
                        this.htGradBorder.push([xData[i], this.colors.stroke.crit]);
                        this.htGradFill.push([xData[i], this.colors.fill.crit]);
                    }
                }
            }

            if (thresholdCrit < thresholdWarn) {
                for (let i = 0; i < yData.length; i++) {
                    if (yData[i] < thresholdCrit) {
                        this.htGradBorder.push([xData[i], this.colors.stroke.crit]);
                        this.htGradFill.push([xData[i], this.colors.fill.crit]);
                    }
                    if (yData[i] >= thresholdCrit && yData[i] < thresholdWarn) {
                        this.htGradBorder.push([xData[i], this.colors.stroke.warn]);
                        this.htGradFill.push([xData[i], this.colors.fill.warn]);
                    }
                    if (yData[i] >= thresholdWarn) {

                        this.htGradBorder.push([xData[i], this.colors.stroke.ok]);
                        this.htGradFill.push([xData[i], this.colors.fill.ok]);
                    }
                }
            }

            if (this.datasource.warn) {

                let warndata: number[] = [];
                for (let i = 0; i < xData.length; i++) {
                    warndata[i] = thresholdWarn;
                }
                data.push(warndata);
            }

            if (this.datasource.crit) {

                let critdata: number[] = [];
                for (let i = 0; i < xData.length; i++) {
                    critdata[i] = thresholdCrit;
                }
                data.push(critdata);
            }
            this.options.series[1].stroke = (u: uPlot, seriesIdx: number) => {
                return this.config.scaleGradient(u, 'x', 0, this.htGradBorder, true);
            };
            this.options.series[1].fill = (u: uPlot, seriesIdx: number) => {
                return this.config.scaleGradient(u, 'x', 0, this.htGradFill, true);
            };
            this.options.series[1].label = this.currentGauge;
        } else{
            this.options.series[1].stroke = this.colors.stroke.default;
            this.options.series[1].fill = this.colors.fill.default;
            this.options.series[1].label = this.currentGauge;
        }


        // @ts-ignore
        this.options.scales.x.min = this.perfParams.start;
        // @ts-ignore
        this.options.scales.x.max = this.perfParams.end;
        // @ts-ignore
        this.options.axes[1].label = this.datasource.unit;
        this.chartUPlot.nativeElement.innerHTML = '';
        this.uPlotChart = new uPlot(this.options, data, this.chartUPlot.nativeElement);
    }

    tooltipPlugin({shiftX = 10, shiftY = 10}: any) {
        let tooltipLeftOffset: number = 0;
        let tooltipTopOffset: number = 0;

        const tooltip = document.createElement("div");
        tooltip.className = "u-tooltip";

        let seriesIdx: any = null;
        let dataIdx: any = null;

        const fmtDate = uPlot.fmtDate("{DD}-{MM}-{YYYY} {HH}:{mm}");

        let over: any;

        let tooltipVisible = false;

        const showTooltip = () => {
            if (!tooltipVisible) {
                tooltip.style.display = "block";
                tooltipVisible = true;
            }
        }

        const hideTooltip = () => {
            this.hideTooltip.emit()
            if (tooltipVisible) {
                tooltip.style.display = "none";
                over.style.cursor = null;
                tooltipVisible = false;
            }
        }

        const setTooltip = (u: _uPlot) => {
            showTooltip();

            if (this.customTooltip) {
                this.showTooltip.emit(
                    {
                        currentPoint: u.data[seriesIdx][dataIdx],
                        data: u.data
                    }
                )
            } else {
                let top: number = u.valToPos(u.data[seriesIdx][dataIdx] as any, 'y');
                let lft: number = u.valToPos(u.data[0][dataIdx], 'x');

                tooltip.style.top = (tooltipTopOffset + top + shiftX) + "px";
                tooltip.style.left = (tooltipLeftOffset + lft + shiftY) + "px";
                tooltip.textContent = (
                    fmtDate(new Date(u.data[0][dataIdx] * 1e3)) + " - " +
                    uPlot.fmtNum(u.data[seriesIdx][dataIdx]) + this.datasource.unit
                );
            }
        }

        return {
            hooks: {
                ready: [
                    (u: _uPlot) => {
                        over = u.over;
                        u?.root?.querySelector(".u-wrap")?.appendChild(tooltip);
                    }
                ],

                setCursor: [
                    (u: _uPlot) => {
                        let c: uPlot.Cursor = u.cursor;
                        if (dataIdx != c.idx) {
                            dataIdx = c.idx;
                            if (seriesIdx !== null) {
                                setTooltip(u);
                            }
                        }
                    }
                ],
                setSeries: [
                    (u: _uPlot, sidx: any) => {
                        if (seriesIdx != sidx) {
                            seriesIdx = sidx;

                            if (sidx == null) {
                                hideTooltip();
                            } else if (dataIdx != null) {
                                setTooltip(u);
                            }
                        }
                    }
                ],
            }
        };
    }


    public ngOnDestroy() {
        this.stopPlay$.complete();
        this.subscriptions.unsubscribe();
    }

}
