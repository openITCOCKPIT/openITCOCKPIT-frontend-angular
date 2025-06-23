import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges
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
    NgApexchartsModule
} from "ng-apexcharts";
import { UUID } from '../../classes/UUID';
import uPlot from 'uplot';


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
    imports: [
        NgApexchartsModule
    ],
    templateUrl: './sparkline-stats.component.html',
    styleUrl: './sparkline-stats.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineStatsComponent implements OnChanges {
    private readonly uuidObj: UUID = new UUID();


    @Input() public value: number | undefined;
    @Input() public lastUpdate: Date | undefined;
    @Input() public maxValues: number = 35;

    // Generate a unique identifier for the uPlot instance
    public readonly uuid: string = this.uuidObj.v4();

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

                this.renderSparkline();

            }
        } else {
            // No new value was provided, so we push the old value into the chart again to keep all charts the same length
            if (this.value !== null && this.value !== undefined) {
                this.values.push(this.value);
                // Ensure the array doesn't exceed maxValues
                if (this.values.length > this.maxValues) {
                    this.values.shift();
                }

                this.renderSparkline();
            }
        }
    }

    constructor() {
    }


    private renderSparkline() {

        //Only render 4 gauges in popover...
        let xData: number[] = [];
        let yData: number[] = [];
        this.values.forEach((value, index) => {
            xData.push(index);
            yData.push(value);
        });


        let elm = <HTMLElement>document.getElementById('sparklineGraphUPlot-' + this.uuid);
        if (!elm) {
            //console.log('Could not find element for graph');
            return;
        }

        const options: uPlot.Options = {
            width: 150,
            height: 30,
            pxAlign: false,
            cursor: {
                show: true,
                x: true,
                y: false,
                drag: {
                    setScale: false // disable zooming
                }
            },
            select: {
                show: false, // do not show selected area
                over: false,
                height: 0,
                width: 0,
                left: 0,
                top: 0
            },
            legend: {
                show: false,
            },
            scales: {
                x: {
                    time: false,
                },
            },
            axes: [
                {
                    show: false,
                },
                {
                    show: false,
                }
            ],
            series: [
                {},
                {
                    stroke: "rgba(50, 116, 217, 1)",
                    fill: "rgba(50, 116, 217, 0.2)",
                    points: {
                        space: 0,
                        stroke: "rgba(50, 116, 255, 1)",
                    },
                },
            ],
        };

        this.cdr.markForCheck();

        if (document.getElementById('sparklineGraphUPlot-' + this.uuid)) {
            try {
                let elm = <HTMLElement>document.getElementById('sparklineGraphUPlot-' + this.uuid);

                // Cleanup a previous created tooltip
                const oldTooltip = document.getElementById('sparkline-tooltip-' + this.uuid);
                if (oldTooltip) {
                    oldTooltip.remove();
                }

                // Create tooltip element
                let tooltip = document.createElement('div');
                tooltip.id = 'sparkline-tooltip-' + this.uuid;
                tooltip.classList.add('uplot-sparkline-tooltip');
                tooltip.style.position = 'absolute';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.display = 'none';
                document.body.appendChild(tooltip);

                elm.innerHTML = '';
                let plot = new uPlot(options, [xData, yData], elm);

                // Event-Handler for Cursor
                plot.root.addEventListener('mousemove', (e: MouseEvent) => {
                    const rect = plot.root.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const index = plot.posToIdx(x); // get array index of the x position
                    if (index >= 0 && index < yData.length) {
                        tooltip.style.display = 'block';
                        tooltip.style.left = `${e.pageX + 10}px`;
                        tooltip.style.top = `${e.pageY - 20}px`;
                        tooltip.textContent = String(yData[index]);

                    } else {
                        tooltip.style.display = 'none';
                    }
                });

                plot.root.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });

            } catch (e) {
                console.error(e);
            }
        }
    }

}
