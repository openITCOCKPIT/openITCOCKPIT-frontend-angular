import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';


import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { BarChart } from 'echarts/charts';
import { LegendComponent, PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';

echarts.use([BarChart, LegendComponent, TitleComponent, TooltipComponent, PolarComponent]);


@Component({
    selector: 'oitc-host-pie-chart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './host-pie-chart.component.html',
    styleUrl: './host-pie-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostPieChartComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public statusDataPercentage: number[] = [0, 0, 0];
    @ViewChild('boxContainer') boxContainer?: ElementRef;

    public triggerUpdate = input<number>(0);

    private subscription: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly LayoutService = inject(LayoutService);
    private cdr = inject(ChangeDetectorRef);
    public chartOptions: EChartsOption = {};
    public theme: string = '';
    public echartsInstance: any;
    public widgetHeight: number = 0;

    constructor() {
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(this.LayoutService.theme$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            this.cdr.markForCheck();
        }));

        effect(() => {
            if (this.triggerUpdate() > 0) {
                this.initializeChartOptions();
                // External component has triggered an update

            }
        });
    }

    public ngOnInit(): void {
        this.initializeChartOptions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['statusDataPercentage']) {
            if (!changes['statusDataPercentage'].firstChange) {
                this.statusDataPercentage = [
                    changes['statusDataPercentage'].currentValue[0] || 0, // Up
                    changes['statusDataPercentage'].currentValue[1] || 0, // Down
                    changes['statusDataPercentage'].currentValue[2] || 0, // Unreachable
                ];
            }
            this.initializeChartOptions();
            this.cdr.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeChartOptions() {
        let labels = [
            this.TranslocoService.translate('Unreachable'),
            this.TranslocoService.translate('Down'),
            this.TranslocoService.translate('Up')
        ];

        this.chartOptions = {
            animation: false,
            angleAxis: {
                show: false,
                max: 100,
                startAngle: 180,
                endAngle: 0,
            },
            radiusAxis: {
                show: false,
                type: 'category',
                data: labels
            },
            polar: {
                radius: [70, '65%'],
                center: ['50%', '40%']
            },
            tooltip: {
                show: true,
                formatter: '{b} ({c}%)',
                appendToBody: true
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '70%',
                    data: [
                        {
                            value: this.statusDataPercentage[2],
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
                            value: this.statusDataPercentage[1],
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
                            value: this.statusDataPercentage[0],
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
                        color: {
                            type: 'linear',
                            x: 0.0,
                            y: 0.0,
                            x2: 0.0,
                            y2: 1.0,
                            colorStops: [
                                {
                                    offset: 0.1,
                                    color: '#cccccc19' // color at 0%
                                },
                                {
                                    offset: 0.5,
                                    color: '#cccccc19' // color at 0%
                                },
                                {
                                    offset: 0.5,
                                    color: 'transparent' // color at 100%
                                }
                            ]

                        },
                        borderColor: '#000',
                        borderRadius: [5, 5, 0, 0]
                    },
                    coordinateSystem: 'polar'
                }
            ]
        };
        this.cdr.markForCheck();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        //https://github.com/apache/echarts/issues/20302
        this.widgetHeight = this.echartsInstance.getHeight() / 2;
        this.cdr.markForCheck();
    }
}
