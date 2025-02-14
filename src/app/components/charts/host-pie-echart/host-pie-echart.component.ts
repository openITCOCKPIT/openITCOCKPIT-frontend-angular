import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { PieChartMetric } from '../charts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../layouts/coreui/layout.service';

import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';

echarts.use([PieChart, LegendComponent, TitleComponent, TooltipComponent]);

@Component({
    selector: 'oitc-host-pie-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './host-pie-echart.component.html',
    styleUrl: './host-pie-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostPieEchartComponent implements OnDestroy {

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
        this.cdr.markForCheck();
    }

    private renderChart() {
        this.chartOption = {
            title: this.getTitle(),
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
            legend: this.getLegend(),
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
