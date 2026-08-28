import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';
import { HostOperationsSummaryWidgetService } from './host-operations-summary-widget.service';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ContainersService } from '../../../containers/containers.service';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import _ from 'lodash';
import { ContainersLoadContainersByStringParams } from '../../../containers/containers.interface';
import { HostOperationsSummaryConfig, HostOperationsSummaryResponse } from './host-operations-summary-widget.interface';
import { GenericValidationError } from '../../../../generic-responses';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import * as echarts from 'echarts/core';
import {
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { RegexHelperTooltipComponent } from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BarChart, HeatmapChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import 'echarts/theme/dark.js';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { CanvasRenderer } from 'echarts/renderers';
import { HostSummaryEchartComponent } from '../../../../components/charts/host-summary-echart/host-summary-echart.component';
import { SummaryStateHosts } from '../../../hosts/summary_state.interface';

echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    VisualMapComponent,
    PieChart,
    BarChart,
    HeatmapChart,
    CanvasRenderer
]);

@Component({
    selector: "oitc-host-operations-summary-widget",
    imports: [
        FaIconComponent,
        RowComponent,
        ColComponent,
        FormsModule,
        InputGroupTextDirective,
        InputGroupComponent,
        FormControlDirective,
        TranslocoPipe,
        DebounceDirective,
        FormCheckInputDirective,
        RegexHelperTooltipComponent,
        NgSelectComponent,
        MultiSelectComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        FormCheckComponent,
        TrueFalseDirective,
        FormCheckLabelDirective,
        TranslocoDirective,
        XsButtonDirective,
        HostSummaryEchartComponent
    ],
    templateUrl: "./host-operations-summary-widget.component.html",
    styleUrl: "./host-operations-summary-widget.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostOperationsSummaryWidgetComponent extends BaseWidgetComponent {
    private subscription: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);

    protected flipped = signal<boolean>(false);
    public readonly ContainersService: ContainersService = inject(ContainersService);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public config!: HostOperationsSummaryConfig;
    public hoststatusSummary!:SummaryStateHosts;

    protected hostgroups: SelectKeyValue[] = [];
    protected containers: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    public hostgroupKeywords: string[] = [];
    public hostgroupNotKeywords: string[] = [];
    private readonly HostOperationsSummaryWidgetService = inject(HostOperationsSummaryWidgetService);
    private readonly notyService = inject(NotyService);
    public priorityFilter: { [key: string]: boolean } = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
    };

    @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;
    @ViewChild('barChartContainer') barChartContainer!: ElementRef;
    @ViewChild('heatmapContainer') heatmapContainer!: ElementRef;
    // Ihr erweitertes JSON (Beispiel)
    public tagsData = {
        "tagsOverview": {
            "custom": {"cumulative_state": 0},
            "ddd": {"cumulative_state": 1},
            "webserver": {"cumulative_state": 2},
            "database": {"cumulative_state": -1},
            "storage": {"cumulative_state": 0},
            "firewall": {"cumulative_state": 1}
        }
    };

    private pieChart!: echarts.ECharts;
    private barChart!: echarts.ECharts;
    private heatmapChart!: echarts.ECharts;
    private resizeObserver!: ResizeObserver;


    // Ihre kompletten JSON-Daten
    public dashboardData = {
        "hoststatusSummary": {
            "state": {"0": 50, "1": 9, "2": 2},
            "acknowledged": {"0": 0, "1": 2, "2": 0},
            "in_downtime": {"0": 2, "1": 0, "2": 0},
            "not_handled": {"0": 0, "1": 7, "2": 2},
            "total": 61,
            "lastTimeAlwaysUp": {"count": 46},
            "tagsOverview": {
                "custom": {"cumulative_state": 0},
                "ddd": {"cumulative_state": 0},
                "webserver": {"cumulative_state": 1},
                "database": {"cumulative_state": 2},
                "storage": {"cumulative_state": -1},
                "firewall": {"cumulative_state": 0},
                "loadbalancer": {"cumulative_state": 1}
            }
        }
    };

    // KPI-Variablen für das HTML-Template
    public totalHosts = 0;
    public unhandledErrors = 0;
    public alwaysUpHosts = 0;

    public theme: 'light' | 'dark' = 'light';


    constructor() {
        super();
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            if (theme === 'dark') {
                this.theme = 'dark';
            }
            this.cdr.markForCheck();
        }));

        effect(() => {
            if (this.flipped()) {
                this.loadHostgroups('');
                this.loadContainers('');
            }
            this.cdr.markForCheck();
        });
    }

    public ngAfterViewInit(): void {
        this.renderCharts();
    }


    ngOnInit(): void {
        const summary = this.dashboardData.hoststatusSummary;
        this.totalHosts = summary.total;
        this.unhandledErrors = summary.not_handled["1"] + summary.not_handled["2"];
        this.alwaysUpHosts = summary.lastTimeAlwaysUp.count;
    }

    public override ngOnDestroy() {
        this.resizeObserver?.disconnect();
        this.pieChart?.dispose();
        this.barChart?.dispose();
        this.heatmapChart?.dispose();
    }

    public renderCharts(): void {
        // Alte Instanzen sauber zerstören (wichtig beim Theme-Wechsel)
        this.pieChart?.dispose();
        this.barChart?.dispose();
        this.heatmapChart?.dispose();

        // ECharts-Theme-String festlegen (undefined bedeutet Standard/Light-Mode)
        const themeParam = this.theme === 'dark' ? 'dark' : undefined;

        // Instanzen mit Theme neu aufbauen
        this.pieChart = echarts.init(this.pieChartContainer.nativeElement, themeParam);
        this.barChart = echarts.init(this.barChartContainer.nativeElement, themeParam);
        this.heatmapChart = echarts.init(this.heatmapContainer.nativeElement, themeParam);

        // Optionen setzen
        this.setPieOptions();
        this.setBarOptions();
        this.setHeatmapOptions();
    }

    private setPieOptions(): void {
        const summary = this.dashboardData.hoststatusSummary;

        const option: echarts.EChartsCoreOption = {
            backgroundColor: 'transparent',
            tooltip: {trigger: 'item', formatter: '{b}: {c} ({d}%)'},
            legend: {bottom: '0%', icon: 'circle'},
            color: ['#91cc75', '#ee6666', '#fac858'],
            series: [{
                name: 'Host Status',
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {borderRadius: 8, borderColor: 'transparent', borderWidth: 2},
                label: {show: true, formatter: '{b}\n{c} Hosts'},
                data: [
                    {value: summary.state["0"], name: 'Up (Normal)'},
                    {value: summary.state["1"], name: 'Down (Kritisch)'},
                    {value: summary.state["2"], name: 'Unreachable'}
                ]
            }]
        };
        this.pieChart.setOption(option);
    }

    private setBarOptions(): void {
        const summary = this.dashboardData.hoststatusSummary;

        const option: echarts.EChartsCoreOption = {
            backgroundColor: 'transparent',
            tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
            legend: {bottom: '0%'},
            grid: {left: '3%', right: '4%', bottom: '15%', containLabel: true},
            xAxis: {type: 'category', data: ['Up (0)', 'Down (1)', 'Unreachable (2)']},
            yAxis: {type: 'value', name: 'Hosts'},
            color: ['#5470c6', '#73c0de', '#ee6666'],
            series: [
                {
                    name: 'Quittiert (Acknowledged)',
                    type: 'bar',
                    stack: 'total',
                    data: [summary.acknowledged["0"], summary.acknowledged["1"], summary.acknowledged["2"]]
                },
                {
                    name: 'Wartungsfenster (Downtime)',
                    type: 'bar',
                    stack: 'total',
                    data: [summary.in_downtime["0"], summary.in_downtime["1"], summary.in_downtime["2"]]
                },
                {
                    name: 'Nicht behandelt',
                    type: 'bar',
                    stack: 'total',
                    label: {show: true, position: 'inside', color: '#ffffff'},
                    data: [summary.not_handled["0"], summary.not_handled["1"], summary.not_handled["2"]]
                }
            ]
        };
        this.barChart.setOption(option);
    }

    private setHeatmapOptions(): void {
        const tagsRaw = this.dashboardData.hoststatusSummary.tagsOverview;
        const columnsCount = 5;

        const tagNames: string[] = [];
        const rawCoordinates: { x: number, y: number, value: number }[] = [];

        const entries = Object.entries(tagsRaw);
        const totalTagsCount = entries.length;
        const rowsCount = Math.ceil(totalTagsCount / columnsCount);

        entries.forEach(([name, data], index) => {
            const x = index % columnsCount;
            const regularY = Math.floor(index / columnsCount);
            const echartsY = (rowsCount - 1) - regularY; // Y-Achse für ECharts spiegeln (Top-Left Start)

            tagNames.push(name);
            rawCoordinates.push({x, y: echartsY, value: data.cumulative_state});
        });

        const chartData = rawCoordinates.map(c => [c.x, c.y, c.value]);
        const xData = Array.from({length: columnsCount}, (_, i) => `S${i + 1}`);
        const yData = Array.from({length: rowsCount}, (_, i) => `Z${i + 1}`);

        const option: echarts.EChartsCoreOption = {
            backgroundColor: 'transparent',
            tooltip: {
                position: 'top',
                formatter: (params: any) => {
                    const xIndex = params.data[0];
                    const echartsY = params.data[1];
                    const stateVal = params.data[2];

                    const regularY = (rowsCount - 1) - echartsY;
                    const tagIndex = regularY * columnsCount + xIndex;
                    const tagName = tagNames[tagIndex] || 'Unbekannt';

                    const stateLabels: { [key: number]: string } = {
                        '-1': 'Not in monitoring',
                        '0': 'UP',
                        '1': 'DOWN',
                        '2': 'UNREACHABLE'
                    };
                    // Keine Inline-Textfarben! ECharts formatiert die Box passend zum Light/Dark-Theme automatisch.
                    return `<strong>Tag:</strong> ${tagName}<br/><strong>Status:</strong> ${stateLabels[stateVal] || 'Unbekannt'}`;
                }
            },
            grid: {height: '75%', top: '5%', left: '3%', right: '3%', bottom: '18%'},
            xAxis: {type: 'category', data: xData, show: false},
            yAxis: {type: 'category', data: yData, show: false},
            visualMap: {
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                bottom: '0%',
                pieces: [
                    {value: -1, label: 'Not in monitoring', color: '#94a3b8'},
                    {value: 0, label: 'UP', color: '#91cc75'},
                    {value: 1, label: 'DOWN', color: '#ee6666'},
                    {value: 2, label: 'UNREACHABLE', color: '#fac858'}
                ]
            },
            series: [{
                name: 'Tag Status',
                type: 'heatmap',
                data: chartData,
                label: {
                    show: true,
                    formatter: (params: any) => {
                        const xIndex = params.data[0];
                        const echartsY = params.data[1];
                        const tagIndex = ((rowsCount - 1) - echartsY) * columnsCount + xIndex;
                        return tagNames[tagIndex] || '';
                    },
                    color: '#ffffff', // Weiß bleibt, da Kacheln immer farbig (bunt) sind
                    fontSize: 11,
                    fontWeight: 'bold'
                },
                itemStyle: {borderColor: '#ffffff', borderWidth: 2, borderRadius: 6}
            }]
        };

        this.heatmapChart.setOption(option);
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.HostOperationsSummaryWidgetService.getHostOperationsSummaryWidget(this.widget, 'hosts')
                .subscribe((result) => {
                    this.config = result.config;
                    this.hoststatusSummary = result.hoststatusSummary;
                    this.keywords = this.config.Host.keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Host.not_keywords.split(',').filter(Boolean);
                    this.hostgroupKeywords = this.config.Hostgroup.keywords.split(',').filter(Boolean);
                    this.hostgroupNotKeywords = this.config.Hostgroup.not_keywords.split(',').filter(Boolean);

                    _.map(this.config.hostpriority,
                        (value) => {
                            if (this.priorityFilter.hasOwnProperty(value)) {
                                this.priorityFilter[value as keyof typeof this.priorityFilter] = true;
                            }
                        }
                    );

                    this.cdr.markForCheck();
                }));
        }
    }

    public loadContainers = (searchString: string) => {
        let params: ContainersLoadContainersByStringParams = {
            angular: true,
            'filter[Containers.name]': searchString

        }

        this.subscriptions.add(this.ContainersService.loadContainersByString(params)
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    protected loadHostgroups = (search: string) => {
        let hostgroupIds: number[] = [];
        if (this.config?.Hostgroup._ids) {
            hostgroupIds = this.config.Hostgroup._ids;
        }
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({
            'filter[Containers.name]': search,
            'selected[]': hostgroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Host.keywords = this.keywords.join(',');
        this.config.Host.not_keywords = this.notKeywords.join(',');
        this.config.Hostgroup.keywords = this.hostgroupKeywords.join(',');
        this.config.Hostgroup.not_keywords = this.hostgroupNotKeywords.join(',');

        this.config.hostpriority = [];
        _.map(this.priorityFilter,
            (value, key) => {
                if (value) {
                    this.config.hostpriority.push(key);
                }
            }
        );

        this.subscriptions.add(this.HostOperationsSummaryWidgetService.saveWidget(this.widget, this.config)
            .subscribe({
                next: (result) => {
                    this.cdr.markForCheck();
                    const title = this.TranslocoService.translate('Success');
                    const msg = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.notyService.scrollContentDivToTop();
                    this.load();
                    this.flipped.set(false);

                    return;
                },
                // Error
                error: (error) => {
                    const errorResponse = error as GenericValidationError;
                    this.notyService.genericError();
                }
            }));
    }
}