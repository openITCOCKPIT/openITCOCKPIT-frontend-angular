import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';

import { LegendComponent, PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { PieChartMetric } from '../../../../components/charts/charts.interface';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { KtdGridLayout } from '@katoid/angular-grid-layout';

echarts.use([PieChart, LegendComponent, TitleComponent, TooltipComponent, PolarComponent]);

@Component({
    selector: 'oitc-services-piechart-widget',
    imports: [
        NgxEchartsDirective,
        BlockLoaderComponent,
        AsyncPipe,
        RouterLink,
        FaIconComponent,
        TranslocoDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './services-piechart-widget.component.html',
    styleUrl: './services-piechart-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPiechartWidgetComponent extends BaseWidgetComponent implements OnDestroy {
    public widgetHeight: number = 0;

    public title = input<string>('Services availability');
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);
    public scaleSize = input<number>(20);
    public scale = input<boolean>(true);


    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private readonly LayoutService = inject(LayoutService);

    public statusCounts?: StatuscountResponse;

    public constructor() {
        super();
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

    public override load() {
        this.subscriptions.add(this.WidgetsService.loadStatusCount()
            .subscribe((result) => {
                this.statusCounts = result;
                this.renderChart();
                this.cdr.markForCheck();
            })
        );
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.cdr.markForCheck();
    }

    private renderChart() {
        if (!this.statusCounts) {
            return;
        }
        let labels = [
            this.TranslocoService.translate('Unknown'),
            this.TranslocoService.translate('Critical'),
            this.TranslocoService.translate('Warning'),
            this.TranslocoService.translate('Ok'),
        ];

        this.chartOption = {
            polar: {
                radius: [20, '80%'],
            },
            backgroundColor: 'transparent',
            angleAxis: {
                show: false,
                max: 100,
                startAngle: 270
            },
            radiusAxis: {
                type: 'category',
                show: false,
                data: labels
            },
            tooltip: {
                show: true,
                formatter: '{b} ({c}%)'
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '50%',
                    data: [
                        {
                            value: this.statusCounts.servicestatusCountPercentage[3],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0.5,
                                    y: 0.5,
                                    x2: 1.5,
                                    y2: 1.5,
                                    colorStops: [
                                        {
                                            offset: 0.1,
                                            color: '#6b737c' // color at 0%
                                        },
                                        {
                                            offset: 1,
                                            color: '#4f555a' // color at 100%
                                        }
                                    ],
                                    global: false // default is false
                                }
                            }
                        },
                        {
                            value: this.statusCounts.servicestatusCountPercentage[2],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0.5,
                                    y: 0.5,
                                    x2: 1.5,
                                    y2: 1.5,
                                    colorStops: [
                                        {
                                            offset: 0.1,
                                            color: '#CC0000' // color at 0%
                                        },
                                        {
                                            offset: 1,
                                            color: '#c0022e' // color at 100%
                                        }
                                    ],
                                    global: false // default is false
                                }
                            }
                        },
                        {
                            value: this.statusCounts.servicestatusCountPercentage[1],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0.5,
                                    y: 0.5,
                                    x2: 1.5,
                                    y2: 1.5,
                                    colorStops: [
                                        {
                                            offset: 0.1,
                                            color: '#ffbb33' // color at 0%
                                        },
                                        {
                                            offset: 1,
                                            color: '#ffbb33' // color at 100%
                                        }
                                    ],
                                    global: false // default is false
                                }
                            }
                        },
                        {
                            value: this.statusCounts.servicestatusCountPercentage[0],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0.5,
                                    y: 0.5,
                                    x2: 1.5,
                                    y2: 1.5,
                                    colorStops: [
                                        {
                                            offset: 0.1,
                                            color: '#00bc4c' // color at 0%
                                        },
                                        {
                                            offset: 1,
                                            color: '#039a3f' // color at 100%
                                        }
                                    ],
                                    global: false // default is false
                                },
                                borderWidth: 1
                            }
                        }
                    ],

                    colorBy: 'series',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.1)',
                        borderRadius: [5, 5, 0, 0]
                    },

                    coordinateSystem: 'polar'
                }
            ]
        };
        this.cdr.markForCheck();
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }
}
