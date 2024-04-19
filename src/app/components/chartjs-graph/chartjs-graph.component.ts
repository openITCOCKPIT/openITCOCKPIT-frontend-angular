import {
    Component,
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
    ElementRef,
    inject
} from '@angular/core';
import {MergedService} from "../../pages/services-browser-page/services.interface";
import {TimezoneObject} from "../../pages/services-browser-page/timezone.interface";
import gradient from 'chartjs-plugin-gradient'
import 'chartjs-adapter-luxon';
import { DateTime } from "luxon";
import {from,  fromEvent, Observable, Subscription } from 'rxjs';
import {ChartjsGraphService} from './chartjs-graph.service';
import {ChartjsGraphInterface, PerfParams, PerformanceData, Datasource, Data} from "./chartjs-graph.interface";
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    ScatterController,
    CategoryScale,
    LinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js'
import {UplotGraphInterface} from '../uplot-graph/uplot-graph.interface';
Chart.register(LineElement, PointElement, LineController, ScatterController, CategoryScale, LinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle, gradient)
@Component({
  selector: 'oitc-chartjs-graph',
  standalone: true,
  imports: [],
  templateUrl: './chartjs-graph.component.html',
  styleUrl: './chartjs-graph.component.css'
})
export class ChartjsGraphComponent implements AfterViewInit, OnChanges {
    @Input() service!: string;
    @Input() host!: string;
    @Input() merged!: MergedService;
    @Input() timezone!: TimezoneObject;
    @ViewChild('chartCanvas', {static: true}) canvas!: any| HTMLElement;
    private colors!:  {
        defaultFillColor: 'rgb(66, 133, 244, 0.2)',
        defaultBorderColor: 'rgba(50, 116, 217, 1)',
    };
    private currentSelectedTimerange: number = 3;
    private performance_data: object = {};
    private datasource!: Datasource;

