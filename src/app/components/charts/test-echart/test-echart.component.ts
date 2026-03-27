import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { PieChartMetric } from '../charts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../layouts/coreui/layout.service';

import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';

echarts.use([LineChart, LegendComponent, TitleComponent, TooltipComponent, DataZoomComponent, GridComponent, ToolboxComponent]);

@Component({
    selector: 'oitc-test-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './test-echart.component.html',
    styleUrl: './test-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestEchartComponent implements OnDestroy {

    public title = input<string>('Host availability');
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);
    public scaleSize = input<number>(20);
    public scale = input<boolean>(true);


    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    public zoomEnabled: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderChart();
            this.cdr.markForCheck();
        });
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.cdr.markForCheck();
    }

    private renderChart() {
        // Testdaten generieren
        const mainSeriesData = this.generateRandomData(100, '2026-03-01T00:00:00Z', 60 * 60 * 1000); // 100 Punkte, stündlich
        const overviewSeriesData = this.generateRandomData(10, '2026-03-01T00:00:00Z', 10 * 60 * 60 * 1000); // 10 Punkte, alle 10 Stunden

        console.error('Graph Series', mainSeriesData);
        console.error('Slider Series', overviewSeriesData);

        this.chartOption = {
            tooltip: {trigger: 'axis'},
            grid: [
                {left: 50, right: 50, height: '60%'}, // main chart
                {left: 50, right: 50, top: '75%', height: '15%', z: 3} //slider
            ],
            xAxis: [
                {type: 'time', gridIndex: 0}, // main chart
                {type: 'time', gridIndex: 1, position: 'bottom'} //slider
            ],
            yAxis: [
                {type: 'value', gridIndex: 0}, // main chart
                {type: 'value', gridIndex: 1, show: false} //slider
            ],
            series: [
                // series for main chart
                {
                    name: 'Detail',
                    type: 'line',
                    data: mainSeriesData,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    showSymbol: false,
                    lineStyle: {width: 2}
                },
                // series for slider 
                {
                    name: 'Übersicht',
                    type: 'line',
                    data: overviewSeriesData,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    lineStyle: {opacity: 0},
                    itemStyle: {color: '#bbb'},
                    showSymbol: false,
                    tooltip: {show: false},
                    silent: true,
                    emphasis: {disabled: true},
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0], // trigger only main chart
                    filterMode: 'none',
                    height: 20,
                    bottom: 10,
                }
            ],
            // data zoom with mouse drag
            toolbox: {
                orient: 'vertical',
                itemSize: 13,
                top: 15,
                right: -6,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        icon: {
                            zoom: 'path://', // hack to remove zoom button
                            back: 'path://', // hack to remove restore button
                        },
                    },
                },
            },
        };
        this.cdr.markForCheck();
    }

    private generateRandomData(count: number, startDate: string, intervalMs: number): [string, number][] {
        const data: [string, number][] = [];
        let time = new Date(startDate).getTime();
        for (let i = 0; i < count; i++) {
            data.push([
                new Date(time).toISOString(),
                Math.round(Math.random() * 100)
            ]);
            time += intervalMs;
        }
        return data;
    }

    /*private getLegend(): any {
        if (!this.showLegend()) {
            return undefined;
        }
        return {
            orient: 'vertical',
            left: 'left'
        };
    }

    private getTitle(): any {
        if (this.title().length === 0) {
            return undefined;
        }
        return {
            text: this.TranslocoService.translate(this.title()),
            //subtext: 'Fake Data',
            left: 'center'
        }
    }*/

    public onChartFinished(event: any) {
        // Disable the animation after the chart is rendered

        // This is a workaround, to enable zooming after the chart is rendered
        // https://github.com/apache/echarts/issues/13397#issuecomment-814864873
        if (!this.zoomEnabled) {
            setTimeout(() => {
                this.zoomEnabled = true;
                this.echartsInstance.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    dataZoomSelectActive: true,
                });
                this.cdr.markForCheck();
            }, 250);
        }
    }

}
