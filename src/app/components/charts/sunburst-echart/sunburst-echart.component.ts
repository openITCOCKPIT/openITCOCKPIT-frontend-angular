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

    @Output() selectedResouceId = new EventEmitter<number | null>();
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
                    this.selectedResouceId.emit(null);

                    this.selectedResoucegroup.emit(_.find(this.resourcegroups(), function (resourcegroup) {
                            return resourcegroup.id == params.data['id'];
                        })
                    );
                    this.cdr.markForCheck();

                } else if (params.data['type'] && params.data['type'] === 'resource') {
                    let resourcegroupMap = _.find(this.resourcegroups(), function (resourcegroup) {
                        return resourcegroup.id == params.data['type']['resourcegroup_id'];
                    });
                    this.selectedResoucegroup.emit(resourcegroupMap);
                    console.log(resourcegroupMap);
                    if (resourcegroupMap && resourcegroupMap.resources) {
                        this.selectedResource.emit(_.find(resourcegroupMap.resources, function (resource) {
                                return resource.id == params.data['resource_id'];
                            })
                        );
                    }


                    //set focus on resource group as parent of resource
                    /*
                    if (params.data.__dataNode && params.data.__dataNode.parent) {
                        this.sunburstChartInstance.focusOnNode(params.data.__dataNode.parent.data);
                        this.selectedResouceId = params.data['resource_id'];
                    }

                     */
                    this.cdr.markForCheck();

                }
                //   else {
                //       this.selectedResouceId = null;
                //       this.sunburstChartInstance.focusOnNode(null);
                //       this.cdr.markForCheck();
                //   }
            }
            // Implement custom logic here
        });

        this.cdr.markForCheck();
    }

    private renderChart() {
        this.chartOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                position: 'top',
                formatter: '{b}'
            },
            series: {
                type: 'sunburst',
                data: this.chartData(),
                radius: [0, '100%'],
                sort: undefined,
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
                        r: '60%',
                        label: {
                            show: false,
                            silent: true
                        },
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

    private getLegend(): any {
        if (!this.showLegend()) {
            return undefined;
        }
        return {
            orient: 'vertical',
            left: 'left'
        };
    }

    private getTitle(): any {
        if (this.title().length === 0) {
            return undefined;
        }
        return {
            text: this.TranslocoService.translate(this.title()),
            //subtext: 'Fake Data',
            left: 'center'
        }
    }

    public truncate(fullStr: string, strLen: number, separator: string): string {
        if (fullStr.length <= strLen) return fullStr;

        separator = separator || '...';

        var sepLen = separator.length,
            charsToShow = strLen - sepLen,
            frontChars = Math.ceil(charsToShow / 2),
            backChars = Math.floor(charsToShow / 2);

        return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
    }

}
