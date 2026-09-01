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
import { HostOperationsSummaryConfig } from './host-operations-summary-widget.interface';
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
import { SummaryStateHostsExtended } from '../../../hosts/summary_state.interface';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { HostHeatmapEchartComponent } from '../../../../components/charts/host-heatmap-echart/host-heatmap-echart.component';
import { HostStatusScatterEchartComponent } from '../../../../components/charts/host-status-scatter-echart/host-status-scatter-echart.component';

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
        HostSummaryEchartComponent,
        PermissionDirective,
        RouterLink,
        HostHeatmapEchartComponent,
        HostStatusScatterEchartComponent
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
    public hoststatusSummary!: SummaryStateHostsExtended;

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

    private pieChart!: echarts.ECharts;
    private barChart!: echarts.ECharts;
    private heatmapChart!: echarts.ECharts;
    private resizeObserver!: ResizeObserver;

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

    public override ngOnDestroy() {
        this.resizeObserver?.disconnect();
        this.pieChart?.dispose();
        this.barChart?.dispose();
        this.heatmapChart?.dispose();
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

    protected readonly JSON = JSON;
}