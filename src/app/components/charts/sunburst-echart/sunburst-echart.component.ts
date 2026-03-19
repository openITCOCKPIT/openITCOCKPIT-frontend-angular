import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output
} from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { TranslocoService } from '@jsverse/transloco';
import { CanvasRenderer } from 'echarts/renderers';

import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';

import { SunburstChart } from 'echarts/charts';
import {
    ResourcegroupMap,
    ResourcegroupsSummaryMap,
    ResourceMap
} from '../../../modules/scm_module/pages/resourcegroups/resourcegroups-summary/resourcegroups-summary.interface';
import _ from 'lodash';

echarts.use([SunburstChart, LegendComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

@Component({
    selector: 'oitc-sunburst-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './sunburst-echart.component.html',
    styleUrl: './sunburst-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SunburstEchartComponent implements OnDestroy {

    public title = input<string>('Service availability');
    public showLegend = input<boolean>(true);
    public chartData = input<ResourcegroupsSummaryMap[]>([]);
    public scaleSize = input<number>(20);
    public scale = input<boolean>(true);
    public resourcegroups = input<ResourcegroupMap[]>([]);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);


    @Output() selectedResourceId = new EventEmitter<number | null>();
    @Output() selectedResoucegroup = new EventEmitter<ResourcegroupMap | undefined>();
    @Output() selectedResource = new EventEmitter<ResourceMap | undefined>();

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderChart();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.echartsInstance.on('click', (params: any) => {
            if (params.data) {
                if (params.data['type'] && params.data['type'] === 'resourcegroup') {
                    this.selectedResourceId.emit(null);

                    this.selectedResoucegroup.emit(_.find(this.resourcegroups(), function (resourcegroup) {
                            return resourcegroup.id == params.data['id'];
                        })
                    );
                    this.cdr.markForCheck();

                } else if (params.data['type'] && params.data['type'] === 'resource') {
                    let resourcegroupMap = _.find(this.resourcegroups(), function (resourcegroup) {
                        return resourcegroup.id == params.data['resourcegroup_id'];
                    });
                    this.selectedResoucegroup.emit(resourcegroupMap);
                    if (resourcegroupMap && resourcegroupMap.resources) {
                        let resource = _.find(resourcegroupMap.resources, function (resource) {
                            return resource.id == params.data['resource_id'];
                        });
                        this.selectedResource.emit(resource);
                        if (resource) {
                            this.selectedResourceId.emit(resource['id']);
                        }
                    }
                    this.cdr.markForCheck();
                } else {
                    this.selectedResoucegroup.emit(undefined);
                    this.selectedResource.emit(undefined);
                    this.selectedResourceId.emit(null);
                    this.cdr.markForCheck();
                }
            }
        });
        this.cdr.markForCheck();
    }

    private renderChart() {
        this.chartOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                position: 'top',
                formatter: (params: any) => {
                    if (params.name.length === 0) {
                        return this.TranslocoService.translate('Back');
                    }
                    return params.name;
                }
            },
            series: {
                type: 'sunburst',
                data: this.chartData(),
                radius: [0, '100%'],
                emphasis: {
                    focus: 'ancestor'
                },
                label: {
                    fontSize: 10,
                    formatter: (params: any) => {
                        let maxLength = 14;
                        if (params.data && params.data.type && params.data.type === 'resourcegroup') {
                            maxLength = 18;
                        }
                        return this.truncate(params.name, maxLength, '...');
                    }
                },
                levels: [
                    {
                        r0: 0,
                        r: '8%',
                        label: {
                            fontSize: 20,
                            formatter: (params: any) => {
                                return '↩';
                            },
                            rotate: 0,
                            color: '#ffffff',
                            verticalAlign: 'middle',
                            align: 'center'
                        }
                    },
                    {
                        r0: '8%',
                        r: '60%',
                        label: {
                            align: 'center',
                            padding: 0,
                        }
                    },
                    {
                        r0: '60%',
                        r: '65%',
                        label: {
                            position: 'outside',
                            padding: 0,
                            silent: false
                        },
                        itemStyle: {
                            borderWidth: 3
                        }
                    }
                ]
            }
        };
    }

    public truncate(fullStr: string, strLen: number, separator: string): string {
        if (fullStr.length <= strLen) return fullStr;
        separator = separator || '...';
        let sepLen = separator.length,
            charsToShow = strLen - sepLen,
            frontChars = Math.ceil(charsToShow / 2),
            backChars = Math.floor(charsToShow / 2);

        return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars);
    }
}
