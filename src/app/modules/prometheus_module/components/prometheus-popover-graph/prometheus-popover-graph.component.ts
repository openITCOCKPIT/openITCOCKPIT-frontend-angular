import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { PrometheusQueryService } from '../../pages/PrometheusQuery/prometheus-query.service';
import {
    PrometheusPerformanceDataParams,
    PrometheusPerformanceDataRoot
} from '../../pages/PrometheusQuery/prometheus-query.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
import { ChartLoaderComponent } from '../../../../components/popover-graph/chart-loader/chart-loader.component';
import * as _uPlot from 'uplot';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { PerformanceData } from '../../../../components/popover-graph/popover-graph.interface';
import { Subscription } from 'rxjs';
import { TimezoneObject } from '../../../../pages/services/timezone.interface';
import { debounce } from '../../../../components/debounce.decorator';
import { PopoverConfigBuilder } from '../../../../components/popover-graph/popover-config-builder';
import { PopoverGraphService } from '../../../../components/popover-graph/popover-graph.service';

const uPlot: any = (_uPlot as any)?.default;
@Component({
    selector: 'oitc-prometheus-popover-graph',
    standalone: true,
    imports: [
        NgClass,
        ChartLoaderComponent,
        OverlayPanelModule,
        FaIconComponent,
        TranslocoDirective,
        NgIf
    ],
    templateUrl: './prometheus-popover-graph.component.html',
    styleUrl: './prometheus-popover-graph.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusPopoverGraphComponent {
    private visible: boolean = false;
    public _hostUuid: string = '';
    public _serviceUuid: string = '';
    public perfData: PerformanceData[] = [];
    public isLoading: boolean = false;
    public subscriptions: Subscription = new Subscription();

    private PopoverGraphService = inject(PopoverGraphService);
    private timeout: any = null;

    public readonly chartHeight: number = 260;

    private timer: ReturnType<typeof setTimeout> | null = null;
    protected startTimestamp: number = new Date().getTime();

    @ViewChild('graphOverlayPanel') graphOverlayPanel!: OverlayPanel;

    public cdr = inject(ChangeDetectorRef);

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
                this.cdr.markForCheck();
            }, 150);
        }
    }

    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private perfParams: PrometheusPerformanceDataParams = {
        angular: true,
        end: 0,
        host_uuid: '',
        jsTimestamp: 0,
        metric: 'process_cpu_seconds_total',
        promql : '',
        start: 0
    } as PrometheusPerformanceDataParams;

    protected _metric: string = '';

    get metric() {
        return this._metric;
    }

    @Input()
    set metric(metric: string) {
        this._metric = metric;
    }

    protected _promql : string = '';

    get promql() {
        return this._promql;
    }

    @Input()
    set promql(promql: string) {
        this._promql = promql;
    }

    protected setParamsAndLoadPerfdata() {
        let serverTime: Date = new Date(this.timezone.server_time_iso);
        let compareTimestamp: number = new Date().getTime();
        let diffFromStartToNow: number = compareTimestamp - this.startTimestamp;

        let graphEnd = Math.floor((serverTime.getTime() + diffFromStartToNow) / 1000);
        let graphStart = graphEnd - (3600 * 4);
        this.perfParams.host_uuid = this._hostUuid;
        this.perfParams.start = graphStart;
        this.perfParams.end = graphEnd;
        if (this._metric.length > 0) {
            this.perfParams.metric = this._metric;
        } else {
            delete this.perfParams.metric;
        }
        if (this._promql.length > 0) {
            this.perfParams.promql = this._promql;
        } else {
            delete this.perfParams.promql;
        }

        this.loadPerfData();
    }

    protected loadPerfData(): void {
        this.isLoading = true;
        this.subscriptions.add(this.PrometheusQueryService.getPerfdata(this.perfParams)
            .subscribe((perfdata: PrometheusPerformanceDataRoot) => {
                this.cdr.markForCheck();
                if (perfdata.performance_data && perfdata.performance_data.length > 4) {
                    this.perfData = perfdata.performance_data.slice(0, 4);
                } else {
                    this.perfData = perfdata.performance_data ?? [];
                }
                setTimeout(() => {
                    this.renderGraphs();
                    this.isLoading = false;
                    this.cdr.markForCheck();
                    // Check position after everything has rendered
                    setTimeout(() => {
                        this.graphOverlayPanel.align();
                        this.cdr.markForCheck();
                    }, 150);


                }, 150);
            })
        );
    }

    @debounce(300)
    protected renderGraphs() {
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


            this.cdr.markForCheck();

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
        this.cdr.markForCheck();

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
