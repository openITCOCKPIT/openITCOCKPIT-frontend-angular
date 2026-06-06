import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';

import {
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { SlaDetails } from '../../../widgets/sla-widget.interface';
import { TimezoneObject } from '../../../../../pages/services/timezone.interface';
import { TimezoneService } from '../../../../../services/timezone.service';
import { DateTime } from 'luxon';

echarts.use([BarChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent, MarkLineComponent]);

@Component({
    selector: 'oitc-sla-overview-mini-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './sla-overview-mini-echart.component.html',
    styleUrl: './sla-overview-mini-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaOverviewMiniEchartComponent implements OnDestroy {

    public sla = input<SlaDetails>({} as SlaDetails);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    private availabilityLabel: string = this.TranslocoService.translate('Availability');
    private timezone?: TimezoneObject;
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);


    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }
            this.cdr.markForCheck();
        }));

        effect(() => {

            this.getUserTimezone();
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

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.renderChart();
            this.cdr.markForCheck();
        }));
    }

    private renderChart() {
        if (!this.timezone) {
            return;
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

        let statuslogKeys = Object.keys(this.sla().status_log).map(key => parseInt(key)).sort((a, b) => a - b);
        if (!statuslogKeys[0] && !statuslogKeys[statuslogKeys.length - 1]) {
            return;
        }

        let reformatedStatusLog: Array<[number, number]> = [];
        for (let key of statuslogKeys) {
            reformatedStatusLog.push([key * 1000, this.sla().status_log[key]]);
        }


        this.chartOption = {
            title: {
                show: false
            },
            xAxis: {
                type: 'time',
                min: new Date(statuslogKeys[0] * 1000).toISOString(),
                max: new Date(statuslogKeys[statuslogKeys.length - 1] * 1000).toISOString(),
                axisLabel: {
                    fontSize: 9,
                    hideOverlap: true,
                    formatter: (value) => {
                        if (this.timezone) {
                            const dateTime = DateTime.fromMillis(value).setZone(this.timezone.user_timezone);
                            return dateTime.toFormat('dd.LL.yyyy');
                        }
                        return value.toString();
                    },
                    show: true
                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: true,
                },
                minorSplitLine: {
                    show: false
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
                    data: reformatedStatusLog,
                    itemStyle: {
                        color: (params: any) => {
                            return this.getColor(params.value[1]);
                        }
                    },
                    label: {
                        show: false,
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
                show: true,
                formatter: function (params: any) {
                    let tooltipContent = '';
                    params.forEach((param: { date: any[]; value: any; }) => {
                        const dateTime = DateTime.fromMillis(param.value[0]);
                        tooltipContent += dateTime.toFormat('dd.LL.yyyy yyyy HH:mm:ss') + ' ' + param.value[1] + '%';
                    });
                    return tooltipContent;
                },
                appendToBody: true,
                trigger: 'axis',

                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['Availability'],
                bottom: 0,
                show: false
            },
            grid: {
                top: '10%',
                left: '1%',
                right: '10%',
                bottom: '5%',
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
