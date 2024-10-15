import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { ColorModeService } from '@coreui/angular';
import { PieChartMetric } from '../charts.interface';

@Component({
    selector: 'oitc-host-pie-echart',
    standalone: true,
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEcharts(),
    ],
    templateUrl: './host-pie-echart.component.html',
    styleUrl: './host-pie-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostPieEchartComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public chartData: PieChartMetric[] = [];

    public theme: null | 'dark' = null;
    public chartOption: EChartsOption = {};
    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly ColorModeService = inject(ColorModeService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        const colorMode$ = toObservable(this.ColorModeService.colorMode);

        this.subscriptions.add(colorMode$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            const osSystemDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
            switch (theme) {
                case 'light':
                    this.theme = null;
                    break;

                case 'dark':
                    this.theme = 'dark';
                    break;

                case 'auto':
                    if (osSystemDarkModeEnabled) {
                        this.theme = 'dark';
                    } else {
                        this.theme = null;
                    }
                    break;
            }

        }));
    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes['chartData']) {

            console.log("renderChart");
            this.renderChart();
        }

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
            title: {
                text: 'Referer of a Website',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: this.chartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        this.cdr.markForCheck();
    }
}
