import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { PieChartMetric } from '../charts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../layouts/coreui/layout.service';

@Component({
    selector: 'oitc-host-pie-echart',
    standalone: true,
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEcharts(),
    ],
    templateUrl: './host-pie-echart.component.html',
    styleUrl: './host-pie-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostPieEchartComponent implements OnDestroy {

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
        this.cdr.markForCheck();
    }

    private renderChart() {
        this.chartOption = {
            title: {
                text: this.TranslocoService.translate('Host availability'),
                //subtext: 'Fake Data',
                left: 'center'
            },
            color: [
                "#00bc4c", "#bf0000", "#6b737c"
            ],
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const html = `<div class="row">
                        <div class="col-12">
                            ${params.marker} ${params.name}
                        </div>
                        </div>`;

                    return html;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    //name: 'Access From',
                    type: 'pie',
                    radius: '70%',
                    data: this.chartData(),
                    emphasis: {
                        scale: true,
                        scaleSize: 20,
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            ]
        };
        this.cdr.markForCheck();
    }
}
