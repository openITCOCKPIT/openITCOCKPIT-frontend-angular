import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    model,
    OnDestroy
} from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { PieChartMetric } from '../../../../../components/charts/charts.interface';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';
import { CustomalertStateOverview } from '../../../pages/customalert-rules/customalert-rules.interface';
import { TranslocoService } from '@jsverse/transloco';
import { CustomAlertsState } from '../../../pages/customalerts/customalerts.interface';

@Component({
    selector: 'oitc-customalerts-stacked-bar-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './customalerts-stacked-bar-echart.component.html',
    styleUrl: './customalerts-stacked-bar-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomalertsStackedBarEchartComponent implements OnDestroy {
    public barChartData = input.required<CustomalertStateOverview>();
    public fromDate = input.required<string>();
    public toDate = input.required<string>();
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance!: echarts.ECharts;

    zoomRange = model<{ start: Date; end: Date }>({
        start: new Date(),
        end: new Date()
    });

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

    private renderChart() {
        const alertsNew: [number, number][] = [];
        const alertsInProgress: [number, number][] = [];
        const alertsDone: [number, number][] = [];
        const alertsManuallyClosed: [number, number][] = [];


        for (let timestamp in this.barChartData().data) {
            let item = this.barChartData().data[timestamp];

            const timeNum = Number(timestamp) * 1000;
            alertsNew.push([timeNum, item[CustomAlertsState.New]]);
            alertsInProgress.push([timeNum, item[CustomAlertsState.InProgress]]);
            alertsDone.push([timeNum, item[CustomAlertsState.Done]]);
            alertsManuallyClosed.push([timeNum, item[CustomAlertsState.ManuallyClosed]]);
        }

        this.chartOption = {
            backgroundColor: 'transparent',
            title: {
                text: this.TranslocoService.translate('Daily alert status distribution') + ' [{0} - {1}]'.replace('{0}', this.fromDate).replace('{1}', this.toDate),
                left: 'center',
                subtext: this.TranslocoService.translate('Shows daily alert states and status updates'),

                subtextStyle: {
                    fontSize: 12,
                    fontStyle: 'italic'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'},
                formatter: function (params: any) {
                    if (!params || params.length === 0) {
                        return '';
                    }
                    const timestamp = params[0].value[0];
                    const dateVal = new Date(Number(timestamp));
                    let html = `<strong>${dateVal.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}</strong><br/>`;

                    for (let i = 0; i < params.length; i++) {
                        const seriesName = params[i].seriesName;
                        const value = params[i].value[1];
                        const marker = params[i].marker;

                        if (value !== undefined) {
                            html += `${marker} ${seriesName}: <strong>${value}</strong><br/>`;
                        }
                    }
                    return html;
                }
            },
            legend: {
                data: [
                    this.TranslocoService.translate('New'),
                    this.TranslocoService.translate('In Progress'),
                    this.TranslocoService.translate('Done'),
                    this.TranslocoService.translate('Manually closed')
                ],
                bottom: '0%',
                selectedMode: false,
                itemGap: 20,
                formatter: (name) => {
                    let total = 0;
                    switch (name) {
                        case this.TranslocoService.translate('New'):
                            total = this.barChartData().total[CustomAlertsState.New];
                            break;
                        case this.TranslocoService.translate('In Progress'):
                            total = this.barChartData().total[CustomAlertsState.InProgress];
                            break;
                        case this.TranslocoService.translate('Done'):
                            total = this.barChartData().total[CustomAlertsState.Done];
                            break;
                        case this.TranslocoService.translate('Manually closed'):
                            total = this.barChartData().total[CustomAlertsState.ManuallyClosed];
                            break;
                    }
                    return `${name} | Σ ${total}`;
                }
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '22%'
            },
            xAxis: {
                type: 'time',
                // set tick on 1 day
                interval: 3600 * 1000 * 24, // 86400000 ms
                minInterval: 3600 * 1000 * 24,
                maxInterval: 3600 * 1000 * 24,
                axisLabel: {
                    formatter: '{dd}.{MM}',
                    hideOverlap: true
                },
                boundaryGap: ['0%', '0%'],
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#e5e7ebb2'
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: this.TranslocoService.translate('Status Counts'),
                    position: 'left'
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    bottom: '8%',
                    handleSize: '100%',
                    labelFormatter: function (value: number) {
                        const dateVal = new Date(value);
                        return dateVal.toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        });
                    }
                },
                {
                    type: 'inside',
                    startValue: this.zoomRange().start,
                    endValue: this.zoomRange().end
                }
            ],
            series: [
                {
                    name: this.TranslocoService.translate('New'),
                    type: 'bar',
                    stack: 'Stack',
                    barMaxWidth: 30,
                    color: '#ff6300',
                    data: alertsNew
                },
                {
                    name: this.TranslocoService.translate('In Progress'),
                    type: 'bar',
                    stack: 'Stack',
                    barMaxWidth: 30,
                    color: '#6b7785',
                    data: alertsInProgress
                },
                {
                    name: this.TranslocoService.translate('Done'),
                    type: 'bar',
                    stack: 'Stack',
                    barMaxWidth: 30,
                    color: '#00c851',
                    data: alertsDone
                },
                {
                    name: this.TranslocoService.translate('Manually closed'),
                    type: 'bar',
                    stack: 'Stack',
                    barMaxWidth: 30,
                    color: '#5856d6',
                    data: alertsManuallyClosed
                }
            ]
        };
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        if (this.echartsInstance) {
            this.echartsInstance.dispose();
        }
        this.subscriptions.unsubscribe();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;

        //  Not currently required
        /*
        this.echartsInstance.on('dataZoom', (params: any) => {
            const option: any = this.echartsInstance.getOption();
            const zoomInfo = option.dataZoom[0];
            const startTimestamp = zoomInfo.startValue;
            const endTimestamp = zoomInfo.endValue;

            if (startTimestamp !== undefined && endTimestamp !== undefined) {
                const startDate = new Date(startTimestamp);
                const endDate = new Date(endTimestamp);
            }
        });
         */
        this.cdr.markForCheck();
    }
}
