import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';
import { Sla } from '../../../pages/slas/slas.interface';

import {
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';

echarts.use([BarChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent, MarkLineComponent]);

@Component({
    selector: 'oitc-sla-hosts-overview-bar-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './sla-hosts-overview-bar-echart.component.html',
    styleUrl: './sla-hosts-overview-bar-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaHostsOverviewBarEchartComponent implements OnDestroy {

    public sla = input<Sla>({} as Sla);

    public theme: null | 'dark' = null;
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    private headlineLabel: string = this.TranslocoService.translate('Top 10 hosts with the lowest availability');
    private availabilityLabel: string = this.TranslocoService.translate('Availability');

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
        this.cdr.markForCheck();
    }

    private renderChart() {

        let percentValues = [];
        let hostNames = [];
        for (let i = 0; i < 10; i++) {
            const hostOverviewTop10 = this.sla()?.hostsOverview?.top10?.[i];
            if (hostOverviewTop10) {
                percentValues.push(hostOverviewTop10.determined_availability);
                hostNames.push(hostOverviewTop10.name);
            } else {
                percentValues.push(null);
                hostNames.push("");
            }
        }

        let markLineData = [
            {
                yAxis: this.sla().minimal_availability,
                name: this.sla().minimal_availability + '%',
                lineStyle: {
                    type: 'solid',
                    color: '#CC0000aa'
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    backgroundColor: '#CC0000',
                    borderRadius: 5,
                    padding: [2, 3],
                    color: '#fff',
                    position: 'insideEnd',
                    fontSize: 10,
                    y: this.sla().minimal_availability >= 95 ? 2 : 0
                }
            }
        ];

        if (this.sla().warning_threshold) {
            markLineData.push({
                yAxis: this.sla().warning_threshold,
                name: this.sla().warning_threshold + '%',
                lineStyle: {
                    type: 'solid',
                    color: '#ce8905cc'
                },
                label: {
                    show: true,
                    formatter: '{b}',
                    backgroundColor: '#E89D10FF',
                    borderRadius: 5,
                    padding: [2, 3],
                    color: '#fff',
                    position: 'insideMiddle',
                    fontSize: 10,
                    y: this.sla().warning_threshold >= 95 ? 2 : 0
                }
            });
        }

        this.chartOption = {
            title: {
                text: this.headlineLabel,
                left: 'center'
            },
            xAxis: {
                type: 'category',
                data: hostNames,
                axisLabel: {
                    fontSize: 10,
                    rotate: 15,
                    formatter: function (value: string) {
                        return value.length > 20 ? value.substr(0, 20) + '...' : value;
                    }
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    fontSize: 9,
                    formatter: function (value: number) {
                        return value + '%';
                    }
                },
            },
            series: [
                {
                    name: this.availabilityLabel,
                    type: 'bar',
                    data: percentValues,
                    itemStyle: {
                        color: (params: any) => {
                            return this.getColor(params.value);
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    },
                    emphasis: {
                        disabled: true
                    },
                    cursor: 'default',
                    markLine: {
                        symbol: 'none',
                        data: markLineData as []
                    }
                }
            ],
            tooltip: {
                trigger: 'none',
                show: false
            },
            legend: {
                data: ['Availability'],
                bottom: 0,
                show: false
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '1%',
                containLabel: true
            }
        };
        this.cdr.markForCheck();
    }

    private getColor(percent: number): string { // percent [0..100]
        if (percent !== null) {
            if (percent < this.sla().minimal_availability) {
                return '#CC0000';
            }

            if (this.sla().warning_threshold) {
                if (percent < this.sla().warning_threshold) {
                    return '#ffbb33';
                }
            }

            return '#00C851';
        }

        return '#000000'; // Default color if percent is null
    }
}
