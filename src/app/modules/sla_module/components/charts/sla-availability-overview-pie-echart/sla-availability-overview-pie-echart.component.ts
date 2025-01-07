import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { Availability } from '../../../pages/slas/Slas.interface';
import { PieChartMetric } from '../../../../../components/charts/charts.interface';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';

import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';

echarts.use([PieChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent]);

@Component({
    selector: 'oitc-sla-availability-overview-pie-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './sla-availability-overview-pie-echart.component.html',
    styleUrl: './sla-availability-overview-pie-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaAvailabilityOverviewPieEchartComponent implements OnDestroy {

    public availability = input<Availability>({} as Availability);

    public theme: null | 'dark' = null;
    public chartOption: EChartsOption = {};
    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    private availabilityLabel: string = this.TranslocoService.translate('Availability');
    private uptimeLabel: string = this.TranslocoService.translate('Uptime');
    private outageLabel: string = this.TranslocoService.translate('Outage');

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

        const passed = this.availability().status_percent;
        const failed = 100 - passed;
        let data: PieChartMetric[] = [
            {value: Number(failed.toFixed(3)), name: this.outageLabel},
            {value: Number(passed.toFixed(3)), name: this.uptimeLabel}
        ];

        this.chartOption = {
            title: {
                text: this.availabilityLabel + ' ' + passed + ' %',
                left: 'center',
                textStyle: {
                    fontSize: 18,
                    fontStyle: 'normal'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 'center'
            },
            series: [
                {
                    name: this.availabilityLabel,
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    color: ['#CC0000ff', '#00C851'],
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        this.cdr.markForCheck();
    }
}
