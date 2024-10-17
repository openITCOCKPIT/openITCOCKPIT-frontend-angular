import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
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
    ChartComponent,
    NgApexchartsModule
} from "ng-apexcharts";
import { NgIf } from '@angular/common';

export type ChartOptions = {
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
    selector: 'oitc-sparkline-stats',
    standalone: true,
    imports: [
        NgApexchartsModule,
        NgIf
    ],
    templateUrl: './sparkline-stats.component.html',
    styleUrl: './sparkline-stats.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineStatsComponent implements OnChanges {

    @ViewChild("chart") chart!: ChartComponent;

    @Input() public value: number | undefined;
    @Input() public lastUpdate: Date | undefined;
    @Input() public maxValues: number = 35;

    public values: number[] = [];

    private cdr = inject(ChangeDetectorRef);


//    ngOnChanges(changes: SimpleChanges) {
//        // REMOVE ME WHEN APEXCHARTS IS READY FOR ANGULAR !(
//        return;
//    }


    ngOnChanges(changes: SimpleChanges) {
        /* The "value" input is a number that is pushed into the "values" array. The "value" is the last value we want to display
         * in the sparkline. The "values" array is the array of values that we want to display in the sparkline.
         *
         * The "lastUpdate" input is a Date object that is only used to trigger a change event.
         * For example if the last value was 5 and the new value is also 5 no change event will be triggered and the chart will not be updated.
         * As workaround we update lastUpdate with a new Date() object to trigger a change event.
         */

        this.cdr.markForCheck();
        if (changes.hasOwnProperty('value')) {
            const newValue = changes['value'].currentValue;
            if (newValue !== null) {
                this.values.push(newValue);
                // Ensure the array doesn't exceed maxValues
                if (this.values.length > this.maxValues) {
                    this.values.shift();
                }
                this.commonAreaSparlineOptions.series = [
                    {
                        name: "chart-line-sparkline",
                        data: this.values
                    }
                ];
            }
        } else {
            // No new value was provided, so we push the old value into the chart again to keep all charts the same length
            if (this.value !== null && this.value !== undefined) {
                this.values.push(this.value);
                // Ensure the array doesn't exceed maxValues
                if (this.values.length > this.maxValues) {
                    this.values.shift();
                }
                this.commonAreaSparlineOptions.series = [
                    {
                        name: "chart-line-sparkline",
                        data: this.values
                    }
                ];
            }
        }
    }

    public commonAreaSparlineOptions: Partial<ChartOptions> = {
        chart: {
            type: "area",
            height: 36,
            sparkline: {
                enabled: true
            },
            animations: {
                enabled: false
            }
        },
        stroke: {
            curve: "straight"
        },
        fill: {
            opacity: 0.3
        },
        yaxis: {
            min: 0
        },
        tooltip: {
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
        series: [
            {
                name: "chart-line-sparkline",
                data: this.values
            }
        ],
    };

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
    }

}
