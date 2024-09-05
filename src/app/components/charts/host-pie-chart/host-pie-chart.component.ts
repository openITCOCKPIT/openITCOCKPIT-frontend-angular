import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
    ApexChart,
    ApexGrid,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ChartComponent,
    NgApexchartsModule
} from 'ng-apexcharts';
import { NgIf } from '@angular/common';

import { TranslocoService } from '@jsverse/transloco';


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive | ApexResponsive[];
};

@Component({
    selector: 'oitc-host-pie-chart',
    standalone: true,
    imports: [
        NgIf,
        NgApexchartsModule
    ],
    templateUrl: './host-pie-chart.component.html',
    styleUrl: './host-pie-chart.component.css'
})
export class HostPieChartComponent implements OnInit, OnChanges {

    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions!: Partial<ChartOptions>;

    @Input() public statusDataPercentage: number[] = [0, 0, 0];

    private readonly TranslocoService = inject(TranslocoService);

    public apexGridOptions: ApexGrid = {
        padding: {
            top: 0,
            bottom: -15
        }

    };

    public ngOnInit() {
        this.initializeChartOptions();

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['statusDataPercentage'] && this.chart) {
            this.chartOptions.series = this.statusDataPercentage;
            this.chart.updateOptions({
                series: this.statusDataPercentage
            });
        }
    }

    private initializeChartOptions() {
        let labels = [
            this.TranslocoService.translate('Up'),
            this.TranslocoService.translate('Down'),
            this.TranslocoService.translate('Unreachable'),
        ];

        this.chartOptions = {
            series: this.statusDataPercentage,
            chart: {
                height: 300,
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
                    startAngle: -90,
                    endAngle: 90,
                    hollow: {
                        margin: 5,
                        size: "50%",
                        background: "transparent",
                        image: undefined
                    },
                    track: {
                        show: true,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: true
                        },
                        value: {
                            show: true
                        }
                    }
                },
            },
            colors: ["#00bc4c", "#bf0000", "#6b737c"],
            labels: labels,
            legend: {
                show: false,
                /*    floating: true,
                    fontSize: "16px",
                    position: "left",
                    offsetX: 60,
                    offsetY: 10,
                    labels: {
                        useSeriesColors: true
                    },
                    formatter: function (seriesName: string, opts: any) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                    },
                    itemMargin: {
                        horizontal: 3
                    }*/
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
