import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    OnDestroy
} from '@angular/core';
import { AreaChartMetric } from '../charts.interface';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { Subscription } from 'rxjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, ToolboxComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

@Component({
    selector: 'oitc-area-echarts',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './area-echarts.component.html',
    styleUrl: './area-echarts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaEchartsComponent implements OnDestroy {

    public dataInput = input<AreaChartMetric>({});
    public max = input<number | undefined>(undefined);
    public minChartHeight = input<number | undefined>(25); // in vh

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
            let data = Object.entries(this.dataInput());
            this.renderChart(data);

            this.cdr.markForCheck();
        });
    }

    private renderChart(values: any) {
        let base = +new Date(2026, 3, 13);
        let oneDay = 24 * 3600 * 1000;
        let date = [];
        let data = [Math.random() * 300];
        for (let i = 1; i < 100; i++) {
            var now = new Date((base += oneDay));
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }
        this.chartOption = {
            grid: {
                top: 0,
                left: 0,   // Force align left edge
                right: 0,  // Force align right edge
                bottom: 0,
                containLabel: false // MUST be false to reproduce the truncation issue
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    fontSize: 9
                }
                //min: new Date(this.currentTimerange.start * 1000).toISOString(),

            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                axisLabel: {
                    fontSize: 9
                }
            },
            series: [
                {
                    data: data,
                    type: 'line',
                    areaStyle: {}
                }
            ]
        }
    }
}