    private datasetData!: {x: number, y: number}[];
    private subscriptions: Subscription = new Subscription();
    private GraphService = inject(ChartjsGraphService);
    private perfData!: ChartjsGraphInterface;
    private serverTimeDateObject!: string | number | Date;
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
    private perfdata!: PerformanceData;
    private serverTimeString!:string;
    private perfParams: PerfParams = {
        aggregation: 'avg',
        angular: true,
        gauge: '',
        host_uuid: '',
        service_uuid: '',
        start: 0,
        end: 0
    };
    ngAfterViewInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');
        this.perfParams.service_uuid = this.service;
        this.perfParams.host_uuid = this.host;
        //this.setStartEnd();
    }

    ngOnChanges() {
        if (this.service) {
            console.log('service changed')
            this.perfParams.service_uuid = this.service;
        }
        if (this.host) {
            console.log('host changed')
            this.perfParams.host_uuid = this.host;
        }
        if (this.merged) {
            console.log('merged changed')
            //this.perfParams.host_uuid = this.host;
        }
        if (this.timezone) {
            console.log('timezone changed')
            this.timezoneObject = this.timezone;
            this.setStartEnd();
        }

    }

    private setStartEnd() {
        // let DateString: string = this.timezoneObject.server_time_iso;
        this.serverTimeDateObject = new Date(this.timezoneObject.server_time_iso);
        this.perfParams.start = this.serverTimeDateObject.getTime() / 1000 - (this.currentSelectedTimerange * 3600);
        this.perfParams.end = this.serverTimeDateObject.getTime() / 1000;
        this.getPerfData()
    }

    public getPerfData() {
        this.subscriptions.add(this.GraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                this.perfData = perfdata;
                this.performance_data = perfdata.performance_data[0].data;
                this.datasource = perfdata.performance_data[0].datasource;
                this.fillData();
            })
        );
    }

    private fillData (){
        let datasetData = [];
        let dataValues = [];
        for (const [key, value] of Object.entries(this.performance_data)) {
            var date = new Date(parseInt(key, 10))
            datasetData.push({
                x: parseInt(key, 10),
                y: value
            });
            dataValues.push(value);
        }
        this.datasetData = datasetData;

        let colors = []; //[{value:borderColor, ..}, {value: fillColor, ..}]
        let warn = '';
        let crit = '';
        let warnString = '';
        let critString = '';
        let displayString = '';
        if (
            this.datasource.warn !== "" &&
            this.datasource.crit !== "" &&
            this.datasource.warn !== null &&
            this.datasource.crit !== null
        ) {
          let  warnnumber = parseFloat(this.datasource.warn);
          let critnumber = parseFloat(this.datasource.crit);
          let  warnString = 'warning-threshold: ' + warn;
            critString = 'critical-threshold: ' + crit;
            colors = this.getColors(warnnumber, critnumber);
        } else {
            colors[0] = { [this.datasetData[0].x]: this.colors.defaultBorderColor };
            colors[1] = { [this.datasetData[0].x]: this.colors.defaultFillColor };
        }
        if (warnString !== '' && critString !== '') {
            displayString = warnString + ', ' + critString;
        }

        new Chart(this.canvas.nativeElement, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'test',
                        data: this.datasetData,
                        fill: true,
                        gradient: {
                            borderColor: {
                                axis: 'x',
                                colors: colors[0],
                            },
                            backgroundColor: {
                                axis: 'x',
                                colors: colors[1]
                            }
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',

                },
                plugins: {
                    title: {
                        display: true,
                        text: displayString
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        displayColors: false,
                    },
                     legend: {
                         position: 'top',
                         title: {
                             display: true,
                             text: this.datasource.unit || ''
                         }
                     },
                },
                elements: {
                    point: {
                        radius: 0,
                        hitRadius: 10
                    },
                },
                scales: {
                    x: {
                        adapters: {
                            date: {
                                setZone: true,
                                zone: this.timezone.user_timezone
                            }
                        },
                        type: 'time',
                      //  distribution: 'linear',
                        min: this.perfParams.start * 1000,
                        max: this.perfParams.end * 1000,
                         time: {
                             unit: 'minute',
                             displayFormats: {
                                 minutes: 'dd.LL T', //luxon-formats
                                 hour: 'dd T',
                             }
                         },

                        title: {
                            display: true,
                            text: 'Timeline'
                        },
                      /*  ticks: {
                            maxTicksLimit: 15,
                            min: 5,
                            max: 15
                        }, */
                    },
                    y: {
                       // max: this.options.scales.y.max,
                        type: 'linear',
                       // beginAtZero: this.options.scales.y.beginAtZero,
                        title: {
                          //  position: 'left',
                            display: true,
                            text: this.datasource.unit || ''
                        },
                      /*  ticks: {
                            minTicksLimit: 5,
                            maxTicksLimit: 10
                        } */
                    }
                },
            },
        });



    }

    private  getColors(warn: number, crit: number): [{}, {}] {
        let data = this.datasetData
        let fColor
        let bColor
        let fColors = {}
        let bColors = {}
        const fillColors = ["rgb(18, 132, 10, 0.2)", "rgb(255, 187, 51, 0.2)", "rgb(204, 0, 0, 0.2)"] //ok,warn, crit
        const borderColors = ["rgb(18, 132, 10, 1)", "rgb(255, 187, 51, 1)", "rgb(192, 0, 0, 1)"] //ok,warn, crit

        for (let i = 0; i < data.length; i++) {
            if (warn > crit) {
                if (data[i].y >= warn) {
                    fColor = fillColors[0];
                    bColor = borderColors[0];
                }
                if (data[i].y < warn && data[i].y >= crit) {
                    fColor = fillColors[1];
                    bColor = borderColors[1];
                }
                if (data[i].y < crit) {
                    //color = scaleStops[2]
                    fColor = fillColors[2];
                    bColor = borderColors[2];
                }
            } else {
                if (data[i].y < warn) {
                    fColor = fillColors[0];
                    bColor = borderColors[0];
                }
                if (data[i].y >= warn && data[i].y < crit) {
                    fColor = fillColors[1];
                    bColor = borderColors[1];
                }
                if (data[i].y >= crit) {
                    fColor = fillColors[2];
                    bColor = borderColors[2];
                }
            }
            let key = data[i].x;
            // @ts-ignore
            fColors[key] = fColor;
            // @ts-ignore
            bColors[key] = bColor;
        }
        return [bColors, fColors];
    }

    private makeGraph() {

    }

}
