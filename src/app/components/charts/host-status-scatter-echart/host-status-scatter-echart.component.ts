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
import { SummaryStateHosts } from '../../../pages/hosts/summary_state.interface';

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

    public chartData = input.required<SummaryStateHosts>();

    public echartsInstance: any;

    private readonly LayoutService = inject(LayoutService);

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
            if (this.chartData()) {
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
        const serverData = {
            "UP": [
                ["2026-08-31T10:15:00Z", 15],
                ["2026-08-31T14:42:00Z", 42],
                ["2026-09-01T09:05:00Z", 5]
            ],
            "DOWN": [
                ["2026-08-31T11:05:00Z", 5],
                ["2026-08-31T17:23:00Z", 23],
                ["2026-09-01T02:58:00Z", 58]
            ],
            "UNREACHABLE": [
                ["2026-08-31T12:00:00Z", 0],
                ["2026-08-31T22:30:00Z", 30],
                ["2026-09-01T08:12:00Z", 12]
            ]
        };

        this.chartOption = {
            title: {text: 'Ereignisse der letzten 24 Stunden'},
            backgroundColor: 'transparent',
            grid: {
                top: 60,     // Platz für die Legende oben
                bottom: 10,  // Platz für die Stundenbeschriftung unten
                left: 10,    // Platz für die Minutenbeschriftung links
                right: 10,   // Kleiner Puffer nach rechts
            },
            tooltip: {
                trigger: 'none',
                padding: [10, 20, 10, 20],
                backgroundColor: 'rgba(0,0,0,0.7)',
                transitionDuration: 0,
                extraCssText: 'width: 300px; white-space: normal',
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                // Wir nutzen 'any' für den schnellen TypeScript-Fix aus dem letzten Schritt
                formatter: function (params: any): string {
                    // Falls params.data aus irgendeinem Grund nicht existiert, nutzen wir params.value als Fallback
                    const rawData = params.data || params.value;

                    if (!rawData || !rawData[0]) {
                        return `<b>Typ: ${params.seriesName}</b><br/>Keine Daten verfügbar`;
                    }

                    // rawData[0] ist Ihr Zeitstempel (z.B. "2026-08-31T11:05:00")
                    const datumRaw = new Date(rawData[0]);

                    // Formatiert die Uhrzeit sauber als HH:mm (z.B. 11:05)
                    const uhrzeit = datumRaw.toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const datum = datumRaw.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit'
                    });

                    // rawData[1] ist die Minute der Stunde (z.B. 5)
                    return `<b>Typ: ${params.seriesName}</b><br/>
            Datum: ${datum}<br/>
            Uhrzeit: ${uhrzeit} Uhr<br/>
            Minute der Stunde: ${rawData[1]}`;
                }
            },
            legend: {data: ['UP', 'DOWN', 'UNREACHABLE'], top: 0},
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
                min: '2026-08-31T10:00:00',
                max: '2026-09-01T10:00:00',
                splitLine: {show: true},
                axisLabel: {
                    // Erzwingt die Anzeige der Stunde und Minute (z.B. "14:00")
                    formatter: '{HH}:{mm}',
                    // Sorgt dafür, dass die Labels nicht überlappen
                    hideOverlap: true
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 60,
                interval: 10, // Zeigt Markierungen bei 0, 10, 20... 60
                name: 'Minute',
                axisLabel: {
                    // Zeigt an der Seite nur die Zahl oder optional mit Suffix an
                    formatter: '{value}' // Für "10", "20" etc. Nutzen Sie '{value}m' für "10m"
                }
            },
            series: [
                {
                    name: 'UP',
                    type: 'scatter',
                    symbolSize: 10,
                    itemStyle: {color: '#91cc75'},
                    data: serverData.UP
                },
                {
                    name: 'DOWN',
                    type: 'scatter',
                    symbolSize: 10,
                    itemStyle: {color: '#ee6666'},
                    data: serverData.DOWN
                },
                {
                    name: 'UNREACHABLE',
                    type: 'scatter',
                    symbolSize: 10,
                    itemStyle: {color: '#fac858'},
                    data: serverData.UNREACHABLE
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