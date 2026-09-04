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
import { HostStatusDetails, StatusBuckets } from '../../../pages/hosts/summary_state.interface';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../permissions/permissions.service';
import { Router } from '@angular/router';

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
    private router = inject(Router);
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
        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['hosts', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                this.echartsInstance.on('click', (params: any) => {
                    if (params?.componentType !== 'series' || !params.data) {
                        return;
                    }

                    const detailsArray = params.data.statusDetails;

                    // Only map and navigate if status details are actually available
                    if (Array.isArray(detailsArray) && detailsArray.length > 0) {
                        const hostIds = detailsArray.map((detail: HostStatusDetails) => detail.id || detail);

                        // Fix for the innerHTML Error:
                        // Completely disable the tooltip component in ECharts before triggering the route change!
                        // This ensures ECharts stops tracking mouse events and destroying DOM elements asynchronously,
                        // preventing the "can't access property innerHTML, el is null" exception.
                        this.echartsInstance.setOption({
                            tooltip: {
                                show: false
                            }
                        });

                        this.router.navigate(['hosts/index'], {
                            queryParams: {id: hostIds}
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
        const transformdata: Record<'up' | 'down' | 'unreachable', {
            value: [string, number, number],
            statusDetails: any[]
        }[]> = {
            up: this.statusBuckets().up.map(item => ({
                value: [item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            })),
            down: this.statusBuckets().down.map(item => ({
                value: [item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            })),
            unreachable: this.statusBuckets().unreachable.map(item => ({
                value: [item[0], item[1], item[2]],
                statusDetails: item.statusDetails
            }))
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


        const gradientUp = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: '#00C851'},
            {offset: 1, color: '#00C8517F'}
        ]);

        const gradientDown = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: '#CC0000'},
            {offset: 1, color: '#CC00007F'}
        ]);

        const gradientUnreachable = new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {offset: 0, color: '#6b7785'},
            {offset: 1, color: '#6b77857F'}
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
                trigger: 'item',
                axisPointer: {
                    type: 'none'
                },
                showDelay: 200,
                //triggerOn: 'click',
                backgroundColor: backgroundColor,
                padding: [10, 20, 10, 20],
                transitionDuration: 0,
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

                    const dateObj = new Date(dataArray.value[0]);
                    const hoursStr = dateObj.getHours().toString().padStart(2, '0');
                    const eventMinutesStr = dataArray.value[1].toString().padStart(2, '0');

                    const count = dataArray.value[2];

                    const details = dataArray.statusDetails || [];

                    let detailsHtml = '';
                    if (details.length > 0) {
                        detailsHtml = `<div class="col col-12 mt-2 pt-2 border-top bold">`
                            + this.TranslocoService.translate('Affected Hosts')
                            + `<sub class="text-secondary ps-1">`
                            + this.TranslocoService.translate('limit 10')
                            + `</sub>`
                            + `</div>`;

                        details
                            .sort((a: HostStatusDetails, b: HostStatusDetails) => b.hostpriority - a.hostpriority)
                            .slice(0, 10)
                            .forEach((detail: HostStatusDetails) => {
                                let stateIcon = '🔵';
                                switch (detail.current_state) {
                                    case 0:
                                        stateIcon = '🟢';
                                        break;
                                    case 1:
                                        stateIcon = '🔴';
                                        break;
                                    case 2:
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
                                    + `<i class="fa-solid fa-fire ${priorityColors[detail.hostpriority] ?? ''}"></i>`
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
                interval: 10,
                minInterval: 1,
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
                    name: 'up',
                    type: 'scatter',
                    itemStyle: {color: gradientUp},
                    data: transformdata['up'],
                    symbolSize: getDynamicSymbolSize,
                    z: 1
                },
                {
                    name: 'down',
                    type: 'scatter',
                    itemStyle: {color: gradientDown},
                    data: transformdata['down'],
                    symbolSize: getDynamicSymbolSize,
                    z: 3
                },
                {
                    name: 'unreachable',
                    type: 'scatter',
                    itemStyle: {color: gradientUnreachable},
                    data: transformdata['unreachable'],
                    symbolSize: getDynamicSymbolSize,
                    z: 2
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