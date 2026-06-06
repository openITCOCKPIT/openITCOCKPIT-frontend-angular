import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    OnDestroy
} from '@angular/core';
import { SparklineBarMetric } from '../charts.interface';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'oitc-sparkline-bar-echarts',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './sparkline-bar-echarts.component.html',
    styleUrl: './sparkline-bar-echarts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineBarEchartsComponent implements OnDestroy {

    public dataInput = input<SparklineBarMetric[]>([]);
    public max = input<number | undefined>(undefined);

    // Count this up, to trigger a resize / chart update
    public triggerResize = input<number>(0);

    public theme: string = '';
    public chartOption: EChartsCoreOption = {};

    private cdr = inject(ChangeDetectorRef);

    public echartsInstance: any;

    private readonly subscriptions: Subscription = new Subscription();

    public onChartInit(ec: any): void {
        this.echartsInstance = ec;
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    constructor() {

        afterRenderEffect(() => {

            //console.log(this.triggerResize());

            const labels = this.dataInput().map((item) => item.name);
            const values = this.dataInput().map((item) => item.value);

            this.renderChart(values, labels);

            this.cdr.markForCheck();
        });
    }

    private renderChart(values: number[], labels: string[]) {

        const items = this.dataInput();

        this.chartOption = {
            height: 35,
            grid: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
            },
            color: ['#FFFFFF'],
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: (params: any) => {
                    const dataIndex = params[0].dataIndex;

                    // Do we have any data?
                    if (items[dataIndex]) {
                        if (items[dataIndex].label) {
                            return `<b>${items[dataIndex].label.value}</b><br><i class="${items[dataIndex].label.icon}"></i> ${items[dataIndex].label.text}`;
                        }
                    }

                    // No custom label or no data
                    return params[0].data || "";
                },
            },
            xAxis: {
                type: 'category',
                data: labels,
                show: false,
            },
            yAxis: {
                type: 'value',
                show: false,
                min: 0,
                max: this.max(),
            },
            series: [
                {
                    data: values,
                    type: 'bar',
                },
            ],
        };
    }

}
