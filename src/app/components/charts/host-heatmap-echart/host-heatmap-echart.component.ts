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
import { SummaryStateHostsTag } from '../../../pages/hosts/summary_state.interface';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { TranslocoService } from '@jsverse/transloco';
import * as echarts from 'echarts/core';
import { CustomChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { PermissionsService } from '../../../permissions/permissions.service';
import { Router } from '@angular/router';

echarts.use([CustomChart, ScatterChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

@Component({
    selector: "oitc-host-heatmap-echart",
    imports: [
        NgxEchartsDirective
    ],
    providers: [provideEchartsCore({echarts})],
    templateUrl: "./host-heatmap-echart.component.html",
    styleUrl: "./host-heatmap-echart.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostHeatmapEchartComponent implements OnDestroy, AfterViewInit {
    // Layout constants for the responsive tile grid
    private static readonly MAX_COLUMNS = 8;
    private static readonly ROW_HEIGHT = 72;
    private static readonly LEGEND_HEIGHT = 56;

    // Order of the legend entries - index of the piece maps to a host state.
    // "label" is the translation key, it is translated while rendering.
    private static readonly PIECES: { state: number, label: string }[] = [
        {state: 0, label: 'UP'},
        {state: 1, label: 'DOWN'},
        {state: 2, label: 'UNREACHABLE'}
    ];

    // Status colors of the application (assets/coreui/variables.scss and
    // assets/coreui/_status-colors.scss) - used for the tooltip bullets.
    private static readonly STATUS_COLORS = {
        up: '#00C851',
        down: '#CC0000',
        unreachable: '#6b7785',
        acknowledged: '#A128ff',
        inDowntime: '#568A89',
        unhandled: '#A30000'
    };

    public chartData = input.required<{ [key: string]: SummaryStateHostsTag }>();
    public scaleSize = input<number>(20);
    public scale = input<boolean>(true);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    // Height of the chart in pixels - grows with the number of tile rows
    public chartHeightPx: number = 280;

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PermissionsService = inject(PermissionsService);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private readonly elementRef = inject(ElementRef);
    private readonly ngZone = inject(NgZone);

    // Host ids per tile - the index matches the dataIndex of the custom series
    private tileHostIds: number[][] = [];

    // Current size of the container - drives the responsive layout of the chart
    private readonly containerWidth = signal<number>(0);
    private readonly containerHeight = signal<number>(0);
    private readonly currentTheme = signal<'light' | 'dark'>('light');
    // Legend selection: which states are currently visible
    private readonly selectedStates = signal<{ [state: number]: boolean }>({
        0: true,
        1: true,
        2: true
    });
    private resizeObserver?: ResizeObserver;

    constructor() {
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme;
            this.currentTheme.set(theme);
            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderHeatmap();
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
                this.renderHeatmap();
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
                        this.renderHeatmap();
                    }
                });
            });
            this.resizeObserver.observe(host);
        });
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        // The very first render may have used the fallback width - re-render with
        // the real chart size now that the instance exists.
        this.containerWidth.set(Math.round(this.measureAvailableWidth()));

        // The visual map is only bound to a dummy series (to keep the custom
        // gradients), so the show/hide behaviour is applied manually here.
        this.echartsInstance.on('datarangeselected', (params: any) => {
            const selected = params?.selected ?? {};
            const next = {...this.selectedStates()} as { [state: number]: boolean };

            Object.keys(selected).forEach((key) => {
                const piece = Number.isNaN(Number(key))
                    ? HostHeatmapEchartComponent.PIECES
                        .find(p => this.TranslocoService.translate(p.label) === key)
                    : HostHeatmapEchartComponent.PIECES[Number(key)];

                if (piece) {
                    next[piece.state] = !!selected[key];
                }
            });

            this.ngZone.run(() => {
                this.selectedStates.set(next);
                this.renderHeatmap();
                this.cdr.markForCheck();
            });
        });

        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['hosts', 'index']).subscribe(hasPermission => {
            if (!hasPermission) {
                return;
            }

            this.echartsInstance.on('click', (params: any) => {
                if (params?.componentType !== 'series' || params.seriesIndex !== 0) {
                    return;
                }

                const hostIds = this.tileHostIds[params.dataIndex] ?? [];
                if (hostIds.length === 0) {
                    return;
                }

                this.ngZone.run(() => {
                    this.router.navigate(['/', 'hosts', 'index'], {
                        queryParams: {id: hostIds}
                    });
                });
            });

            // Show a pointer cursor above the clickable tiles
            this.echartsInstance.on('mouseover', (params: any) => {
                if (params?.componentType === 'series' && params.seriesIndex === 0) {
                    this.echartsInstance.getZr().setCursorStyle('pointer');
                }
            });

            this.echartsInstance.on('mouseout', () => {
                this.echartsInstance.getZr().setCursorStyle('default');
            });
        }));
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


    /**
     * Collects all host ids of a summary block (up/down/unreachable) without duplicates.
     */
    private static collectHostIds(hostIds?: number[][]): number[] {
        const uniqueIds = new Set<number>();
        for (const bucket of hostIds ?? []) {
            for (const id of bucket ?? []) {
                uniqueIds.add(id);
            }
        }

        return Array.from(uniqueIds);
    }

    /**
     * Renders the tooltip rows as a small table:
     * colored bullet + label on the left, the value right aligned.
     */
    private static buildTooltipTable(rows: {
        label: string,
        value: number,
        color?: string,
        className: string
    }[]): string {
        const cells = rows.map(row => {
            const bullet = row.color
                ? `<i class="fa-solid fa-square ${row.className}"></i>`
                : '';

            return `<div class="row">`
                + `<div class="col col-8">${bullet}${row.label}</div>`
                + `<div class="col col-4 text-end">${row.value}</div>`
                + `</div>`;
        }).join('');

        return `<div class="w-auto">${cells}</div>`;
    }

    private renderHeatmap() {
        const tagNames: string[] = [];
        const tileSummaries: { total: number, problems: number, unhandled: number }[] = [];
        const tooltipDetails: string[] = [];
        const rawCoordinates: { x: number, y: number, value: number, visible: boolean }[] = [];

        this.tileHostIds = [];

        const selection = this.selectedStates();

        // Resolve the cumulated state per tag. Tiles that are toggled off in the
        // legend keep their position but are rendered greyed out.
        const entries = Object.entries(this.chartData())
            .map(([name, data]) => {
                const state = data.cumulative_state;

                const total = data?.total ?? 0;
                const up = data?.state?.['0'] ?? 0;
                const down = data?.state?.['1'] ?? 0;
                const unreachable = data?.state?.['2'] ?? 0;
                const acknowledged = data?.acknowledged['0'] + data?.acknowledged['1'] + data?.acknowledged['2'];
                const inDowntime = data?.in_downtime['0'] + data?.in_downtime['1'] + data?.in_downtime['2'];
                const notHandled = data?.not_handled['1'] + data?.not_handled['2'];

                const colors = HostHeatmapEchartComponent.STATUS_COLORS;

                return {
                    name,
                    state,
                    visible: selection[state],
                    // All hosts of this tag - used for the click navigation
                    hostIds: HostHeatmapEchartComponent.collectHostIds(data?.state?.hostIds),
                    // Compact overview shown below the tag name
                    summary: {
                        total,
                        problems: down + unreachable,
                        unhandled: notHandled
                    },
                    details: HostHeatmapEchartComponent.buildTooltipTable([
                        {
                            label: this.TranslocoService.translate('Up'),
                            value: up,
                            color: colors.up,
                            className: 'up'
                        },
                        {
                            label: this.TranslocoService.translate('Down'),
                            value: down,
                            color: colors.down,
                            className: 'down'
                        },
                        {
                            label: this.TranslocoService.translate('Unreachable'),
                            value: unreachable,
                            color: colors.unreachable,
                            className: 'unreachable'
                        },
                        {
                            label: this.TranslocoService.translate('Acknowledged'),
                            value: acknowledged,
                            color: colors.acknowledged,
                            className: 'txt-ack'
                        },
                        {
                            label: this.TranslocoService.translate('In downtime'),
                            value: inDowntime,
                            color: colors.inDowntime,
                            className: 'in-downtime'
                        },
                        {
                            label: this.TranslocoService.translate('Unhandled'),
                            value: notHandled,
                            color: colors.unhandled,
                            className: 'unhandled'
                        },
                        {
                            label: this.TranslocoService.translate('Total hosts'),
                            value: total,
                            className: ''
                        }
                    ])
                };
            });

        // ---- Responsive grid ------------------------------------------------------
        // The tiles "wrap" by reducing the number of columns on small containers.
        // Reading the signal keeps this effect subscribed to container size changes.
        const trackedWidth = this.containerWidth();
        const availableWidth = this.measureAvailableWidth() || trackedWidth || 600;
        const minTileWidth = 150;
        const columnsCount = Math.min(
            HostHeatmapEchartComponent.MAX_COLUMNS,
            Math.max(1, entries.length),
            Math.max(1, Math.floor(availableWidth / minTileWidth))
        );

        const rowsCount = Math.max(1, Math.ceil(entries.length / columnsCount));

        // Grow the chart vertically so that the tiles keep a usable height
        this.chartHeightPx = Math.max(
            160,
            (rowsCount * HostHeatmapEchartComponent.ROW_HEIGHT) + HostHeatmapEchartComponent.LEGEND_HEIGHT
        );

        entries.forEach((entry, index) => {
            const x = index % columnsCount;
            const regularY = Math.floor(index / columnsCount);
            const echartsY = (rowsCount - 1) - regularY; // Y-Achse fuer ECharts spiegeln (Top-Left Start)

            tagNames.push(entry.name);
            tileSummaries.push(entry.summary);
            tooltipDetails.push(entry.details);
            this.tileHostIds.push(entry.hostIds);
            rawCoordinates.push({x, y: echartsY, value: entry.state, visible: entry.visible});
        });

        const chartData = rawCoordinates.map(c => [c.x, c.y, c.value, c.visible ? 1 : 0]);
        const xData = Array.from({length: columnsCount}, (_, i) => `S${i + 1}`);
        const yData = Array.from({length: rowsCount}, (_, i) => `Z${i + 1}`);

        // Status colors of the application (see assets/coreui/variables.scss):
        // $success #00C851, $danger #CC0000, $secondary #6b7785.
        // Each tile uses a subtle gradient from the base color to a slightly
        // darker variant of it.
        const isDarkTheme = this.currentTheme() === 'dark';
        const alpha = 1;

        const palette = {
            up: ['0,200,81', '0,163,66'],
            down: ['204,0,0', '163,0,0'],
            unreachable: ['107,119,133', '86,97,112'],
            unknown: ['138,148,161', '107,119,133']
        };

        const gradientUp = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(${palette.up[0]},${alpha})`},
            {offset: 1, color: `rgba(${palette.up[1]},${alpha})`}
        ]);

        const gradientDown = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(${palette.down[0]},${alpha})`},
            {offset: 1, color: `rgba(${palette.down[1]},${alpha})`}
        ]);

        const gradientUnreachable = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(${palette.unreachable[0]},${alpha})`},
            {offset: 1, color: `rgba(${palette.unreachable[1]},${alpha})`}
        ]);

        const gradientUnknown = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: `rgba(${palette.unknown[0]},${alpha})`},
            {offset: 1, color: `rgba(${palette.unknown[1]},${alpha})`}
        ]);

        let contrastColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-medium-emphasis').trim();
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-bg').trim();

        const colorForState = (state: number) => {
            if (state === 0) return gradientUp;
            if (state === 1) return gradientDown;
            if (state === 2) return gradientUnreachable;
            return gradientUnknown;
        };

        // Base color of a legend entry (matches the top of the tile gradient)
        const pieceColors: { [state: number]: string } = {
            0: palette.up[0],
            1: palette.down[0],
            2: palette.unreachable[0]
        };

        // Tiles are always dark and saturated - white labels give the best contrast.
        const tileLabelColor = '#ffffff';

        // Styling for tiles that are toggled off in the legend
        const mutedTileColor = isDarkTheme ? 'rgba(148,163,184,0.16)' : 'rgba(100,116,139,0.22)';
        const mutedLabelColor = isDarkTheme ? 'rgba(226,232,240,0.55)' : 'rgba(30,41,59,0.55)';

        // ---- Glass look -----------------------------------------------------------
        // Frosted glass is simulated with a light edge, a soft drop shadow
        // and a glossy highlight on the upper half. The tiles are dark in both
        // themes, so the highlight stays the same.
        const glassBorderColor = 'rgba(255,255,255,0.24)';
        const glassShadowColor = isDarkTheme ? 'rgba(0,0,0,0.45)' : 'rgba(15,23,42,0.22)';
        const glassHighlight = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(255,255,255,0.20)'},
            {offset: 1, color: 'rgba(255,255,255,0)'}
        ]);
        const tileBorderRadius = 10;

        // The summary line uses white text as well, only the opacity differs
        const summaryColor = 'rgba(255,255,255,0.92)';

        // Gap between two tiles in pixels
        const tileGap = 6;
        // Inner padding so the label never touches the tile border
        const labelPadding = 6;


        this.chartOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                borderColor: mutedTileColor,
                backgroundColor: backgroundColor,
                textStyle: {
                    color: contrastColor,
                    fontSize: 12
                },
                appendToBody: true,
                confine: true,
                formatter: (params: any) => {
                    const xIndex = params.data[0];
                    const echartsY = params.data[1];

                    const regularY = (rowsCount - 1) - echartsY;
                    const tagIndex = regularY * columnsCount + xIndex;
                    const tagName = tagNames[tagIndex] || '';
                    const details = tooltipDetails[tagIndex] || '';

                    return `<div class="fw-bold mb-2">${tagName}</div>${details}`;
                },
                extraCssText: 'min-width: 200px; white-space: normal; word-break: break-all;'
            },
            grid: {left: 8, right: 8, top: HostHeatmapEchartComponent.LEGEND_HEIGHT, bottom: 8, containLabel: false},
            xAxis: {type: 'category', data: xData, show: false},
            yAxis: {type: 'category', data: yData, show: false},
            visualMap: {
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                // Legend on top: stays visible even when many tiles are rendered
                top: 4,
                // Rounded, translucent icons to match the glass tiles
                itemSymbol: 'roundRect',
                itemWidth: 14,
                itemHeight: 14,
                itemGap: 12,
                textStyle: {
                    color: contrastColor
                },
                // Bind the visual map to the (empty) legend series only.
                // Otherwise ECharts overrides the custom gradients of the heatmap.
                seriesIndex: 1,
                // Keep the toggled legend entries after a re-render
                selected: HostHeatmapEchartComponent.PIECES.reduce((acc, piece, index) => {
                    acc[index] = selection[piece.state];
                    return acc;
                }, {} as { [index: number]: boolean }),
                pieces: HostHeatmapEchartComponent.PIECES.map(piece => ({
                    value: piece.state,
                    label: this.TranslocoService.translate(piece.label),
                    color: `rgba(${pieceColors[piece.state]},${alpha})`
                }))
            },
            series: [{
                // "custom" instead of "heatmap": heatmap always requires a visualMap
                // which would override the gradients (including their transparency).
                type: 'custom',
                data: chartData,
                renderItem: (params: any, api: any) => {
                    const state = api.value(2);
                    const isVisible = api.value(3) === 1;
                    const center = api.coord([api.value(0), api.value(1)]);
                    const size = api.size([1, 1]);

                    const width = Math.max(size[0] - tileGap, 1);
                    const height = Math.max(size[1] - tileGap, 1);
                    const x = center[0] - width / 2;
                    const y = center[1] - height / 2;

                    const labelWidth = Math.max(width - (labelPadding * 2), 12);
                    const summary = tileSummaries[params.dataIndex] ?? {total: 0, problems: 0, unhandled: 0};

                    return {
                        type: 'group',
                        children: [
                            {
                                // Glass body: translucent fill, light edge, soft shadow
                                type: 'rect',
                                shape: {x, y, width, height, r: tileBorderRadius},
                                style: {
                                    fill: isVisible ? colorForState(state) : mutedTileColor,
                                    stroke: glassBorderColor,
                                    lineWidth: 1,
                                    shadowBlur: 12,
                                    shadowColor: glassShadowColor,
                                    shadowOffsetY: 3,
                                    opacity: isVisible ? 1 : 0.75
                                }
                            },
                            {
                                // Glossy reflection on the upper half of the tile
                                type: 'rect',
                                shape: {
                                    x: x + 1,
                                    y: y + 1,
                                    width: Math.max(width - 2, 1),
                                    height: Math.max((height / 2) - 1, 1),
                                    r: [tileBorderRadius - 1, tileBorderRadius - 1, 0, 0]
                                },
                                style: {fill: glassHighlight},
                                silent: true
                            },
                            {
                                type: 'text',
                                style: {
                                    text: tagNames[params.dataIndex] || '',
                                    x: center[0],
                                    y: center[1] - 13,
                                    textAlign: 'center',
                                    textVerticalAlign: 'middle',
                                    fill: isVisible ? tileLabelColor : mutedLabelColor,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    // Long tag names are cut off with an ellipsis
                                    // (canvas/SVG text, so CSS truncation does not apply)
                                    width: labelWidth,
                                    overflow: 'truncate',
                                    ellipsis: '…'
                                }
                            },
                            {
                                // Small overview: total hosts, problems, unhandled
                                type: 'text',
                                style: {
                                    text: `Σ ${summary.total}   ✖ ${summary.problems}   ⚠ ${summary.unhandled}`,
                                    x: center[0],
                                    y: center[1] + 12,
                                    textAlign: 'center',
                                    textVerticalAlign: 'middle',
                                    fill: isVisible ? summaryColor : mutedLabelColor,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    width: labelWidth,
                                    overflow: 'truncate',
                                    ellipsis: '…'
                                }
                            }
                        ]
                    };
                }
            }, {
                // Dummy series: only used as the target of the visual map legend
                type: 'scatter',
                data: [],
                silent: true
            }]
        };

        this.cdr.markForCheck();

        // The chart height changed with the number of rows - let ECharts pick it up.
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => this.echartsInstance?.resize());
        });
    }
}