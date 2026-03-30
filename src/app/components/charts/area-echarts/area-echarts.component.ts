import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { LineSeriesOption } from 'echarts';
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
    public triggerUpdate = input<number>(0);

    public onChartInit(ec: any): void {
        this.echartsInstance = ec;//.setTheme(this.theme);
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    constructor() {
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            this.theme = theme;
            if (this.dataInput().length > 0) {
                this.renderChart(this.dataInput());
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

        let series: LineSeriesOption[] = [];
        let gradientStart = [
            'rgba(59, 130, 246, 0.4)', 'rgba(245, 158, 11, 0.4)'
        ];

        let gradientLineColor = [
            'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)'
        ];
        let contrastColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-medium-emphasis').trim();

        if (this.theme === 'dark') {
            gradientStart = [
                'rgba(139, 92, 246, 0.4)', 'rgba(16, 185, 129, 0.4)'
            ];
            gradientLineColor = [
                'rgba(139, 92, 246, 1)', 'rgba(16, 185, 129, 1)'
            ];
        }


        perfdata.forEach((gauge, index) => {
            data[index] = [];
            for (let isoTimestamp in gauge.data) {
                data[index].push([isoTimestamp, gauge.data[isoTimestamp]]);
            }
            series.push(
                {
                    data: data[index],
                    type: 'line',
                    name: gauge.datasource.name,
                    symbolSize: 1,
                    lineStyle: {
                        width: 2
                    },
                    sampling: 'lttb',
                    //smooth: false,
                    itemStyle: {
                        color: gradientLineColor[index]
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: gradientStart[index]
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
                },
                formatter: (params: any) => {
                    // params is an array when trigger: 'axis'
                    let result = `${params[0].axisValueLabel}<br/>`; // The header (usually x-axis value)

                    params.forEach((item: any) => {
                        const value = (Math.round(item.value[1] * 100) / 100).toFixed(2);
                        result += `${item.marker} ${item.seriesName}: <b>${value} ${perfdata[0].datasource.unit}</b><br/>`;
                    });

                    return result;
                }
            },

            xAxis: {
                type: 'time',
                splitNumber: 5,
                axisLabel: {
                    fontSize: 9,
                    color: contrastColor
                },
                axisLine: {
                    lineStyle: {
                        color: contrastColor
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    fontSize: 9,
                    color: contrastColor,
                    formatter: (value: any) => {
                        return `${value} ${perfdata[0].datasource.unit}`;
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: contrastColor
                    }
                }
            },
            series: series
        }
    }
}
