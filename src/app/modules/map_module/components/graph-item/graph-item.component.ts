import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapgadget } from '../../pages/mapeditors/mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { forkJoin, interval, Subscription } from 'rxjs';
import { GraphItemService } from './graph-item.service';
import { GraphItemParams, GraphItemRoot, PerfdataParams } from './graph-item.interface';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgClass, NgIf } from '@angular/common';
import { EChartsOption, VisualMapComponentOption } from 'echarts';
import { DateTime } from 'luxon';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { PopoverGraphService } from '../../../../components/popover-graph/popover-graph.service';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { HtmlspecialcharsPipe } from '../../../../pipes/htmlspecialchars.pipe';
import { ScaleTypes } from '../../../../components/popover-graph/scale-types';
import * as echarts from 'echarts/core';
import 'echarts/theme/dark.js';
import {
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { PerformanceData } from '../../../../components/popover-graph/popover-graph.interface';
import { AlertComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TimezoneConfiguration, TimezoneService } from '../../../../services/timezone.service';
import { HostForMapItem, ServiceForMapItem, Setup } from '../map-item-base/map-item-base.interface';

echarts.use([LineChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent, VisualMapComponent, MarkLineComponent]);

@Component({
    selector: 'oitc-graph-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgIf, NgxEchartsDirective, AlertComponent, FaIconComponent, NgClass],
    templateUrl: './graph-item.component.html',
    styleUrl: './graph-item.component.css',
    providers: [
        provideEchartsCore({echarts}),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphItemComponent extends MapItemBaseComponent<Mapgadget> implements OnInit, OnDestroy {
    @ViewChild(ResizableDirective) resizableDirective!: ResizableDirective;

    public override item: InputSignal<Mapgadget | undefined> = input<Mapgadget>();
    public refreshInterval = input<number>(0);

    private subscriptions: Subscription = new Subscription();
    private readonly GraphItemService = inject(GraphItemService);
    private readonly TimezoneService = inject(TimezoneService);
    private PopoverGraphService = inject(PopoverGraphService);
    private readonly LayoutService = inject(LayoutService);
    private HtmlspecialcharsPipe = inject(HtmlspecialcharsPipe);
    private statusUpdateInterval: Subscription = new Subscription();

    protected override type = MapItemType.GADGET;

    // default data if no setup is passed whatsoever.
    private defaultSetup: Setup = {
        scale: {
            min: 0,
            max: 100,
            type: "O",
        },
        metric: {
            value: 0,
            unit: 'X',
            name: 'No data available',
        },
        warn: {
            low: null,
            high: null,
        },
        crit: {
            low: null,
            high: null,
        }
    };

    protected init: boolean = true;
    protected width: number = 400;
    protected height: number = 200;
    private responsePerfdata!: PerformanceData[];
    private perfdata!: PerformanceData;
    private intervalStartet: boolean = false; // needed to prevent multiple interval subscriptions
    private host!: HostForMapItem;
    private service!: ServiceForMapItem;
    protected allowView: boolean = false;
    private timezone!: TimezoneConfiguration;
    private serverTimeDateObject!: Date;
    private isLoadingGraph: boolean = false;
    private setup: Setup = this.defaultSetup;
    private graphStart = 0;
    private graphEnd = 0;
    protected hasEnoughData = false;
    public chartOption: EChartsOption = {};
    public theme: null | 'dark' = null;
    protected notEnoughDataString = this.TranslocoService.translate('Not enough data to display chart.');

    // any :(
    public echartsInstance: any;

    constructor(parent: MapCanvasComponent) {
        super(parent);
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = null;
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));
        effect(() => {
            this.onObjectIdChange();
            this.onItemSizeXShowLabel();
            this.onMetricChange();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stop();
    }

    public ngOnInit(): void {

        this.item()!.size_x = parseInt(this.item()!.size_x.toString(), 10);
        this.item()!.size_y = parseInt(this.item()!.size_y.toString(), 10);

        if (this.item()!.size_x > 0) {
            this.width = this.item()!.size_x;
        }
        if (this.item()!.size_y > 0) {
            this.height = this.item()!.size_y;
        }

        this.load();
    }

    private load() {

        const params: GraphItemParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'serviceId': this.item()!.object_id,
            'type': this.item()!.type
        };

        let request = [
            this.GraphItemService.getGraphItem(params),
            this.TimezoneService.getUserTimezone({
                'angular': true,
                'disableGlobalLoader': true
            })
        ];

        this.subscriptions.add(forkJoin(request).subscribe(
            (results) => {
                const graphItem = results[0] as GraphItemRoot;
                const userTimezone = results[1] as { timezone: TimezoneConfiguration };
                this.host = graphItem.host;
                this.service = graphItem.service;
                this.allowView = graphItem.allowView;
                this.timezone = userTimezone.timezone;
                this.serverTimeDateObject = new Date(this.timezone.server_time_iso);

                this.initRefreshTimer();

                this.loadGraph(this.host.uuid, this.service.uuid);
                if (this.resizableDirective) {
                    this.resizableDirective.setLastWidthHeight(this.item()!.size_x, this.item()!.size_y);
                }
                this.cdr.markForCheck();
            }));

    };

    private loadGraph(hostUuid: string, serviceuuid: string) {
        this.graphEnd = parseInt(String(new Date(this.timezone.server_time_iso).getTime() / 1000), 10);
        this.graphStart = (parseInt(String(new Date(this.timezone.server_time_iso).getTime() / 1000), 10) - (1 * 3600));

        this.isLoadingGraph = true;

        const params: PerfdataParams = {
            angular: true,
            disableGlobalLoader: true,
            host_uuid: hostUuid,
            service_uuid: serviceuuid,
            start: this.graphStart,
            end: this.graphEnd,
            jsTimestamp: 0,
            isoTimestamp: 1,
        };

        this.subscriptions.add(this.PopoverGraphService.getPerfdata(params)
            .subscribe((result) => {
                // ECharts needs at least 2 data points to render the chart
                this.hasEnoughData = (Object.keys(result.performance_data[0].data).length >= 2);
                this.isLoadingGraph = false;
                this.responsePerfdata = result.performance_data;

                this.processPerfdata();
                this.renderGraph();
                this.init = false;

                this.cdr.markForCheck();
            }));

    };

    private getThresholds(gauge: PerformanceData): VisualMapComponentOption | false {

        let pieces: any[] = []; // VisualPiece is not public

        switch (gauge.datasource.setup.scale.type) {
            case ScaleTypes.O:
                // We do not have any thresholds
                break;

            case ScaleTypes.W_O:
                // ✅
                pieces.push({
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                // +0.00001 because a bug in echarts that does not render if both values are the same
                // https://github.com/apache/echarts/issues/18948
                // https://echarts.apache.org/examples/en/editor.html?c=line-simple&code=PYBwLglsB2AEC8sDeAoWsCeBBAHhAzgFzIC-ANGrDrgcUrGBiAKbEDkAxgIZjMDmwAE4Y2scpXzNBEZkVgBtSulTpVDJq1hsANhGjM2ZWLv0BlRts30A7hAAmYABbEArGIpr0XQcy7mMlnQkSmKUALoesHY8XJJgxIpqKp52EAC2zND4UFkJbBi-goZaIILAAGYQYGwRIej4wACughyaiZ7KdZ4F3uwATAAMAIwDhl1qpRVVxCMD4-7zyR3oPYL9w0Njy6qTlfGwg3Pb4ttLy6vrQ31b27C707AAtEMuR8sny2cdF1qDQwDMN22932_wGbw6wQ6YRCUNgtXQADcCI0uNoALJcEAJEJfBigVwDSJqaR8Rz7IldEAyVpydodejaXjER4DAB04OGRg4wG0QnYPjsog-HQA9KLYGi0sB8GBYPhGhxWsw7PjYI57MwGI4tQAvKTAYxcABGzG0i1gfH2rI54KGRiZxHZnPtsB5fLWWjAgi4WRA3ky1QdJrN7C0Is89Ctmmddu5vP5WmN2kaBlC0OJqiaYAA8uUAEq-vhWebuxNsADEADZmDWa2wunD0HCYSQANxAA
                pieces.push({
                    gt: (Number(gauge.datasource?.setup.warn.low) + 0.00001), // -3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                break;

            case ScaleTypes.C_W_O:
                // ✅

                pieces.push({
                    lte: gauge.datasource?.setup.crit.low, // -5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.crit.low, // -5
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });
                break;


            case ScaleTypes.O_W:
                // ✅
                pieces.push({
                    lt: gauge.datasource?.setup.warn.high, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                // +0.00001 because a bug in echarts that does not render if both values are the same
                pieces.push({
                    gte: Number(gauge.datasource?.setup.warn.high) + 0.00001, // 3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });
                break;

            case ScaleTypes.O_W_C:
                // ✅
                if (gauge.datasource?.setup.warn.low === gauge.datasource?.setup.crit.low) {
                    // If all values are the zero, this breaks the gradient
                    break;
                }

                pieces.push({
                    lt: gauge.datasource?.setup.warn.low, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.low, // 3
                    lt: gauge.datasource?.setup.crit.low, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.low, // 5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });
                break;

            case ScaleTypes.C_W_O_W_C:
                // ✅
                let green = (Number(gauge.datasource.setup.warn.high) + Number(gauge.datasource.setup.warn.low)) / 2;

                pieces.push({
                    lte: gauge.datasource?.setup.crit.low, // -5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical low')
                });

                pieces.push({
                    lte: gauge.datasource?.setup.warn.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning low')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.low, // -3
                    lt: gauge.datasource?.setup.warn.high, // 3
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.high, // 3
                    lt: gauge.datasource?.setup.crit.high, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning high')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.high, // 5
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical high')
                });

                break;


            case ScaleTypes.O_W_C_W_O:
                // ✅

                pieces.push({
                    lt: gauge.datasource?.setup.warn.low, // -5
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.warn.low, // -5
                    lt: gauge.datasource?.setup.crit.low, // -3
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning low')
                });

                pieces.push({
                    gte: gauge.datasource?.setup.crit.low, // -3
                    lte: gauge.datasource?.setup.crit.high, // 3
                    color: 'rgba(224, 47, 68, 1)',
                    //label: this.TranslocoService.translate('Critical')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.crit.high, // 3
                    lte: gauge.datasource?.setup.warn.high, // 5
                    color: 'rgba(234, 184, 57, 1)',
                    //label: this.TranslocoService.translate('Warning high')
                });

                pieces.push({
                    gt: gauge.datasource?.setup.warn.high, // 5
                    color: 'rgba(86, 166, 75, 1)',
                    //label: this.TranslocoService.translate('Ok')
                });
                break;
        }


        let cssSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();
        // Add some transparency to the background color
        cssSecondaryBg += '66';

        if (pieces.length > 0) {
            let visualMap: VisualMapComponentOption = {
                show: true,
                top: 50,
                right: 10,
                pieces: pieces,
                backgroundColor: cssSecondaryBg,
                outOfRange: {
                    //color: 'rgba(86, 166, 75, 1)'
                    color: 'rgba(204, 204, 204, 0.6)'
                }
            };

            return visualMap;
        }

        return false;
    }

    private getThresholdLines(gauge: PerformanceData): any[] {

        let markLineData: any[] = [];

        switch (gauge.datasource.setup.scale.type) {
            case ScaleTypes.O:
                // We do not have any thresholds
                break;

            case ScaleTypes.W_O:
                // warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.low,
                    name: gauge.datasource?.setup.warn.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;

            case ScaleTypes.C_W_O:
                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.low,
                    name: gauge.datasource?.setup.crit.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.low,
                    name: gauge.datasource?.setup.warn.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;


            case ScaleTypes.O_W:
                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.high,
                    name: gauge.datasource?.setup.warn.high?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;

            case ScaleTypes.O_W_C:
                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.low,
                    name: gauge.datasource?.setup.crit.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.low,
                    name: gauge.datasource?.setup.warn.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;

            case ScaleTypes.C_W_O_W_C:
                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.low,
                    name: gauge.datasource?.setup.crit.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.low,
                    name: gauge.datasource?.setup.warn.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.high,
                    name: gauge.datasource?.setup.warn.high?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.high,
                    name: gauge.datasource?.setup.crit.high?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;


            case ScaleTypes.O_W_C_W_O:
                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.low,
                    name: gauge.datasource?.setup.warn.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.low,
                    name: gauge.datasource?.setup.crit.low?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Critical
                markLineData.push({
                    yAxis: gauge.datasource?.setup.crit.high,
                    name: gauge.datasource?.setup.crit.high?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(224, 47, 68, 1)'
                    },
                    label: {
                        show: false
                    }
                });

                // Warning
                markLineData.push({
                    yAxis: gauge.datasource?.setup.warn.high,
                    name: gauge.datasource?.setup.warn.high?.toString(),
                    lineStyle: {
                        type: 'solid',
                        color: 'rgba(234, 184, 57, 1)'
                    },
                    label: {
                        show: false
                    }
                });
                break;
        }

        return markLineData;

    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
    }

    private renderGraph() {
        let performance_data = this.perfdata,
            setup = performance_data.datasource.setup;
        if (!performance_data || !setup) {
            return;
        }

        let gaugeData = [];
        // Data format for eCharts
        // https://stackoverflow.com/a/68461548
        for (let isoTimestamp in performance_data.data) {
            gaugeData.push([isoTimestamp, performance_data.data[isoTimestamp]]);
        }

        let label = this.service.servicename + ' "' + setup.metric.name + '"';
        if (setup.metric.unit) {
            label = label + ' in ' + setup.metric.unit;
        }

        //label = this.HtmlspecialcharsPipe.transform(label);

        let showTicks = true;
        let left = 80;
        let right = 50;
        let top = 25;
        let bottom = 50;
        if (this.height < 130) {
            showTicks = false;
            left = 50;
            right = 20;
            top = 20;
            bottom = 20;
        }

        const thresholdsLines = this.getThresholdLines(performance_data);

        this.chartOption = {
            chart: {
                height: this.height,
            },
            legend: {
                // label formatter
                show: this.item()!.show_label,
                data: [performance_data.datasource.name],
                position: 'top',
                align: 'left',
                formatter: (name: string) => {
                    return label;
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {

                    // Maybe add a loop if we want to support multiple gauges in one chart
                    const gauge = params[0];
                    const dateTime = DateTime.fromISO(gauge.data[0]).setZone(this.timezone.user_timezone);
                    const value = gauge.data[1];
                    const seriesName = gauge.seriesName;
                    const color = gauge.color;
                    const marker = params[0].marker;

                    const html = `<div class="row">
                        <div class="col-12">
                            ${dateTime.toFormat('dd.MM.yyyy HH:mm:ss')}
                        </div>
                        <div class="col-12">
                            ${marker} ${seriesName} <span class="float-end bold" style="color:${color};">${value} ${setup.metric.unit ? setup.metric.unit : ''}</span>
                        </div>
                        </div>`;

                    return html;
                }

            },
            xAxis: {
                type: 'time',
                min: new Date(this.graphStart * 1000).toISOString(),
                max: new Date(this.graphEnd * 1000).toISOString(),
                axisLabel: {
                    hideOverlap: true,
                    formatter: (value) => {
                        const dateTime = DateTime.fromMillis(value as number).setZone(this.timezone.user_timezone);
                        return dateTime.toFormat('HH:mm:ss');
                    },
                    show: showTicks
                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: showTicks,
                },
                minorSplitLine: {
                    show: false
                }

            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        return `${value} ${setup.metric.unit ? setup.metric.unit : ''}`
                    }
                },
                splitLine: {
                    show: true,
                },
                //name: gauge.datasource.setup.metric.unit,
                minorTick: {
                    show: false
                },
                minorSplitLine: {
                    show: false
                }
            },

            grid: {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            },


            // Workaround to hide the toolbar and to auto select the dataZoom in this.onChartFinished method
            // https://github.com/apache/echarts/issues/13397#issuecomment-814864873
            toolbox: {
                orient: 'vertical',
                itemSize: 13,
                top: 15,
                right: -6,
            },

            dataset: {
                source: gaugeData,
                dimensions: ['timestamp', performance_data.datasource.name],
            },

            // thresholds
            // visualMap: {
            //    show: false,
            //    pieces: [],
            //},

            // https://stackoverflow.com/a/76809216
            // https://echarts.apache.org/examples/en/editor.html?c=line-sections&code=MYewdgzgLgBAJgQygmBeGBtAUDGBvADwC4YAGAGhgE8SBmU0gX0sJIEZKaYAmADiZbEenEtwCsA_ENoieANkmsYAFlncA7IqFjZ9LSTmyxE5lJLqjDZjjMxes5VcEkAnLpf6YbCtTr9TSmwcvjC0HgFCbNwOTrZsMiESnmyqIQrJOiHqJuQ2gYYh_MkWWbGB9mllkW4hjkxYALoA3FhYoJCwEACmAE4All0QADJ90GiYzW3gYwBmfQA2UL1dcAAiSAjdUBDjGJNYMwCuYMBQfeAwwD1dSF0Ayr0Dw6NQABSIyACU-DYzID0wV7zLqwPpgOBdAjjUhNGBgiFQgA88A2ADpgWAAOZQAAWMAAtF5YfDIQBqUnfPA2XDtMYfTYggCScHGAHJ6VsAPqsmCkuHgyEtXA06awDkgu7zPrAFbjemoiBSmWvEkESiq3k8T5C4VzRbLNYbLYQVEAB0OEBxrypwuFfTgJHFUGZuVtuAgIEOPRljqNEqVK2pMEY2qDfRmgI1yLkMAAPrH-QiYAA-Lwx-ORgVQ1PqGAAMjzichMGRKU-lKD7segxG0DNFqtNrduCgVFNXRIrKlYC6rNdzZRyC2zN9Q6ZcH7zdA83-ncx1y6YD7leFCGuCDureBJDwlxAM56nalmJxUHnXUXPMYK5DOtwjBgXXm3R-ze6_RrL3rlutK5bbY7GAuzBXtJzdJ0R0HBlnQnP89wPTtrjgZcBxgNcbk3Kht3weDZyAnpMQAIwQV5xEyNh1ASCj1E-K8b1DW1r3vLBryuG4lgeD9nmgd4NlDLAQFNM4LnQJsnRIPUliQ9Yx22fszigbCmxbSEoE7VYXn6QjDmEsAYBACMAFFgVOfpgD6VsUOFCBDkIpYCDUoCADEEAAay6GAZIQVkbGsFsQH3M5TR3IMoH6TFMV6TsEAIUYrNwGLRgABRAMEpJC5tW3bTsrhACAIB8xjfPkgL5kIkAhGUmBLRAAB3EgwsOLowJmdivUAqr3QQAA3LoAEEIEZABbBBIp3JjhQmvyYAIPrYogDLhSywDWWAW5MX-Kh4pgcrjkQHoqAAcQQYKYBmBBn2aoMAHprpgU1rigM5enxPpMTAf4uiDekSAwVkGCIBg-yA0g2CINgxGB_7uCIegodIWgiGUSHKH-sRAdIeG5HBlGQfUWHMdR0heCR3HWW8DGoaCHGqZhuHUfiUmqfRoGGexiGqfx-mgLYEnkah7hSEp1HuDBjmRbpwmgO4RH-YaYqbCoObRkW_9sqA7qLqa7bEuGBBCKfVXdX-EanqioC8E1-YmofAB1QrJrA3WUrS83OuqsAToanomqDKb-3fJ4SEDz9oBYpogA&lang=ts
            series: [
                {
                    name: performance_data.datasource.name,
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        //color: 'rgb(88,86,214)',
                    },

                    smooth: false,
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.2
                    },
                    encode: {
                        x: 'timestamp',
                        y: performance_data.datasource.name // refer gauge (rta) value
                    },
                    markLine: {
                        symbol: 'none',
                        data: thresholdsLines as []
                    }
                },
            ],
        } as EChartsOption;

        let thresholds = this.getThresholds(performance_data);
        if (thresholds) {
            this.chartOption.visualMap = thresholds;
            this.chartOption.visualMap.show = false;
        } else {
            // Set default line color to primary
            // @ts-ignore
            this.chartOption.series[0].lineStyle.color = 'rgb(88,86,214)';
        }
        this.cdr.markForCheck();


    };

    private processPerfdata() {
        // default data if no setup is passed whatsoever.
        this.setup = this.defaultSetup;

        if (this.responsePerfdata === null) {
            return;
        }
        if (this.item()!.metric === null) {
            //Use the first metric
            this.perfdata = this.responsePerfdata[0];
        } else {
            for (let metricNo in this.responsePerfdata) {
                if (isNaN(this.item()!.metric)) {
                    // Normal gauge from Whisper/Nagios or Prometheus
                    if (this.responsePerfdata[metricNo].datasource.metric === this.item()!.metric) {
                        this.perfdata = this.responsePerfdata[metricNo];
                    }
                } else {
                    // Datasource is numeric - this is a workaround for non-unique Prometheus results like from rate() or sum()
                    if (metricNo == this.item()!.metric) {
                        this.perfdata = this.responsePerfdata[metricNo];
                    }
                }
            }
        }
    };

    private initRefreshTimer() {
        if (this.refreshInterval() > 0 && !this.intervalStartet) {
            this.intervalStartet = true;
            this.statusUpdateInterval = interval(this.refreshInterval()).subscribe(() => {
                this.load();
            });
        }
    };

    private stop() {
        if (this.intervalStartet) {
            this.statusUpdateInterval.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private onItemSizeXShowLabel() {
        if (this.init) {
            return;
        }

        if (this.item()!.size_x > 0) {
            this.width = this.item()!.size_x; //The view adds 10px
        }

        if (this.item()!.size_y > 0) {
            this.height = this.item()!.size_y;
        }

        // Let Angular update the template and rerender graph
        setTimeout(() => {
            this.renderGraph();
            this.cdr.markForCheck();
        }, 250);
    }

    private onObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a service in Gadget config modal
            return;
        }

        this.load();
    }

    private onMetricChange() {
        if (this.init) {
            return;
        }

        this.processPerfdata();
        this.renderGraph();
        this.cdr.markForCheck();
    }

}
