import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ApexGrid, ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from '../host-pie-chart/host-pie-chart.component';
import { ChartAbsolutValue } from '../charts.interface';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { ColorModeService } from '@coreui/angular';

@Component({
    selector: 'oitc-service-radialbar-chart',
    standalone: true,
    imports: [
        ChartComponent
    ],
    templateUrl: './service-radialbar-chart.component.html',
    styleUrl: './service-radialbar-chart.component.css'
})
export class ServiceRadialbarChartComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions!: Partial<ChartOptions>;

    @Input() public statusDataPercentage: number[] = [];
    @Input() public statusDataAbsolut: ChartAbsolutValue[] = [];

    private chartData: number[] = [];

    public readonly maxWidth: number = 450;

    private subscription: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ColorModeService = inject(ColorModeService);

    public apexGridOptions: ApexGrid = {
        padding: {
            top: 0,
            right: 0,
            bottom: 40,
            left: 0
        },
    };

    constructor() {
        const colorMode$ = toObservable(this.ColorModeService.colorMode);

        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(colorMode$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            if (this.chart && this.chartOptions) {

                // Read the background color value from the CSS variable and update the chart
                let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();

                //this.chartOptions.plotOptions?.radialBar?.track?.background = cuiSecondaryBg;
                this.chart.updateOptions({
                    plotOptions: {
                        radialBar: {
                            track: {
                                background: cuiSecondaryBg
                            }
                        }
                    }
                });
            }

        }));
    }

    public ngOnInit(): void {
        this.chartData = this.statusDataPercentage;
        this.initializeChartOptions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['statusDataPercentage'] && this.chart) {
            //  Chart data is as percentage - nothing to do

            this.chartData = this.statusDataPercentage;

            this.chartOptions.series = this.chartData;
            this.chart.updateOptions({
                series: this.chartData
            });
        }

        if (changes['statusDataAbsolut'] && this.chart) {
            // Chart data is as absolute values - convert to percentage
            this.chartData = [];
            this.statusDataAbsolut.forEach((item) => {
                this.chartData.push(item.Value / item.Total * 100);
            });

            this.chartOptions.series = this.chartData;
            this.chart.updateOptions({
                series: this.chartData
            });
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeChartOptions() {
        let labels = [
            this.TranslocoService.translate('Ok'),
            this.TranslocoService.translate('Warning'),
            this.TranslocoService.translate('Critical'),
            this.TranslocoService.translate('Unknown'),
        ];

        let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();
        this.chartOptions = {
            series: this.chartData,
            chart: {
                height: 200,
                offsetY: -20,
                type: "radialBar",

                // The sparkline option remove all paddings
                // https://github.com/apexcharts/apexcharts.js/issues/1272#issuecomment-591388290
                sparkline: {
                    enabled: true
                },
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: -180,
                    endAngle: 90,
                    hollow: {
                        margin: 5,
                        size: "30%",
                        background: "transparent",
                        image: undefined,
                    },
                    track: {
                        show: true,
                        background: cuiSecondaryBg,
                        opacity: 0.5,
                        dropShadow: {
                            enabled: false,
                            top: 2,
                            left: 0,
                            color: '#999999',
                            opacity: 0.2,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            show: false
                        }
                    }
                },
            },
            colors: ["#00bc4c", '#efaf2f', "#bf0000", "#6b737c"],
            labels: labels,
            legend: {
                show: true,
                floating: true,
                fontSize: "12px",
                position: "left",
                offsetY: 70,
                offsetX: 180,
                markers: {
                    strokeWidth: 0,
                    fillColors: ['transparent', 'transparent', 'transparent', 'transparent'],
                },
                labels: {
                    useSeriesColors: true
                },
                formatter: function (seriesName, opts) {
                    const value = parseFloat(opts.w.globals.series[opts.seriesIndex]);

                    return `${seriesName}: ${value.toLocaleString(undefined, {maximumFractionDigits: 3})}%`
                },
                itemMargin: {
                    horizontal: 3,
                    vertical: 1
                },
                inverseOrder: true,
                onItemClick: {
                    toggleDataSeries: false
                },

            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }
            ]
        };
    }
}
