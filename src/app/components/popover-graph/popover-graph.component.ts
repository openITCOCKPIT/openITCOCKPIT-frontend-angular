import { Component, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PopoverDirective, RowComponent } from '@coreui/angular';
import { TimezoneObject } from "../../pages/services/services-browser-page/timezone.interface";
import { PopoverGraphService } from './popover-graph.service';
import { Subscription } from 'rxjs';
import { PopoverGraphInterface, PerformanceData } from './popover-graph.interface';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { PopoverConfigBuilder } from './popover-config-builder';
import * as _uPlot from 'uplot';

const uPlot: any = (_uPlot as any)?.default;

type PerfParams = {
    angular: boolean,
    host_uuid: string,
    service_uuid: string,
    start: number,
    end: number,
    jsTimestamp: number
}


@Component({
    selector: 'oitc-popover-graph',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PopoverDirective,
        NgStyle,
        NgForOf,
        NgClass,
        RowComponent,
        NgIf
    ],
    templateUrl: './popover-graph.component.html',
    styleUrl: './popover-graph.component.css'
})
export class PopoverGraphComponent implements OnDestroy {
    public visible: boolean = false;
    public popoverWidth: string = '272px'
    public _hostUuid: string = '';
    public _serviceUuid: string = '';
    private PopoverGraphService = inject(PopoverGraphService);
    private subscriptions: Subscription = new Subscription();
    public uPlotGraphDefaultsObj = new PopoverConfigBuilder();
    private perfParams: PerfParams = {
        angular: true,
        host_uuid: this._hostUuid,
        service_uuid: this._serviceUuid,
        start: 0,
        end: 0,
        jsTimestamp: 0
    };
    private timer: ReturnType<typeof setTimeout> | null = null;
    protected colors:any;
    @ViewChild('chartUPlot', {static: true}) chartUPlot: any | HTMLElement;
    private uPlotChart: any;
    public perfData!: PerformanceData[];
    private startTimestamp: number = new Date().getTime();

    constructor () {
        this.colors = this.uPlotGraphDefaultsObj.getColors();
    }

    get service () {
        return this._serviceUuid;
    }

    @Input()
    set service (serviceUuid: string) {
        this._serviceUuid = serviceUuid;
    }

    get host () {
        return this._hostUuid;
    }

    @Input()
    set host (hostUuid: string) {
        this._hostUuid = hostUuid;
    }

    public _timezone!: TimezoneObject;

    get timezone () {
        return this._timezone
    }

    @Input()
    set timezone (timezone: TimezoneObject) {
        this._timezone = timezone;
    }

    showTooltip () {
        this.setParams();
        if(this.timer === null){
            this.timer = setTimeout(() => {
                this.getPerfData();
                this.visible = !this.visible;
                this.timer = null;
            }, 150);
        }

    }

    hideTooltip () {
       // this.visible = !this.visible;
    }

    setParams () {
        let serverTime: Date = new Date(this.timezone.server_time_iso);
        let compareTimestamp: number = new Date().getTime();
        let diffFromStartToNow: number = compareTimestamp - this.startTimestamp;

        let graphEnd = Math.floor((serverTime.getTime() + diffFromStartToNow) / 1000);
        let graphStart = graphEnd - (3600 * 4);
        this.perfParams.host_uuid = this._hostUuid,
            this.perfParams.service_uuid = this._serviceUuid,
            this.perfParams.start = graphStart;
        this.perfParams.end = graphEnd;

        this.getPerfData();

    }

    getPerfData () {
        this.subscriptions.add(this.PopoverGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                this.perfData = perfdata.performance_data;
              //  console.log(this.perfData);
                const element = document.getElementById('serviceGraphContainer-' + this.service);
               // console.log(element?.getBoundingClientRect());
                if (this.perfData.length > 1) {
                    this.popoverWidth = '200px';
                }


                this.renderGraphs();

            })
        );
    }

    renderGraphs () {
        for (let i = 0; i < this.perfData.length; i++) {
            if (i > 0) {
                //Only render 4 gauges in popover...
                break;
            }

            let uPlotGraphDefaultsObj = new PopoverConfigBuilder();

            let data: any = [];
            let xData: string[] = [];
            let yData: number[] = [];
            const graphData = this.perfData[i].data;
            for (let timestamp in graphData) {
                xData.push(timestamp); // Timestamps
                yData.push(graphData[timestamp]); // values
            }
            data.push(xData);
            data.push(yData);

            let title = this.perfData[i].datasource.name;
            if (title.length > 80) {
                title = title.substring(0, 80);
                title += '...';
            }

            let $elm = document.getElementById('#serviceGraphUPlot-' + this._serviceUuid + '-' + i);

            let colors = uPlotGraphDefaultsObj.getColorByIndex(i);
            let options = uPlotGraphDefaultsObj.getDefaultOptions({
                unit: this.perfData[i].datasource.unit,
                showLegend: false,
                timezone: this.timezone.user_timezone,
                lineWidth: 2,
                thresholds: {
                    show: true,
                    warning: this.perfData[i].datasource.warn,
                    critical: this.perfData[i].datasource.crit,
                },
                // X-Axis min / max
                start: this.perfParams.start,
                end: this.perfParams.end,
                //Fallback if no thresholds exists
                strokeColor: colors.stroke,
                fillColor: colors.fill,
                YAxisLabelLength: 100,
            });
            options.series[1].stroke = this.colors.stroke.default;
            options.series[1].fill = this.colors.fill.default;
            // @ts-ignore
           // options.height = $elm.height(); // 27px for headline
            // @ts-ignore
           // options.width = $elm.width();
          //  this.chartUPlot.nativeElement.innerHTML = '';
            console.log('serviceGraphUPlot-' + this._serviceUuid + '-' + i);
            this.chartUPlot.nativeElement.innerHTML = '';
            let plot= new uPlot(options, data, this.chartUPlot.nativeElement);
          //  this.uPlotChart = new uPlot(options, data, this.chartUPlot.nativeElement);
           // if(document.getElementById('serviceGraphUPlot-' + this._serviceUuid + '-' + i)) {
              //  try{
                //    let elm = document.getElementById('serviceGraphUPlot-' + this._serviceUuid + '-' + i);
                 //   console.log(options);
                  //   let plot = new uPlot(options, data, elm);
              //  }catch(e){
               //     console.error(e);
               // }

            }


           /* let elm = document.getElementById('chartUPlot');
            // @ts-ignore
            elm.innerHTML = '';
            let plot = new uPlot(options, data, elm); */

       // }
    }


    public ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }


}
