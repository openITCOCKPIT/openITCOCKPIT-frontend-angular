import { Component, inject, Input, OnDestroy, ViewChild } from '@angular/core';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { debounce } from '../debounce.decorator';
import { ChartLoaderComponent } from './chart-loader/chart-loader.component';

const uPlot: any = (_uPlot as any)?.default;

type PerfParams = {
    angular: true,
    disableGlobalLoader: true,
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
        OverlayPanelModule,
        ChartLoaderComponent
    ],
    templateUrl: './popover-graph.component.html',
    styleUrl: './popover-graph.component.css'
})
export class PopoverGraphComponent implements OnDestroy {
    private visible: boolean = false;
    public _hostUuid: string = '';
    public _serviceUuid: string = '';
    public perfData: PerformanceData[] = [];
    public isLoading: boolean = false;

    private PopoverGraphService = inject(PopoverGraphService);
    private subscriptions: Subscription = new Subscription();
    private timeout: any = null;

    public readonly chartHeight: number = 260;

    private perfParams: PerfParams = {
        angular: true,
        disableGlobalLoader: true,
        host_uuid: this._hostUuid,
        service_uuid: this._serviceUuid,
        start: 0,
        end: 0,
        jsTimestamp: 0
    };

    private timer: ReturnType<typeof setTimeout> | null = null;
    private startTimestamp: number = new Date().getTime();

    @ViewChild('graphOverlayPanel') graphOverlayPanel!: OverlayPanel;

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

    public showTooltip(event: MouseEvent) {
        // delay to prevent requests if a user is quickly hovering over multiple icons
        if (this.timeout === null) {
            this.timeout = setTimeout(() => {
                this.visible = true;
                this.graphOverlayPanel.toggle(event); // open popup
                this.setParamsAndLoadPerfdata();
            }, 150);
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
        this.isLoading = true;
        this.subscriptions.add(this.PopoverGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                if (perfdata.performance_data && perfdata.performance_data.length > 4) {
                    this.perfData = perfdata.performance_data.slice(0, 4);
                } else {
                    this.perfData = perfdata.performance_data ?? [];
                }

                setTimeout(() => {
                    this.renderGraphs();
                    this.isLoading = false;

                    // Check position after everything has rendered
                    setTimeout(() => {
                        this.graphOverlayPanel.align();
                    }, 150);


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
            GraphDefaults.setDatasource(this.perfData[i].datasource);

            const colors = GraphDefaults.getColorByIndex(i);

            // Setup graph defaults
            GraphDefaults.title = "";
            GraphDefaults.lineWidth = 2;

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

    public cancelDebounce(event: MouseEvent) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        if (this.visible) {
            // Close popup
            this.graphOverlayPanel.toggle(event);
            this.visible = false;
        }
    }

}
