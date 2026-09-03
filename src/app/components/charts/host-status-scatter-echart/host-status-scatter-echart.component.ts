import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    NgZone,
    OnDestroy,
    signal
} from "@angular/core";
import { EChartsOption } from 'echarts';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { StatusBuckets } from '../../../pages/hosts/summary_state.interface';
import { TranslocoService } from '@jsverse/transloco';

echarts.use([LineChart, BarChart, LegendComponent, TitleComponent, TooltipComponent, GridComponent, TooltipComponent]);


@Component({
    selector: "oitc-host-status-scatter-echart",
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: "./host-status-scatter-echart.component.html",
    styleUrl: "./host-status-scatter-echart.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostStatusScatterEchartComponent implements OnDestroy, AfterViewInit {
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private readonly elementRef = inject(ElementRef);
    private readonly ngZone = inject(NgZone);
    public theme: string = '';
    public chartOption: EChartsOption = {};
    private resizeObserver?: ResizeObserver;

    // Current size of the container - drives the responsive layout of the chart
    private readonly containerWidth = signal<number>(0);
    private readonly containerHeight = signal<number>(0);
    private readonly currentTheme = signal<'light' | 'dark'>('light');
    public minChartHeight = input<number | undefined>(40); // in vh

    public statusBuckets = input.required<StatusBuckets>();

    public echartsInstance: any;

    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme;
            this.currentTheme.set(theme);
            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderScatterChart();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.resizeObserver?.disconnect();
    }

    ngAfterViewInit() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme;
            if (this.statusBuckets()) {
                this.renderScatterChart();
            }
        }));

        // Observe the container size so the chart layout (legend, center,
        // ring size, font sizes) can adapt to the available space.
        const host = this.elementRef.nativeElement as HTMLElement;
        this.containerWidth.set(host.clientWidth);
        this.containerHeight.set(host.clientHeight);

        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver((entries) => {
                const width = Math.round(entries[0].contentRect.width);
                const height = Math.round(entries[0].contentRect.height);
                if (width === this.containerWidth() && height === this.containerHeight()) {
                    return;
                }

                const widthChanged = width !== this.containerWidth();

                // Resize immediately so that the chart never keeps the old
                // (larger) size and pushes a horizontal scrollbar.
                this.echartsInstance?.resize();

                // Update the signals inside the zone again so that effect() picks them up
                this.ngZone.run(() => {
                    this.containerWidth.set(width);
                    this.containerHeight.set(height);

                    // Re-render explicitly: the number of columns depends on the width.
                    // Height only changes as a result of the re-render itself.
                    if (widthChanged) {
                        this.renderScatterChart();
                    }
                });
            });
            this.resizeObserver.observe(host);
        });
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.containerWidth.set(Math.round(this.measureAvailableWidth()));
        this.cdr.markForCheck();
    }

    /**
     * Returns the currently available width of the chart in pixels.
     * The live DOM size is preferred because the ECharts instance may still
     * report the previous size while a resize is in progress.
     */
    private measureAvailableWidth(): number {
        const host = this.elementRef.nativeElement as HTMLElement;
        const hostWidth = Math.round(host?.getBoundingClientRect?.().width ?? 0);
        if (hostWidth > 0) {
            return hostWidth;
        }

        return Math.round(this.echartsInstance?.getWidth?.() ?? 0);
    }

    private renderScatterChart() {
        const transformdata: Record<'up' | 'down' | 'unreachable', [string, number, number][]> = {
            up: this.statusBuckets().up.map(item => [item[0], item[1], item[2]]),
            down: this.statusBuckets().down.map(item => [item[0], item[1], item[2]]),
            unreachable: this.statusBuckets().unreachable.map(item => [item[0], item[1], item[2]])
        };


        const allSizes = [
            ...this.statusBuckets().up.map(item => item[2]),
            ...this.statusBuckets().down.map(item => item[2]),
            ...this.statusBuckets().unreachable.map(item => item[2])
        ];

        const minSizeVal = allSizes.length > 0 ? Math.min(...allSizes) : 0;
        const maxSizeVal = allSizes.length > 0 ? Math.max(...allSizes) : 1;

        const getDynamicSymbolSize = (data: [string, number, number, number]) => {
            const sizeValue = data[2];
            const minPixelSize = 8;
            const maxPixelSize = 45;

            if (maxSizeVal === minSizeVal) return (minPixelSize + maxPixelSize) / 2;

            const percent = (Math.sqrt(sizeValue) - Math.sqrt(minSizeVal)) /
                (Math.sqrt(maxSizeVal) - Math.sqrt(minSizeVal));

            return minPixelSize + percent * (maxPixelSize - minPixelSize);
        };

        const alpha = 1;

        const gradientUp = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: `rgba(0,200,81,${alpha})`},
            {offset: 1, color: `rgba(0,163,66,${alpha})`}
        ]);

        const gradientDown = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: `rgba(204,0,0,${alpha})`},
            {offset: 1, color: `rgba(163,0,0,${alpha})`}
        ]);

        const gradientUnreachable = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: `rgba(107,119,133,${alpha})`},
            {offset: 1, color: `rgba(86,97,112,${alpha})`}
        ]);

        let contrastColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-medium-emphasis').trim();
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-bg').trim();


        this.chartOption = {
            title: {
                text: this.TranslocoService.translate('24-Hour Status Events'),
                left: 0,
                top: '3%'
            },
            backgroundColor: 'transparent',
            grid: {
                top: 80,
                bottom: 50,
                left: 20,
                right: 20,
            },
            tooltip: {
                trigger: 'none',
                backgroundColor: backgroundColor,
                padding: [10, 20, 10, 20],
                transitionDuration: 0,
                extraCssText: 'width: 300px; white-space: normal',
                textStyle: {
                    fontSize: 12,
                    color: contrastColor
                },
                formatter: function (params: any): string {
                    const rawData = params.data || params.value;

                    if (!rawData || !rawData[0]) {
                        return `<b>Typ: ${params.seriesName}</b><br/>Keine Daten verfügbar`;
                    }

                    const datumRaw = new Date(rawData[0]);

                    const uhrzeit = datumRaw.toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const datum = datumRaw.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit'
                    });

                    return `<b>Typ: ${params.seriesName}</b><br/>
            Datum: ${datum}<br/>
            Uhrzeit: ${uhrzeit} Uhr<br/>
            Minute der Stunde: ${rawData[1]}`;
                }
            },
            legend: {
                right: '0%',
                top: '3%',
                data: ['up', 'down', 'unreachable'],
            },
            axisPointer: {
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    color: '#fff'
                },
                link: [
                    {
                        xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
                    },
                    {
                        xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
                    },
                    {
                        yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
                    },
                    {
                        yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
                    }
                ]
            },
            xAxis: {
                type: 'time',
                min: new Date().setHours(new Date().getHours() - 24),
                max: new Date(),
                splitLine: {show: true},
                axisLabel: {
                    formatter: '{HH}:{mm}',
                    hideOverlap: true
                }
            },
            yAxis: {
                type: 'value',
                min: this.statusBuckets().min,
                max: this.statusBuckets().max,
                name: this.TranslocoService.translate('Minute'),
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: 'up',
                    type: 'scatter',
                    itemStyle: {color: gradientUp},
                    data: transformdata['up'],
                    symbolSize: getDynamicSymbolSize
                },
                {
                    name: 'down',
                    type: 'scatter',
                    itemStyle: {color: gradientDown},
                    data: transformdata['down'],
                    symbolSize: getDynamicSymbolSize
                },
                {
                    name: 'unreachable',
                    type: 'scatter',
                    itemStyle: {color: gradientUnreachable},
                    data: transformdata['unreachable'],
                    symbolSize: getDynamicSymbolSize
                }
            ]
        };
        this.cdr.markForCheck();

        // The chart height changed with the number of rows - let ECharts pick it up.
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => this.echartsInstance?.resize());
        });
    }
}