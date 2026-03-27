import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { Subscription } from 'rxjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { PerformanceData } from '../../popover-graph/popover-graph.interface';

echarts.use([LineChart, ToolboxComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

@Component({
    selector: 'oitc-area-echarts',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './area-echarts.component.html',
    styleUrl: './area-echarts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaEchartsComponent implements OnDestroy {

    public dataInput = input<PerformanceData[]>([]);
    public max = input<number | undefined>(undefined);
    public minChartHeight = input<number | undefined>(15); // in vh

    // Count this up, to trigger a resize / chart update
    public triggerResize = input<number>(0);

    public theme: string = '';
    public chartOption: EChartsCoreOption = {};
    private readonly LayoutService = inject(LayoutService);

    private cdr = inject(ChangeDetectorRef);

    public echartsInstance: any;

    private readonly subscriptions: Subscription = new Subscription();

    public onChartInit(ec: any): void {
        this.echartsInstance = ec;//.setTheme(this.theme);
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderChart(this.dataInput());
            this.cdr.markForCheck();
        });
    }

    private renderChart(perfdata: PerformanceData[]) {
        let data: any[] = [];


        // Data format for eCharts
        // https://stackoverflow.com/a/68461548
        //   for (let isoTimestamp in gauge.data) {
        //       data.push([isoTimestamp, gauge.data[isoTimestamp]]);
        //   }

        let series: any[] = [];
        let gradienStart = [
            'rgba(236, 72, 153, 0.4)', 'rgba(99, 102, 241, 0.4)'
        ];

        let gradienLineColor = [
            'rgba(236, 72, 153, 1)', 'rgba(99, 102, 241, 1)'
        ];

        perfdata.forEach((gauge, index) => {
            data[index] = [];
            for (let isoTimestamp in gauge.data) {
                data[index].push([isoTimestamp, gauge.data[isoTimestamp]]);
            }
            series.push(
                {
                    data: data[index],
                    type: 'line',
                    symbolSize: 1,
                    lineStyle: {
                        width: 2
                    },
                    sampling: 'lttb',
                    //smooth: false,
                    itemStyle: {
                        color: gradienLineColor[index],
                        backgroundColor: 'transparent'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: gradienStart[index]
                            },
                            {
                                offset: 1,
                                color: 'transparent'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    }
                }
            );
        });


        this.chartOption = {
            grid: {
                top: 10,
                left: 0,   // Force align left edge
                right: 0,  // Force align right edge
                bottom: 0,
                containLabel: false // MUST be false to reproduce the truncation issue
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    fontSize: 9
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    fontSize: 9,
                    formatter: (value: any) => {
                        return `${value} ${perfdata[0].datasource.unit}`;
                    }
                }
            },
            series: series
        }
    }
}
