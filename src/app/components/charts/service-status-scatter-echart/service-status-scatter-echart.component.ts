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
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../permissions/permissions.service';
import { Router } from '@angular/router';
import { CanvasRenderer } from 'echarts/renderers';
import { DateTime } from 'luxon';
import { ServiceStatusBuckets, ServiceStatusDetails } from '../../../pages/services/summary_state.interface';

echarts.use([LineChart, BarChart, LegendComponent, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);


@Component({
    selector: "oitc-service-status-scatter-echart",
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: "./service-status-scatter-echart.component.html",
    styleUrl: "./service-status-scatter-echart.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceStatusScatterEchartComponent implements OnDestroy, AfterViewInit {
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private readonly elementRef = inject(ElementRef);
    private readonly ngZone = inject(NgZone);
    public theme: string = '';
    public chartOption: EChartsOption = {};
    private resizeObserver?: ResizeObserver;
    public chartInitOptions = {
        renderer: 'svg' as const,
        devicePixelRatio: (window as any).devicePixelRatio || 1
    };

    // Current size of the container - drives the responsive layout of the chart
    private readonly containerWidth = signal<number>(0);
    private readonly containerHeight = signal<number>(0);
    private readonly currentTheme = signal<'light' | 'dark'>('light');

    public statusBuckets = input.required<ServiceStatusBuckets>();
    public fromTimestamp = input.required<number>();
    public toTimestamp = input.required<number>();
    public timezone = input.required<string>();

    public echartsInstance: any;

    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PermissionsService = inject(PermissionsService);

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
        if (this.echartsInstance) {
            this.echartsInstance.dispose();
        }
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
        let hideTimeout: ReturnType<typeof setTimeout> | null = null;
        this.echartsInstance.on('mousemove', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            hideTimeout = setTimeout(() => {
                this.echartsInstance.dispatchAction({type: 'hideTip'});
                this.echartsInstance.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: -1
                });
            }, 1000);
        });

        this.echartsInstance.on('globalout', () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            this.echartsInstance.dispatchAction({type: 'hideTip'});
            this.echartsInstance.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: -1});
        });

        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['services', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                this.echartsInstance.on('click', (params: any) => {
                    if (params?.componentType !== 'series' || !params.data) {
                        return;
                    }

                    const detailsArray = params.data.statusDetails;

                    // Only map and navigate if status details are actually available
                    if (Array.isArray(detailsArray) && detailsArray.length > 0) {
                        const serviceIds = detailsArray.map((detail: ServiceStatusDetails) => detail.id || detail);

                        // Fix for the innerHTML Error:
                        // Completely disable the tooltip component in ECharts before triggering the route change!
                        // This ensures ECharts stops tracking mouse events and destroying DOM elements asynchronously,
                        // preventing the "can't access property innerHTML, el is null" exception.
                        this.echartsInstance.setOption({
                            tooltip: {
                                show: false
                            }
                        });

                        this.router.navigate(['services/index'], {
                            queryParams: {id: serviceIds}
                        });

                    } else {
                        this.echartsInstance.dispatchAction({type: 'hideTip'});
                    }
                });
            }
        }));
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
        const transformdata: Record<'ok' | 'warning' | 'critical' | 'unknown', {
            value: [string, number, number],
            statusDetails: any[]
        }[]> = {
            ok: this.statusBuckets().ok.map(item => ({
                value: [DateTime.fromISO(item[0], {zone: this.timezone()}).toISO({includeOffset: true}) ?? item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            })),
            warning: this.statusBuckets().warning.map(item => ({
                value: [DateTime.fromISO(item[0], {zone: this.timezone()}).toISO({includeOffset: true}) ?? item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            })),
            critical: this.statusBuckets().critical.map(item => ({
                value: [DateTime.fromISO(item[0], {zone: this.timezone()}).toISO({includeOffset: true}) ?? item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            })),
            unknown: this.statusBuckets().unknown.map(item => ({
                value: [DateTime.fromISO(item[0], {zone: this.timezone()}).toISO({includeOffset: true}) ?? item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            }))
        };
        const allSizes = [
            ...this.statusBuckets().ok.map(item => item[2]),
            ...this.statusBuckets().warning.map(item => item[2]),
            ...this.statusBuckets().critical.map(item => item[2]),
            ...this.statusBuckets().unknown.map(item => item[2])
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


        const gradientOk = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#00C851'},
            {offset: 1, color: '#00C8517F'}
        ]);

        const gradientWarning = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#ffbb33'},
            {offset: 1, color: '#ffbb337F'}

        ]);

        const gradientCritical = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#CC0000'},
            {offset: 1, color: '#CC00007F'}
        ]);

        const gradientUnknown = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#6b7785'},
            {offset: 1, color: '#6b77857F'}
        ]);

        let contrastColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-medium-emphasis').trim();
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-bg').trim();


        this.chartOption = {
            title: {
                text: this.TranslocoService.translate('24-Hour Status Events'),
                left: 0,
                top: '1%',
                textStyle: {
                    fontSize: 14
                }
            },
            backgroundColor: 'transparent',
            grid: {
                top: 60,
                bottom: 10,
                left: 20,
                right: 20,
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'none'
                },
                showDelay: 0,
                //triggerOn: 'click',
                backgroundColor: backgroundColor,
                padding: [10, 20, 10, 20],
                transitionDuration: 0,
                hideDelay: 0,
                extraCssText: 'width: 280px;white-space: normal;padding:0;',
                textStyle: {
                    fontSize: 12,
                    color: contrastColor
                },
                appendToBody: true,
                confine: true,
                formatter: (params: any) => {
                    const dataArray = params.data;

                    if (!dataArray) return '';

                    const dateObj = DateTime.fromISO(dataArray.value[0]).setZone(this.timezone());

                    const hoursStr = dateObj.toFormat('HH');
                    const eventMinutesStr = dataArray.value[1].toString().padStart(2, '0');

                    const count = dataArray.value[2];

                    const details = dataArray.statusDetails || [];

                    let detailsHtml = '';
                    if (details.length > 0) {
                        detailsHtml = `<div class="col col-12 mt-2 pt-2 border-top bold">`
                            + this.TranslocoService.translate('Affected Services')
                            + `<sub class="text-secondary ps-1">`
                            + this.TranslocoService.translate('limit 10')
                            + `</sub>`
                            + `</div>`;

                        details
                            .sort((a: ServiceStatusDetails, b: ServiceStatusDetails) => b.servicepriority - a.servicepriority)
                            .slice(0, 10)
                            .forEach((detail: ServiceStatusDetails) => {
                                let stateIcon = '🔵';
                                switch (detail.current_state) {
                                    case 0:
                                        stateIcon = '🟢';
                                        break;
                                    case 1:
                                        stateIcon = '🟠';
                                        break;
                                    case 2:
                                        stateIcon = '🔴';
                                        break;
                                    case 3:
                                        stateIcon = '⚪';
                                        break;
                                }

                                let priorityColors: Record<number, string> = {
                                    1: 'ok-soft',
                                    2: 'ok',
                                    3: 'warning',
                                    4: 'critical-soft',
                                    5: 'critical'
                                };

                                detailsHtml += `<div class="col col-1 small text-center">${stateIcon}</div>`
                                    + `<div class="col col-9 text-muted small text-truncate">${detail.name}</div>`
                                    + `<div class="col col-2 small text-end">`
                                    + `<i class="fa-solid fa-fire ${priorityColors[detail.servicepriority] ?? ''}"></i>`
                                    + `</div>`;
                            });
                    }

                    return `<div class="row row p-2 g-0 w-100 box-sizing-border">`
                        + `<div class="col col-12 mb-2 text-end bold ${params.seriesName}">${params.seriesName.toUpperCase()}</div>`
                        + `<div class="col col-8 bold">` + this.TranslocoService.translate('Time') + `:</div>`
                        + `<div class="col col-4 text-end">${hoursStr}:${eventMinutesStr}</div>`
                        + `<div class="col col-8 bold">` + this.TranslocoService.translate('Number of events') + `:</div>`
                        + `<div class="col col-4 text-end">${count}</div>`
                        + detailsHtml
                        + `</div>`;
                }
            },
            legend: {
                right: '0%',
                top: '1%',
                data: ['ok', 'warning', 'critical', 'unknown'],
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
                min: new Date(this.fromTimestamp() * 1000).toISOString(),
                max: new Date(this.toTimestamp() * 1000).toISOString(),
                splitLine: {show: true},
                offset: 15,
                axisLabel: {
                    hideOverlap: true,
                    formatter: (value) => {
                        const dateTime = DateTime.fromMillis(value).setZone(this.timezone());
                        return dateTime.toFormat('HH:mm');
                    }
                },
                axisPointer: {
                    show: true,
                    label: {
                        formatter: (params) => {
                            const timestamp = Number(params.value);
                            const dateTime = DateTime.fromMillis(timestamp).setZone(this.timezone());
                            return dateTime.toFormat('dd.MM.yyyy HH:mm:ss');
                        }
                    }
                }
            },
            yAxis: {
                type: 'value',
                min: this.statusBuckets().min,
                max: this.statusBuckets().max,
                name: this.TranslocoService.translate('Minute'),
                interval: 10,
                minInterval: 1,
                offset: 15,
                axisPointer: {
                    show: true,
                    label: {
                        formatter: (params: any) => Math.round(params.value).toString()
                    }
                },
                axisLabel: {
                    formatter: (value: number) => Math.round(value).toString()
                }
            },
            series: [
                {
                    name: 'ok',
                    type: 'scatter',
                    large: true,
                    largeThreshold: 200,
                    progressive: 3000,
                    progressiveThreshold: 5000,
                    emphasis: {
                        scale: false,
                        disabled: false
                    },
                    itemStyle: {color: gradientOk},
                    data: transformdata['ok'],
                    symbolSize: getDynamicSymbolSize,
                    z: 1
                },
                {
                    name: 'warning',
                    type: 'scatter',
                    large: true,
                    largeThreshold: 200,
                    progressive: 3000,
                    progressiveThreshold: 5000,
                    emphasis: {
                        scale: false,
                        disabled: false
                    },
                    itemStyle: {color: gradientWarning},
                    data: transformdata['warning'],
                    symbolSize: getDynamicSymbolSize,
                    z: 2
                },
                {
                    name: 'critical',
                    type: 'scatter',
                    large: true,
                    largeThreshold: 200,
                    progressive: 3000,
                    progressiveThreshold: 5000,
                    emphasis: {
                        scale: false,
                        disabled: false
                    },
                    itemStyle: {color: gradientCritical},
                    data: transformdata['critical'],
                    symbolSize: getDynamicSymbolSize,
                    z: 4
                },
                {
                    name: 'unknown',
                    type: 'scatter',
                    large: true,
                    largeThreshold: 200,
                    progressive: 3000,
                    progressiveThreshold: 5000,
                    emphasis: {
                        scale: false,
                        disabled: false
                    },
                    itemStyle: {color: gradientUnknown},
                    data: transformdata['unknown'],
                    symbolSize: getDynamicSymbolSize,
                    z: 3
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