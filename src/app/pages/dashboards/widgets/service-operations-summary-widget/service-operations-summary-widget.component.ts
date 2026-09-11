import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from "@angular/core";
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';
import { ServiceOperationsSummaryWidgetService } from './service-operations-summary-widget.service';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ContainersService } from '../../../containers/containers.service';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import _ from 'lodash';
import { ContainersLoadContainersByStringParams } from '../../../containers/containers.interface';
import { ServiceOperationsSummaryConfig } from './service-operations-summary-widget.interface';
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
import { NgSelectComponent } from '@ng-select/ng-select';
import { BarChart, HeatmapChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import 'echarts/theme/dark.js';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { CanvasRenderer } from 'echarts/renderers';
import { SummaryStateServicesExtended } from '../../../services/summary_state.interface';
import { RouterLink } from '@angular/router';
import { ServicegroupsService } from '../../../servicegroups/servicegroups.service';
import { ServicegroupsLoadServicegroupsByStringParams } from '../../../servicegroups/servicegroups.interface';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { RegexHelperTooltipComponent } from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ServiceSummaryEchartComponent } from '../../../../components/charts/service-summary-echart/service-summary-echart.component';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { ServiceHeatmapEchartComponent } from '../../../../components/charts/service-heatmap-echart/service-heatmap-echart.component';
import { ServiceStatusScatterEchartComponent } from '../../../../components/charts/service-status-scatter-echart/service-status-scatter-echart.component';
import { IntervalPickerComponent } from '../../../../components/interval-picker/interval-picker.component';

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
    selector: "oitc-service-operations-summary-widget",
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
        FormCheckLabelDirective,
        TranslocoDirective,
        XsButtonDirective,
        ServiceSummaryEchartComponent,
        PermissionDirective,
        RouterLink,
        ServiceHeatmapEchartComponent,
        ServiceStatusScatterEchartComponent,
        IntervalPickerComponent
    ],
    templateUrl: "./service-operations-summary-widget.component.html",
    styleUrl: "./service-operations-summary-widget.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceOperationsSummaryWidgetComponent extends BaseWidgetComponent implements OnDestroy {
    private readonly LayoutService = inject(LayoutService);

    protected flipped = signal<boolean>(false);
    public readonly ContainersService: ContainersService = inject(ContainersService);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    public config!: ServiceOperationsSummaryConfig;
    protected selectedAutoRefresh: SelectKeyValue = {key: 0, value: 'Disabled'};
    private refreshInterval: any = null;

    public servicestatusSummary!: SummaryStateServicesExtended;

    protected hostgroups: SelectKeyValue[] = [];
    protected servicegroups: SelectKeyValue[] = [];
    protected containers: SelectKeyValue[] = [];

    public serviceKeywords: string[] = [];
    public serviceNotKeywords: string[] = [];

    public hostKeywords: string[] = [];
    public hostNotKeywords: string[] = [];

    public hostgroupKeywords: string[] = [];
    public hostgroupNotKeywords: string[] = [];
    public servicegroupKeywords: string[] = [];
    public servicegroupNotKeywords: string[] = [];
    private readonly ServiceOperationsSummaryWidgetService = inject(ServiceOperationsSummaryWidgetService);
    private readonly notyService = inject(NotyService);
    public priorityFilter: { [key: string]: boolean } = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
    };

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
                this.loadServicegroups('');
                this.loadContainers('');
            }
            this.cdr.markForCheck();
        });
    }

    public override ngOnDestroy() {
        this.stopRefreshInterval();
        this.resizeObserver?.disconnect();
        this.pieChart?.dispose();
        this.barChart?.dispose();
        this.heatmapChart?.dispose();
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ServiceOperationsSummaryWidgetService.getServiceOperationsSummaryWidget(this.widget, 'services')
                .subscribe((result) => {
                    this.config = result.config;
                    this.servicestatusSummary = result.servicestatusSummary;
                    this.hostKeywords = this.config.Host.keywords.split(',').filter(Boolean);
                    this.hostNotKeywords = this.config.Host.not_keywords.split(',').filter(Boolean);

                    this.serviceKeywords = this.config.Service.keywords.split(',').filter(Boolean);
                    this.serviceNotKeywords = this.config.Service.not_keywords.split(',').filter(Boolean);

                    this.hostgroupKeywords = this.config.Hostgroup.keywords.split(',').filter(Boolean);
                    this.hostgroupNotKeywords = this.config.Hostgroup.not_keywords.split(',').filter(Boolean);

                    this.servicegroupKeywords = this.config.Servicegroup.keywords.split(',').filter(Boolean);
                    this.servicegroupNotKeywords = this.config.Servicegroup.not_keywords.split(',').filter(Boolean);

                    _.map(this.config.servicepriority,
                        (value) => {
                            if (this.priorityFilter.hasOwnProperty(value)) {
                                this.priorityFilter[value as keyof typeof this.priorityFilter] = true;
                            }
                        }
                    );

                    this.selectedAutoRefresh.key = this.config.refresh_key ?? 0;
                    //trigger refresh for allocated widgets
                    if (this.selectedAutoRefresh.key > 0) {
                        this.startRefreshInterval(this.selectedAutoRefresh.key);
                    }

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

    protected loadServicegroups = (search: string) => {
        let servicegroupIds: number[] = [];
        if (this.config?.Servicegroup._ids) {
            servicegroupIds = this.config.Servicegroup._ids;
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString({
            'filter[Containers.name]': search,
            'selected[]': servicegroupIds
        } as ServicegroupsLoadServicegroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Host.keywords = this.hostKeywords.join(',');
        this.config.Host.not_keywords = this.hostNotKeywords.join(',');
        this.config.Service.keywords = this.serviceKeywords.join(',');
        this.config.Service.not_keywords = this.serviceNotKeywords.join(',');
        this.config.Hostgroup.keywords = this.hostgroupKeywords.join(',');
        this.config.Hostgroup.not_keywords = this.hostgroupNotKeywords.join(',');
        this.config.Servicegroup.keywords = this.servicegroupKeywords.join(',');
        this.config.Servicegroup.not_keywords = this.servicegroupNotKeywords.join(',');

        this.config.servicepriority = [];
        _.map(this.priorityFilter,
            (value, key) => {
                if (value) {
                    this.config.servicepriority.push(key);
                }
            }
        );

        this.subscriptions.add(this.ServiceOperationsSummaryWidgetService.saveWidget(this.widget, this.config)
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

    public onRefreshChange = (value?: SelectKeyValue): void => {
        if (value) {
            this.selectedAutoRefresh = value;
            if (this.config) {
                this.config.refresh_key = this.selectedAutoRefresh.key;
                this.submit();
            }

        }
        this.stopRefreshInterval();
        if (this.selectedAutoRefresh.key > 0) {
            this.startRefreshInterval(this.selectedAutoRefresh.key);
        }

    }

    private startRefreshInterval(interval: number) {
        this.stopRefreshInterval();
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, interval * 1000);
    }

    protected refresh(): void {
        this.load();
        this.cdr.markForCheck();

    }

    private stopRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = null;
    }

    protected readonly JSON = JSON;
}