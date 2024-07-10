import { Component, inject, Input, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ContainerComponent, PopoverDirective, RowComponent } from '@coreui/angular';
import { TimezoneObject } from "../../pages/services/services-browser-page/timezone.interface";
import { PopoverGraphService } from './popover-graph.service';
import { Subscription } from 'rxjs';
import { PerformanceData } from './popover-graph.interface';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { PopoverConfigBuilder } from './popover-config-builder';
import * as _uPlot from 'uplot';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { debounce } from '../debounce.decorator';
import { ScaleTypes } from './scale-types';

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
        NgIf,
        ContainerComponent,
        OverlayPanelModule
    ],
    templateUrl: './popover-graph.component.html',
    styleUrl: './popover-graph.component.css'
})
export class PopoverGraphComponent implements OnDestroy {
    public visible: boolean = false;
    public _hostUuid: string = '';
    public _serviceUuid: string = '';
    public perfData: PerformanceData[] = [];

    private PopoverGraphService = inject(PopoverGraphService);
    private subscriptions: Subscription = new Subscription();

    public readonly chartHeight: number = 260;

    private perfParams: PerfParams = {
        angular: true,
        host_uuid: this._hostUuid,
        service_uuid: this._serviceUuid,
        start: 0,
        end: 0,
        jsTimestamp: 0
    };

    private timer: ReturnType<typeof setTimeout> | null = null;
    private startTimestamp: number = new Date().getTime();

    public constructor(private window: Window) {
    }

    get service() {
        return this._serviceUuid;
    }

    @Input()
    set service(serviceUuid: string) {
        this._serviceUuid = serviceUuid;
    }

    get host() {
        return this._hostUuid;
    }

    @Input()
    set host(hostUuid: string) {
        this._hostUuid = hostUuid;
    }

    public _timezone!: TimezoneObject;

    public get timezone() {
        return this._timezone
    }

    @Input()
    public set timezone(timezone: TimezoneObject) {
        this._timezone = timezone;
    }

    public showTooltip() {
        this.visible = true;
        this.setParamsAndLoadPerfdata();
    }

    public hideTooltip() {
        this.visible = false;
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private setParamsAndLoadPerfdata() {
        let serverTime: Date = new Date(this.timezone.server_time_iso);
        let compareTimestamp: number = new Date().getTime();
        let diffFromStartToNow: number = compareTimestamp - this.startTimestamp;

        let graphEnd = Math.floor((serverTime.getTime() + diffFromStartToNow) / 1000);
        let graphStart = graphEnd - (3600 * 4);
        this.perfParams.host_uuid = this._hostUuid;
        this.perfParams.service_uuid = this._serviceUuid;
        this.perfParams.start = graphStart;
        this.perfParams.end = graphEnd;

        this.loadPerfData();
    }

    private loadPerfData() {
        this.subscriptions.add(this.PopoverGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                if (perfdata.performance_data && perfdata.performance_data.length > 4) {
                    this.perfData = perfdata.performance_data.slice(0, 4);
                } else {
                    this.perfData = perfdata.performance_data ?? [];
                }

                setTimeout(() => {
                    this.renderGraphs();
                }, 150);
            })
        );
    }

    @debounce(300)
    private renderGraphs() {
        for (let i = 0; i < this.perfData.length; i++) {
            //Only render 4 gauges in popover...
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

            let elm = <HTMLElement>document.getElementById('serviceGraphUPlot-' + this.service + '-' + i);
            if (!elm) {
                console.log('Could not find element for graph');
                return;
            }

            let GraphDefaults = new PopoverConfigBuilder();

            const colors = GraphDefaults.getColorByIndex(i);

            // Setup graph defaults
            GraphDefaults.title = "";
            GraphDefaults.lineWidth = 2;
            GraphDefaults.thresholds = {
                show: (this.perfData[i].datasource.setup.scale.type !== ScaleTypes.O),
                warning: parseFloat(<string>this.perfData[i].datasource.warn),
                critical: parseFloat(<string>this.perfData[i].datasource.crit),
            };

            GraphDefaults.timezone = this.timezone.user_timezone;


            // X-Axis min / max
            GraphDefaults.start = this.perfParams.start;
            GraphDefaults.end = this.perfParams.end;

            //Fallback if no thresholds exists
            GraphDefaults.strokeColor = colors.stroke;
            GraphDefaults.fillColor = colors.fill;
            GraphDefaults.YAxisLabelLength = 100;

            GraphDefaults.height = this.chartHeight;// - 25;  // 27px for label
            GraphDefaults.width = elm.offsetWidth;
            //GraphDefaults.label = this.perfData[i].datasource.name;
            GraphDefaults.label = false;

            // Get options object for uPlot
            let options = GraphDefaults.getOptions();
            options.unit = this.perfData[i].datasource.unit;
            options.legend.show = false;

            if (document.getElementById('serviceGraphUPlot-' + this._serviceUuid + '-' + i)) {
                console.log(options);
                try {
                    let elm = <HTMLElement>document.getElementById('serviceGraphUPlot-' + this.service + '-' + i);

                    elm.innerHTML = '';
                    let plot = new uPlot(options, data, elm);

                } catch (e) {
                    console.error(e);
                }
            }
        }
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


}
