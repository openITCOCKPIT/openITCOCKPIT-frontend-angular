import {Component, inject, Input, OnDestroy, ViewChild} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ContainerComponent, PopoverDirective, RowComponent} from '@coreui/angular';
import {TimezoneObject} from "../../pages/services/services-browser-page/timezone.interface";
import {PopoverGraphService} from './popover-graph.service';
import {Subscription} from 'rxjs';
import {PopoverGraphInterface, PerformanceData} from './popover-graph.interface';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {PopoverConfigBuilder} from './popover-config-builder';
import * as _uPlot from 'uplot';
import {debounce} from '../debounce.decorator';

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
        ContainerComponent
    ],
    templateUrl: './popover-graph.component.html',
    styleUrl: './popover-graph.component.css'
})
export class PopoverGraphComponent implements OnDestroy {
    public visible: boolean = false;
    private popoverWidth:number = 440;
    private popoverHeight: number = 220;
    public _hostUuid: string = '';
    public _serviceUuid: string = '';
    public uPlotGraphDefaultsObj = new PopoverConfigBuilder();
    public perfData: PerformanceData[] = [];
    public popoverStyle: {} = {};

    protected colors: any;
    private PopoverGraphService = inject(PopoverGraphService);
    private subscriptions: Subscription = new Subscription();
    private perfParams: PerfParams = {
        angular: true,
        host_uuid: this._hostUuid,
        service_uuid: this._serviceUuid,
        start: 0,
        end: 0,
        jsTimestamp: 0
    };
    private timer: ReturnType<typeof setTimeout> | null = null;
    // private resizeObservable$: Observable<Event> = fromEvent(window, 'resize');
    private popoverOffset: any = {};
    private uPlotChart: any;
    private startTimestamp: number = new Date().getTime();

    constructor (private window: Window) {
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

    showTooltip (hoverIcon: HTMLElement) {
        this.visible = true;
        let self = this;
        if (this.timer === null) {
            this.timer = setTimeout(function () {
                let position = hoverIcon.getBoundingClientRect();
                let offset = {
                    relativeTop: hoverIcon.offsetTop,
                    relativeLeft: hoverIcon.offsetLeft,
                    absoluteTop: position.top + 20,
                    absoluteLeft: position.left + 20,
                };
                self.popoverOffset = offset;

                self.setParams();
                self.timer = null;
                self.placePopoverGraph()
            }, 250);
        }

    }

    hideTooltip () {
        this.visible = false;
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
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

    placePopoverGraph () {
        let margin = 25;
        let $popupGraphContainer = <HTMLElement>document.getElementById('serviceGraphContainer-' + this.service);
        let popupGraphContainerHeight = $popupGraphContainer.offsetHeight + 53;
        if (popupGraphContainerHeight < 220) {
            popupGraphContainerHeight = 300;
        }
        if (this.perfData.length > 2) {
            popupGraphContainerHeight = 450;
        }
        this.popoverHeight = popupGraphContainerHeight;

        let absoluteBottomPositionOfPopoverGraphContainer = this.popoverOffset.absoluteTop + margin + popupGraphContainerHeight;
        this.popoverWidth = window.innerWidth - this.popoverOffset.absoluteLeft - 80
        if ((window.innerHeight - this.popoverOffset.absoluteTop) < popupGraphContainerHeight) {
            //There is no space in the window for the popup, we need to place it above the mouse cursor
            let marginTop = window.innerHeight - popupGraphContainerHeight - margin; //this.popoverOffset.relativeTop - popupGraphContainerHeight - margin + 10;
            this.popoverStyle = {
                'top': marginTop + 'px',
                'left': (this.popoverOffset.absoluteLeft + margin) + 'px',
                'width': this.popoverWidth + 'px',//(window.innerWidth - this.popoverOffset.absoluteLeft - 40) + 'px',
                'height': popupGraphContainerHeight + 'px',
                'padding': '6px'
            }
        } else {
            //Default Popup
            this.popoverStyle = {
                'top': parseInt(this.popoverOffset.relativeTop + margin),
                'left': parseInt(this.popoverOffset.absoluteLeft + margin) + 'px',
                'width': this.popoverWidth + 'px',
                'height': this.popoverHeight + 'px',
                'padding': '6px'
            }
        }
    }

    getPerfData () {
        this.subscriptions.add(this.PopoverGraphService.getPerfdata(this.perfParams)
            .subscribe((perfdata) => {
                if (perfdata.performance_data && perfdata.performance_data.length > 4) {
                    this.perfData = perfdata.performance_data.slice(0, 4);
                } else {
                    this.perfData = perfdata.performance_data ?? [];
                }
               // this.placePopoverGraph();
                // @ts-ignore
                setTimeout(this.renderGraphs(),150);
            })
        );
    }

    @debounce(300)
    renderGraphs () {
        for (let i = 0; i < this.perfData.length; i++) {
            //Only render 4 gauges in popover...
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

            let $elm = <HTMLElement>document.getElementById('serviceGraphUPlot-' + this.service + '-' + i);
            let colors = uPlotGraphDefaultsObj.getColorByIndex(i);
            let options = uPlotGraphDefaultsObj.getDefaultOptions({
                unit: this.perfData[i].datasource.unit,
                showLegend: false,
                timezone: this.timezone.user_timezone,
                lineWidth: 2,
                thresholds: {
                    show: true,
                    warning: parseFloat(<string>this.perfData[i].datasource.warn),
                    critical: parseFloat(<string>this.perfData[i].datasource.crit),
                },
                // X-Axis min / max
                start: this.perfParams.start,
                end: this.perfParams.end,
                //Fallback if no thresholds exists
                strokeColor: colors.stroke,
                fillColor: colors.fill,
                YAxisLabelLength: 100,
            });
            options.axes[0].label = this.perfData[i].datasource.name;
            options.height = $elm.offsetHeight -25;//(this.popoverHeight === 300) ? 180:  (this.popoverHeight / 2); // 27px for headline
            options.width = $elm.offsetWidth//(this.perfData.length === 1) ? this.popoverWidth - 2 : (this.popoverWidth / 2) - 2 ;

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
        this.placePopoverGraph();
    }


    public ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }


}
