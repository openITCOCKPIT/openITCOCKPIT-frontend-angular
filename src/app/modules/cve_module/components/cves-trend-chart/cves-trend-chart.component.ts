import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ButtonGroupComponent } from '@coreui/angular';
import '../../../../components/charts/echarts-dark-theme';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { CvesService } from '../../pages/cves/cves.service';
import { CveTrendDay } from '../../pages/cves/cves.interface';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

echarts.use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

/**
 * Open CVEs per day of all hosts or of one host. The values are distinct CVEs per host, summed up over the hosts.
 *
 * The counts are nested (KEV within red within action required within open), so their bars overlap instead of
 * being stacked, which would count a CVE several times. New and resolved CVEs are changes, not states: they get
 * their own chart below, new upwards and resolved downwards.
 */
@Component({
    selector: 'oitc-cves-trend-chart',
    imports: [
        NgxEchartsDirective,
        TranslocoDirective,
        FormsModule,
        ButtonGroupComponent,
        BlockLoaderComponent,
        XsButtonDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './cves-trend-chart.component.html',
    styleUrl: './cves-trend-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesTrendChartComponent implements OnDestroy {
    // Values of one host, all hosts if not set
    public hostId = input<number | undefined>(undefined);

    public readonly dayOptions: number[] = [30, 60, 180, 365];
    public days: number = 60;

    public trend?: CveTrendDay[];
    public chartOption: EChartsOption = {};
    public theme: string = '';

    private readonly CvesService = inject(CvesService);
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme === 'dark' ? 'dark' : '';
            this.cdr.markForCheck();
        }));

        effect(() => {
            this.hostId();
            this.load();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public setDays(days: number): void {
        this.days = days;
        this.load();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getTrend(this.days, this.hostId()).subscribe((result) => {
            this.trend = result.trend;
            this.renderChart();
            this.cdr.markForCheck();
        }));
    }

    private renderChart(): void {
        // One place per day of the period: days without values stay empty, so the bars keep their width
        // and gaps in the data (e.g. the cronjob did not run) stay visible
        const valuesByDay = new Map<string, CveTrendDay>((this.trend ?? []).map(day => [day.stat_date, day]));
        const days: string[] = [];
        const date = new Date();
        date.setDate(date.getDate() - (this.days - 1));
        for (let i = 0; i < this.days; i++) {
            days.push(formatDate(date, 'yyyy-MM-dd', 'en-US'));
            date.setDate(date.getDate() + 1);
        }
        const values = (field: keyof CveTrendDay, sign: number = 1): (number | null)[] => {
            return days.map(day => {
                const stats = valuesByDay.get(day);
                return stats ? sign * (stats[field] as number) : null;
            });
        };

        // Bars of the upper chart, all at the same position, the largest value first so it stays in the background
        const state = (name: string, field: keyof CveTrendDay, color: string) => {
            return {
                name: name,
                type: 'bar' as const,
                xAxisIndex: 0,
                yAxisIndex: 0,
                barGap: '-100%',
                barMaxWidth: 40,
                color: color,
                data: values(field)
            };
        };

        this.chartOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                // Resolved CVEs are drawn below zero, the tooltip shows the number. Empty days have no value.
                valueFormatter: (value) => value === null || value === undefined || isNaN(Number(value)) ? '-' : String(Math.abs(Number(value)))
            },
            legend: {
                top: 0
            },
            axisPointer: {
                link: [{xAxisIndex: 'all'}]
            },
            grid: [
                {left: 60, right: 20, top: 40, height: '52%'},
                {left: 60, right: 20, bottom: 30, height: '20%'}
            ],
            xAxis: [
                {type: 'category', gridIndex: 0, data: days, axisLabel: {show: false}},
                {type: 'category', gridIndex: 1, data: days}
            ],
            yAxis: [
                {type: 'value', gridIndex: 0, minInterval: 1},
                {
                    type: 'value',
                    gridIndex: 1,
                    minInterval: 1,
                    axisLabel: {
                        formatter: (value: number) => String(Math.abs(value))
                    }
                }
            ],
            series: [
                // Not 'Open', that key is the verb in other places
                state(this.TranslocoService.translate('Open CVEs'), 'open_count', '#adb5bd'),
                state(this.TranslocoService.translate('Action required'), 'action_count', '#f4a261'),
                state(this.TranslocoService.translate('Red'), 'red_count', '#e5383b'),
                state(this.TranslocoService.translate('CISA KEV'), 'kev_count', '#a4161a'),
                {
                    name: this.TranslocoService.translate('New'),
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    stack: 'changes',
                    barMaxWidth: 40,
                    color: '#3399ff',
                    data: values('new_count')
                },
                {
                    name: this.TranslocoService.translate('Resolved'),
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    stack: 'changes',
                    barMaxWidth: 40,
                    color: '#2eb85c',
                    data: values('resolved_count', -1)
                }
            ]
        };
    }
}
