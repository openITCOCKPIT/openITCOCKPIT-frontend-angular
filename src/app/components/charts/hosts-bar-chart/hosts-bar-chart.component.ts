import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { PieChartMetric } from '../charts.interface';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { HostBarChartData } from '../../../pages/downtimereports/downtimereports.interface';

echarts.use([LineChart, BarChart, LegendComponent, TitleComponent, TooltipComponent, GridComponent]);

@Component({
    selector: 'oitc-hosts-bar-chart',
    imports: [
        NgxEchartsDirective,
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './hosts-bar-chart.component.html',
    styleUrl: './hosts-bar-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsBarChartComponent implements OnDestroy {

    public chartId = input.required<string>();
    public barChartData = input.required<HostBarChartData>();
    public title = input<string>('Host availability');
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
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
        this.chartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            type: 'bar',
            grid: {
                left: 200,
                top: 15,
                right: 15,
                bottom: 40
            },
            series: [
                {
                    type: 'line',
                    name: this.barChartData().datasets['availability'].label,
                    data: this.barChartData().datasets['availability'].data
                },
                {
                    showBackground: true,
                    color: '#00C851',
                    stack: 'true',
                    type: 'bar',
                    name: this.barChartData().datasets[0].label,
                    data: this.barChartData().datasets[0].data
                },
                {
                    showBackground: true,
                    color: '#CC0000',
                    stack: 'true',
                    type: 'bar',
                    name: this.barChartData().datasets[1].label,
                    data: this.barChartData().datasets[1].data
                },
                {
                    showBackground: true,
                    color: '#727b84',
                    stack: 'true',
                    type: 'bar',
                    name: this.barChartData().datasets[2].label,
                    data: this.barChartData().datasets[2].data
                }
            ],
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            xAxis: {
                type: 'category',
                data: this.barChartData().labels,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    margin: 20,
                    rotate: 10,
                    interval: 'auto',
                    formatter: function (value) {
                        if (value.length > 20) {
                            return value.substring(0, 20) + '...'; //truncate
                        } else {
                            return value;
                        }
                    },
                    align: 'center'
                }
            }
        };
        this.cdr.markForCheck();
    }
}
