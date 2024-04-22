import {
    Component,
    inject,
    Input,
    SimpleChanges,
    OnChanges,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
    ElementRef
} from '@angular/core';
import {
    ColComponent,
    ContainerComponent,
    RowComponent,
} from '@coreui/angular';
import {JsonPipe, KeyValuePipe, NgStyle, DatePipe, NgIf, NgForOf} from '@angular/common';
import * as _uPlot from 'uplot';
import {from,  fromEvent, Observable, Subscription } from 'rxjs';
import {UplotGraphService} from './uplot-graph.service';
import {UplotGraphInterface, PerfParams, Gauges, Datasource} from "./uplot-graph.interface";
import {TimezoneObject} from "../../pages/services-browser-page/timezone.interface";
import {UPlotConfigBuilder} from './uplot-config-builder';
import {FormsModule} from '@angular/forms';

const uPlot: any = (_uPlot as any)?.default;

/*type availableAggregations = [
    avg: string,
    min: string,
    max: string
]; */

type availableTimeranges = {
    [key: number]: string

}

@Component({
    selector: 'oitc-uplot-graph',
    standalone: true,
    imports: [
        ColComponent,
        ContainerComponent,
        RowComponent,
        JsonPipe,
        KeyValuePipe,
        NgIf,
        NgForOf,
        FormsModule,
    ],
    templateUrl: './uplot-graph.component.html',
    styleUrl: './uplot-graph.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class UplotGraphComponent implements OnInit, OnDestroy, OnChanges {
    @Input() service: string = '';
    @Input() host: string = '';
    @Input() gauges: Gauges[] = [];
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
    @Output() showTooltip = new EventEmitter<any>();
    @Output() hideTooltip = new EventEmitter<void>();
    @Input() set cursor(val: _uPlot.Cursor) {
        this._cursor = val;
        if (this.options.cursor) {
            this.options.cursor = Object.assign(this.options.cursor, val);
        } else {
            this.options.cursor = val;
        }
        //this.makeChart(this.data);
    }
    get cursor(): _uPlot.Cursor {
        return this._cursor;
    }
    @Input() tooltips: boolean = true;

    private ctx = document.createElement("canvas").getContext("2d");
    @ViewChild('chartUPlot', {static: true}) chartUPlot: any | HTMLElement;

    private subscriptions: Subscription = new Subscription();
    resizeObservable$: Observable<Event> = fromEvent(window, 'resize');
    ngOnInit() {
        this.resizeObservable$ = fromEvent(window, 'resize');
        this.subscriptions.add(
            this.resizeObservable$.subscribe(e => {
                this.uPlotChart.setSize(this.getSize());
            })
        );

    }

   currentSelectedTimerange:number = 3;
   protected availableTimeranges:any[] = [
       { hours: 1, name: '1 hour'},
       {hours: 3, name: '3 hours'},
       {hours: 8, name: '8 hours'},
       {hours: 24, name: '1 day'},
       {hours: 168, name :'7 days'},
       {hours: 720, name: '30 days'},
       {hours: 2160, name: '90 days'},
       {hours: 4320, name: '6 month'},
       {hours: 8760, name: '1 year'}
    ];
    private currentAggregation:string = 'avg';

  /* private availableAggregations: availableAggregations = [
        ['avg', 'Average'],
        ['min', 'Minimum'],
        ['max', 'Maximum']
    ]; */


    private UplotGraphService = inject(UplotGraphService);
    private uplotConfig: UPlotConfigBuilder = inject(UPlotConfigBuilder);

    private perfdata!: UplotGraphInterface;
    private perfParams: PerfParams = {
        aggregation: 'avg',
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
    private datasource!: Datasource;
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
        plugins: [this.tooltipPlugin({x:10, y:10})],
        height: 400, width: 1000,
        cursor: {
            drag: {
                x: true,
                y: false
                },
            focus: {
                prox: 3,
            },
            points: {
                fill: (u, seriesIdx) => {
                    // @ts-ignore
                    let xIdx = u.cursor.idxs[seriesIdx];

                    if (xIdx != null) {
                        let val = u.data[seriesIdx][xIdx];

                        for (let i = this.htGradBorder.length - 1; i >= 0; i--) {
                            let stop = this.htGradBorder[i];

                            // @ts-ignore
                            if (val >= stop[0])
                                return stop[1];
                        }
                    }

                    return "black";
                }
            }

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
                stroke: (u, seriesIdx) => {
                    return this.scaleGradient(u, 'x', 0, this.htGradBorder, true);
                },

                fill: (u, seriesIdx) => {
                    return this.scaleGradient(u, 'x', 0, this.htGradFill, true);
                },

                value: this.fmtVal,
                points: {show: false}
            },
            {
                label: "warning",
                width: 2,
                stroke: "rgb(255, 187, 51, 1)",
                points: {show: false}
            },
            {
                label: "critical",
                width: 2,
                stroke: "rgb(192, 0, 0, 1)",
                points: {show: false}
            },
        ],
        axes: [
            {
                label: "Time",
                values: [
                    // tick incr  default       year                        month   day                  hour   min               sec  mode
                    [3600*24*365,"{YYYY}",      null,                       null, null,                  null, null,              null, 1],
                    [3600*24*28, "{MMM}",       "\n{YYYY}",                 null, null,                  null, null,              null, 1],
                    [3600*24,    "{D}/{M}",     "\n{YYYY}",                 null, null,                  null, null,              null, 1],
                    [3600,       "{HH}",        "\n{D}/{M}/{YY}",           null, "\n{D}/{M}",           null, null,              null, 1],
                    [60,         "{HH}:{mm}\n{DD}/{MM}/{YY}",   null, null, null,      null, null,              null, 1],
                    [1,          ":{ss}",       "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}",     null, 1],
                    [0.001,      ":{ss}.{fff}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}",     null, 1],
                ]
            },
            {
                label: "y Axis Label",
            }
        ],
        legend: {
            show: true
        },
        hooks: {
            init: [
                u => {
                    u.over.ondblclick = e => {
                        console.log("Fetching data for full range");

                        u.setData(this.data);
                    }
                }
            ],
            setSelect: [
                u => {
                    if (u.select.width > 0) {
                        let min = Math.floor(u.posToVal(u.select.left, 'x'));
                        let max = Math.floor(u.posToVal(u.select.left + u.select.width, 'x'));
                        this.setZoom(min, max);
                       // console.log("Fetching data for range...", min, max);
                    }
                }
            ]
        }


    };

    public perfData!: UplotGraphInterface;

    constructor() {}

    ngOnChanges() {
        if (this.service) {

            this.perfParams.service_uuid = this.service;
        }
        if (this.host) {
            this.perfParams.host_uuid = this.host;
        }
        if (this.gauges) {
            this.perfParams.gauge = this.gauges[0].key;
        }
        if (this.timezone) {
            this.timezoneObject = this.timezone;
            this.setStartEnd();
        }

    }

    protected onTimerangeChange(range: number){
        this.setStartEnd();

    }

    handleResize(resize: any) {
        console.log('onResize', resize);
      //  this.uPlotChart.setSize(this.getSize())
    }


    private  getSize() {
        return {
            width: window.innerWidth - 500,
            height: window.innerHeight - 500,
        }
    }

    private setStartEnd() {
        this.serverTimeDateObject = new Date(this.timezoneObject.server_time_iso);
        this.perfParams.start = this.serverTimeDateObject.getTime() / 1000 - (this.currentSelectedTimerange * 3600);
        this.perfParams.end = this.serverTimeDateObject.getTime() / 1000;
        this.getPerfData()
    }
    private setZoom(min: number, max:number) {
        this.perfParams.start = min;
        this.perfParams.end = max;
        this.getPerfData()
    }

    public getPerfData() {
        this.subscriptions.add(this.UplotGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                this.perfData = perfdata;
                this.performance_data = perfdata.performance_data[0].data;
                this.datasource = perfdata.performance_data[0].datasource;
                if(this.datasource.unit == null){
                    this.datasource.unit = "";
                }
                this.makeGraph();
            })
        );
    }



    public makeGraph() {
       let data: any = [];
       let  xData: string[] = [];
        let yData: number[] = [];
        const graphData = this.perfData.performance_data[0].data
        //this.xData.push(this.perfParams.start.toString()); // Timestamps
       // this.yData.push(0);
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
        let thresholdWarn = parseFloat(this.datasource.warn);
        let thresholdCrit = parseFloat(this.datasource.crit);
        if (thresholdCrit > thresholdWarn) {
            for (let i = 0; i < yData.length; i++) {
                if (yData[i] < thresholdWarn) {
                    this.htGradBorder.push([xData[i], '#00B44D']);
                    this.htGradFill.push([xData[i], "rgba(86, 166, 75, 0.2)"]);
                }
                if (yData[i] >= thresholdWarn && yData[i] < thresholdCrit) {
                    this.htGradBorder.push([xData[i], '#E7931D']);
                    this.htGradFill.push([xData[i], "rgb(255, 187, 51, 0.2)"]);
                }
                if (yData[i] > thresholdCrit) {
                    this.htGradBorder.push([xData[i], '#C00000']);
                    this.htGradFill.push([xData[i], "rgba(224, 47, 68, 0.2)"]);
                }
            }
        }

        if (thresholdCrit < thresholdWarn) {
            for (let i = 0; i < yData.length; i++) {
                if (yData[i] < thresholdCrit) {
                    this.htGradBorder.push([xData[i], '#C00000']);
                    this.htGradFill.push([xData[i], "rgba(224, 47, 68, 0.2)"]);
                }
                if (yData[i] >= thresholdCrit && yData[i] < thresholdWarn) {
                    this.htGradBorder.push([xData[i], '#E7931D']);
                    this.htGradFill.push([xData[i], "rgb(255, 187, 51, 0.2)"]);
                }
                if (yData[i] >= thresholdWarn) {

                    this.htGradBorder.push([xData[i], '#00B44D']);
                    this.htGradFill.push([xData[i], "rgba(86, 166, 75, 0.2)"]);
                }
            }
        }

            if(this.datasource.warn) {

                let warndata: number[] = [];
                for (let i = 0; i < xData.length; i++){
                    warndata[i] = thresholdWarn;
                }
                data.push(warndata);
            }

            if(this.datasource.crit) {

                let critdata: number[] = [];
                for (let i = 0; i < xData.length; i++){
                    critdata[i] = thresholdCrit;
                }
                data.push(critdata);
            }

    }

        if (this.datasource.min){

            // @ts-ignore
          //  this.options.scales.y.range[0] = 0;
        }

        if (this.datasource.max){
        }
        // @ts-ignore
        this.options.axes[1].label = this.datasource.unit;
        // @ts-ignore
        this.options.series[1].label = this.datasource.label;

        // @ts-ignore
        this.options.scales.x.min = this.perfParams.start;
        // @ts-ignore
        this.options.scales.x.max = this.perfParams.end;
        this.chartUPlot.nativeElement.innerHTML = '';

        this.uPlotChart = new uPlot(this.options, data, this.chartUPlot.nativeElement);
    }


    public scaleGradient(u: _uPlot, scaleKey: string, ori: number, scaleStops: any, discrete: boolean = false) {
        let scale:_uPlot.Scale  = u.scales[scaleKey];

        // we want the stop below or at the scaleMax
        // and the stop below or at the scaleMin, else the stop above scaleMin
        let minStopIdx: number = 0;
        let maxStopIdx: number = 0;

        for (let i = 0; i < scaleStops.length; i++) {
            let stopVal: number = scaleStops[i][0];
            // @ts-ignore
            if (stopVal <= scale.min || minStopIdx == null)
                minStopIdx = i;

            maxStopIdx = i;

            // @ts-ignore
            if (stopVal >= scale.max)
                break;
        }

        if (minStopIdx == maxStopIdx)
            {
                return scaleStops[minStopIdx][1];
            }


        let minStopVal = scaleStops[minStopIdx][0];

        let maxStopVal = scaleStops[maxStopIdx][0];

        if (minStopVal == -Infinity)
            minStopVal = scale.min;

        if (maxStopVal == Infinity)
            maxStopVal = scale.max;

        let minStopPos = u.valToPos(minStopVal, scaleKey, true);
        let maxStopPos = u.valToPos(maxStopVal, scaleKey, true);

        let range = minStopPos - maxStopPos;

        let x0, y0, x1, y1;

        if (ori == 1) {
            x0 = x1 = 0;
            y0 = minStopPos;
            y1 = maxStopPos;
        }
        else {
            y0 = y1 = 0;
            x0 = minStopPos;
            x1 = maxStopPos;
        }


        // @ts-ignore
        let grd = this.ctx.createLinearGradient(x0, y0, x1, y1);

        let prevColor;

        for (let i = minStopIdx; i <= maxStopIdx; i++) {
            let s = scaleStops[i];

            let stopPos = i == minStopIdx ? minStopPos : i == maxStopIdx ? maxStopPos : u.valToPos(s[0], scaleKey, true);
            let pct = (minStopPos - stopPos) / range;

            if (discrete && i > minStopIdx)
                grd.addColorStop(pct, prevColor);

            grd.addColorStop(pct, prevColor = s[1]);
        }

        return grd;
    }

    tooltipPlugin({ shiftX = 10, shiftY = 10}: any) {
        let tooltipLeftOffset = 0;
        let tooltipTopOffset = 0;

        const tooltip = document.createElement("div");
        tooltip.className = "u-tooltip";

        let seriesIdx: any  = null;
        let dataIdx: any  = null;

        const fmtDate = uPlot.fmtDate("{DD}-{MM}-{YYYY} {HH}:{mm}");

        let over: any;

        let tooltipVisible = false;

        const showTooltip = () => {
            if (!tooltipVisible) {
                tooltip.style.display = "block";
                // over.style.cursor = "pointer";
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
                let top = u.valToPos(u.data[seriesIdx][dataIdx] as any, 'y');
                let lft = u.valToPos(u.data[        0][dataIdx], 'x');

                tooltip.style.top  = (tooltipTopOffset  + top + shiftX) + "px";
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
                        tooltipLeftOffset = parseFloat(over.style.left);
                        tooltipTopOffset = parseFloat(over.style.top);
                        u?.root?.querySelector(".u-wrap")?.appendChild(tooltip);

                        let clientX: number;
                        let clientY: number;

                    }
                ],

                setCursor: [
                    (u: _uPlot) => {
                        let c = u.cursor;
                        if (dataIdx != c.idx) {
                            dataIdx = c.idx;
                            if (seriesIdx !== null) {
                                setTooltip(u);
                            }
                        }
                    }
                ],
                setSeries: [
                    (u:_uPlot, sidx: any) => {
                        if (seriesIdx != sidx) {
                            seriesIdx = sidx;

                            if (sidx == null) {
                                hideTooltip();
                            }
                            else if (dataIdx != null) {
                                setTooltip(u);
                            }
                        }
                    }
                ],
            }
        };
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
