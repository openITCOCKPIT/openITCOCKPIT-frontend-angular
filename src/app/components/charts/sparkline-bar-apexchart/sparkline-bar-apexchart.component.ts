import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    ViewChild
} from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexLegend,
    ApexPlotOptions,
    ApexTitleSubtitle,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    ChartComponent
} from 'ng-apexcharts';
import { SparklineBarMetric } from '../charts.interface';


export type SparkChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    markers: any; //ApexMarkers;
    stroke: any; //ApexStroke;
    yaxis: ApexYAxis | ApexYAxis[];
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
    colors: string[];
    labels: string[] | number[];
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
    legend: ApexLegend;
    fill: ApexFill;
    tooltip: ApexTooltip;
};

declare global {
    interface Window {
        Apex: any;
    }
}


@Component({
    selector: 'oitc-sparkline-bar-apexchart',
    imports: [
        ChartComponent
    ],
    templateUrl: './sparkline-bar-apexchart.component.html',
    styleUrl: './sparkline-bar-apexchart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineBarApexchartComponent {

    public dataInput = input<SparklineBarMetric[]>([]);
    public max = input<number | undefined>(undefined);


    // https://apexcharts.com/angular-chart-demos/sparklines/basic/

    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions: Partial<SparkChartOptions> = {
        series: [{
            name: "Autoreport",
            data: []
        }],
        yaxis: {
            min: 0,
            max: this.max()
        },
        chart: {
            type: "bar",
            //width: 100,
            height: 35,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                columnWidth: "80%"
            }
        },
        tooltip: {
            enabled: true,
            hideEmptySeries: false,
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return "";
                    }
                }
            },
            marker: {
                show: false
            }
        },
        colors: ['#FFFFFF']
    };


    private cdr = inject(ChangeDetectorRef);

    constructor() {
        // setting global apex options which are applied on all charts on the page
        window.Apex = {
            stroke: {
                width: 2
            },
            markers: {
                size: 0
            }
        };


        afterRenderEffect(() => {
            if (!this.chart) {
                return;
            }

            const labels = this.dataInput().map((item) => item.name);
            const values = this.dataInput().map((item) => item.value);

            console.log(values);
            console.log(labels);

            this.chart.updateOptions({
                series: [{
                    name: "Autoreport",
                    data: values
                }],
                labels: labels
            });

            this.cdr.markForCheck();
        });
    }

}
