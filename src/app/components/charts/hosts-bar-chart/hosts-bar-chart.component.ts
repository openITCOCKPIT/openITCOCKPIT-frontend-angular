import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { PieChartMetric } from '../charts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { GridComponent } from 'echarts/components';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { LineChart, BarChart } from 'echarts/charts';
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

    public chartId = input.required<Number>();
    public barChartData = input.required<HostBarChartData>();
    public title = input<string>('Host availability');
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);

    public theme: null | 'dark' = null;
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = null;
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
        console.warn(this.echartsInstance);
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
            series: [
                {
                    type: 'line',
                    name: this.barChartData().datasets['availability'].label,
                    data: this.barChartData().datasets['availability'].data
                },
                {
                    type: 'bar',
                    name: this.barChartData().datasets[0].label,
                    data: this.barChartData().datasets[0].data
                },
                {
                    type: 'bar',
                    name: this.barChartData().datasets[1].label,
                    data: this.barChartData().datasets[1].data
                },
                {
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
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        };
        console.warn('chartOption', this.chartOption);
        this.cdr.markForCheck();
    }

    private getLegend(): any {
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
    }
}
