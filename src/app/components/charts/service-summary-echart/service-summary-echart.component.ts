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
} from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '../../../layouts/coreui/layout.service';

import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import {  SummaryStateServices } from '../../../pages/services/summary_state.interface';
import { Router } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([PieChart, LegendComponent, TitleComponent, TooltipComponent, SVGRenderer]);

@Component({
    selector: 'oitc-service-summary-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './service-summary-echart.component.html',
    styleUrl: './service-summary-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSummaryEchartComponent implements OnDestroy, AfterViewInit {

    public showLegend = input<boolean>(true);
    // Side on which the legend is rendered. 'right' keeps the rings flush left.
    public legendPosition = input<'left' | 'right'>('right');
    public chartData = input.required<SummaryStateServices>();
    public scaleSize = input<number>(20);
    public scale = input<boolean>(true);


    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private readonly elementRef = inject(ElementRef);
    private readonly ngZone = inject(NgZone);

    // Current size of the container - drives the responsive layout of the chart
    private readonly containerWidth = signal<number>(0);
    private readonly containerHeight = signal<number>(0);
    private resizeObserver?: ResizeObserver;

    public echartInitOpts = {
        renderer: 'svg'
    };

    constructor() {
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme;
            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderRadialChart();
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
                this.renderRadialChart();
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
                // Update the signals inside the zone again so that effect() picks them up
                this.ngZone.run(() => {
                    this.containerWidth.set(width);
                    this.containerHeight.set(height);
                });
            });
            this.resizeObserver.observe(host);
        });
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;

        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['services', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                this.echartsInstance.on('click', (params: any) => {
                    if (params?.componentType !== 'series') {
                        return;
                    }

                    const status = params.seriesName || params.name;
                    if (status) {
                        this.navigateByStatus(status);
                    }
                });

                // Legend click events expose the legend item name directly.
                this.echartsInstance.on('legendselectchanged', (params: any) => {
                    const status = params?.name;
                    if (status) {
                        this.navigateByStatus(status);
                    }
                });
            }
        }));

        // Show pointer cursor for clickable chart segments and legend items.
        this.echartsInstance.on('mousemove', (params: any) => {
            const clickable = params?.componentType === 'series' || params?.componentType === 'legend';
            this.echartsInstance.getZr().setCursorStyle(clickable ? 'pointer' : 'default');
        });

        this.echartsInstance.on('globalout', () => {
            this.echartsInstance.getZr().setCursorStyle('default');
        });
        this.cdr.markForCheck();
    }

    private navigateByStatus(status: string): void {
        const ids = this.getServiceIdsForStatus(status);
        if (ids.length === 0) {
            return;
        }

        this.router.navigate(['services/index'], {queryParams: {id: ids}});
    }

    private getServiceIdsForStatus(status: string): number[] {
        const data = this.chartData();
        switch (status) {
            case 'ok':
                return this.collectServiceIds(data.state.serviceIds, [0]);
            case 'warning':
                return this.collectServiceIds(data.state.serviceIds, [1]);
            case 'critical':
                return this.collectServiceIds(data.state.serviceIds, [2]);
            case 'unknown':
                return this.collectServiceIds(data.state.serviceIds, [3]);
            case 'in_downtime':
                return this.collectServiceIds(data.in_downtime.serviceIds, [0, 1, 2, 3]);
            case 'acknowledged':
                return this.collectServiceIds(data.acknowledged.serviceIds, [0, 1, 2, 3]);
            case 'unhandled':
                return this.collectServiceIds(data.not_handled.serviceIds, [1, 2]);
            default:
                return [];
        }
    }

    private collectServiceIds(serviceIds: number[][], buckets: number[]): number[] {
        const uniqueIds = new Set<number>();
        for (const bucket of buckets) {
            for (const id of serviceIds?.[bucket] ?? []) {
                uniqueIds.add(id);
            }
        }

        return Array.from(uniqueIds);
    }

    private renderRadialChart() {
        // Status colors of the application (see assets/coreui/variables.scss):
        // $success #00C851, $danger #CC0000, $secondary #6b7785.
        // The same palette is used by the tag heatmap (oitc-host-heatmap-echart).
        const alpha = 1;

        const gradientOk = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(0,200,81,${alpha})`},
            {offset: 1, color: `rgba(0,163,66,${alpha})`}
        ]);

        const gradientWarning = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(0,200,81,${alpha})`},
            {offset: 1, color: `rgba(0,163,66,${alpha})`}
        ]);

        const gradientCritical = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(204,0,0,${alpha})`},
            {offset: 1, color: `rgba(163,0,0,${alpha})`}
        ]);

        const gradientUnknown = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(107,119,133,${alpha})`},
            {offset: 1, color: `rgba(86,97,112,${alpha})`}
        ]);

        const gradientInDowntime = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(51,122,183,${alpha})`},
            {offset: 1, color: `rgba(41,98,147,${alpha})`}
        ]);

        const gradientAcknowledged = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(119,77,255,${alpha})`},
            {offset: 1, color: `rgba(95,58,214,${alpha})`}
        ]);

        const gradientUnhandled = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(163,0,0,${alpha})`},
            {offset: 1, color: `rgba(122,0,0,${alpha})`}
        ]);

        const unhandledStripeColor = 'rgba(255,255,255,0.32)';
        //const unhandledStripeColor = 'rgba(255, 193, 7, 0.25)'; // alternative: warm style


        let contrastColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-medium-emphasis').trim();
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-bg').trim();
        let textColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-color').trim();

        const values: { [key: string]: number } = {
            ok: this.chartData().state['0'] || 0,
            warning: this.chartData().state['1'] || 0,
            critical: this.chartData().state['2'] || 0,
            unknown: this.chartData().state['3'] || 0,
            in_downtime: (this.chartData().in_downtime['0'] || 0)
                + (this.chartData().in_downtime['1'] || 0)
                + (this.chartData().in_downtime['2'] || 0)
                + (this.chartData().in_downtime['3'] || 0),
            acknowledged: (this.chartData().acknowledged['0'] || 0)
                + (this.chartData().acknowledged['1'] || 0)
                + (this.chartData().acknowledged['2'] || 0)
                + (this.chartData().acknowledged['3'] || 0),
            unhandled: (this.chartData().not_handled['1'] || 0)
                + (this.chartData().not_handled['2'] || 0)
                + (this.chartData().not_handled['3'] || 0)
        };

        const polarLayouts = [
            {radius: ['20%', '29%']}, // Ok      ↑ inner
            {radius: ['31%', '40%']}, // Warning
            {radius: ['42%', '51%']}, // Critical
            {radius: ['53%', '62%']}, // Unknown
            {radius: ['64%', '73%']}, // InDowntime
            {radius: ['75%', '84%']}  // Acknowledged   ↓ outer
        ];


        // ---- Responsive layout ----------------------------------------------------
        // 0 = not measured yet -> fall back to a sensible default
        const width = this.containerWidth() || 600;
        const height = this.containerHeight() || 300;

        const isCompact = width < 700;
        const legendVisible = this.showLegend();
        const legendFontSize = isCompact ? 10 : 12;
        const legendItemSize = isCompact ? 10 : 12;
        const legendItemGap = isCompact ? 8 : 16;
        const axisFontSize = isCompact ? 9 : 11;

        // Estimated width the legend needs next to the rings
        const legendWidth = legendVisible ? (isCompact ? 120 : 155) : 0;
        // Horizontal space that is left for the rings (never less than 60px)
        const available = Math.max(width - legendWidth, 60);
        const legendOnRight = this.legendPosition() === 'right';

        // ECharts resolves polar radius percentages against min(width, height).
        // Scale them down so the rings always fit into the remaining space
        // instead of growing underneath the legend.
        const base = Math.min(width, height);
        const outerRadiusPercent = 0.84; // largest value used in polarLayouts

        // Reserve space for long axis labels (e.g. 5+ digits) so labels stay visible.
        const chartTotal = Math.max(1, this.chartData().total || 10);
        const axisDigits = Math.floor(Math.log10(chartTotal)) + 1;
        const axisLabelWidthPx = Math.ceil(axisDigits * axisFontSize * 0.62) + 10;

        const drawableWidth = Math.max(available - (axisLabelWidthPx * 2), 60);
        const drawableHeight = Math.max(height - (axisLabelWidthPx * 2), 60);
        const fitDiameter = Math.min(drawableWidth, drawableHeight) * 0.92;
        const radiusScale = Math.min(1, Math.max(0.35, fitDiameter / (base * outerRadiusPercent)));

        // Center the rings so they sit flush against the outer edge of the container:
        // legend on the right -> rings hug the left border and vice versa.
        // Actual outer radius of the largest ring in pixels
        const ringRadius = (base / 2) * outerRadiusPercent * radiusScale;
        // Padding for the angle axis labels drawn outside the rings
        const edgePadding = ringRadius + axisLabelWidthPx + 6;
        // Gap between the outer ring and the legend
        const legendGap = 12;

        let centerX = 50;
        let centerXpx = width / 2;
        if (legendVisible) {
            centerXpx = legendOnRight ? edgePadding : width - edgePadding;
            centerX = Math.round((centerXpx / width) * 100);
        }
        const chartCenter: [string, string] = [`${centerX}%`, '50%'];

        // Anchor the legend next to the outer ring instead of the container border.
        // legend on the right -> offset from the left border, otherwise from the right one.
        const legendOffset = legendOnRight
            ? Math.round(centerXpx + edgePadding + legendGap)
            : Math.round((width - centerXpx) + edgePadding + legendGap);

        this.chartOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'none',
                    show: false
                },
                formatter: '{c} ' + this.TranslocoService.translate('Hosts'),
                appendToBody: true,
                confine: true,
                backgroundColor: backgroundColor,
                textStyle: {
                    color: contrastColor
                }
            },
            polar: polarLayouts.map(p => ({
                center: chartCenter,
                radius: p.radius.map(r => `${parseFloat(r) * radiusScale}%`)
            })),
            angleAxis: polarLayouts.map((_, index) => {
                const total = this.chartData().total || 10;
                const stepInterval = total / 8;

                return {
                    polarIndex: index,
                    type: 'value',
                    min: 0,
                    max: total,
                    startAngle: 90,
                    interval: stepInterval,

                    axisLabel: {
                        show: index === 5,
                        formatter: (value: number) => {
                            if (value === 0) return '0';
                            if (value >= total - (stepInterval / 2)) {
                                return '';
                            }

                            return Math.round(value).toString();
                        },
                        margin: 4,
                        textStyle: {
                            color: textColor,
                            fontSize: axisFontSize
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: index === 5,
                        lineStyle: {
                            color: 'transparent'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                };
            }),

            radiusAxis: polarLayouts.map((_, index) => ({
                polarIndex: index,
                type: 'category',
                show: false
            })),
            legend: {
                show: legendVisible,
                orient: 'vertical',
                selectedMode: true,
                left: legendOnRight ? legendOffset : 'auto',
                right: legendOnRight ? 'auto' : legendOffset,
                top: 'center',
                icon: 'rect',
                itemWidth: legendItemSize,
                itemHeight: legendItemSize,
                itemGap: legendItemGap,
                formatter: (name: string) => {
                    const readableLabels: { [key: string]: string } = {
                        'ok': this.TranslocoService.translate('Ok'),
                        'warning': this.TranslocoService.translate('Warning'),
                        'critical': this.TranslocoService.translate('Critical'),
                        'unknown': this.TranslocoService.translate('Unknown'),
                        'in_downtime': this.TranslocoService.translate('In downtime'),
                        'acknowledged': this.TranslocoService.translate('Acknowledged'),
                        'unhandled': this.TranslocoService.translate('Unhandled')
                    };
                    const label = readableLabels[name] || name;
                    const value = values[name] ?? 0;
                    return `${label} (${value})`;
                },
                textStyle: {
                    color: textColor,
                    fontSize: legendFontSize
                }
            },

            series: [
                {
                    name: 'ok',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 5,
                    data: [values['ok']],
                    itemStyle: {color: gradientOk}
                },
                {
                    name: 'warning',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 5,
                    data: [values['warning']],
                    itemStyle: {color: gradientWarning}
                },
                {
                    name: 'critical',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 4,
                    data: [values['critical']],
                    itemStyle: {color: gradientCritical}
                },
                {
                    name: 'unknown',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 3,
                    data: [values['unknown']],
                    itemStyle: {color: gradientUnknown}
                },
                {
                    name: 'in_downtime',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 2,
                    data: [values['in_downtime']],
                    itemStyle: {color: gradientInDowntime}
                },
                {
                    name: 'acknowledged',
                    type: 'bar',
                    coordinateSystem: 'polar',
                    polarIndex: 1,
                    data: [values['acknowledged']],
                    itemStyle: {color: gradientAcknowledged}
                },
                {
                    name: 'unhandled',
                    type: 'bar',
                    itemStyle: {
                        color: gradientUnhandled,
                        decal: {
                            symbol: 'rect',
                            symbolSize: 1,
                            symbolKeepAspect: false,
                            dashArrayX: [4, 8],
                            dashArrayY: [12, 0],
                            rotation: Math.PI / 4,
                            color: unhandledStripeColor,
                            backgroundColor: 'transparent'
                        }
                    },
                    coordinateSystem: 'polar',
                    polarIndex: 0,
                    data: [values['unhandled']],
                }
            ]

        };

        this.cdr.markForCheck();
    }
}