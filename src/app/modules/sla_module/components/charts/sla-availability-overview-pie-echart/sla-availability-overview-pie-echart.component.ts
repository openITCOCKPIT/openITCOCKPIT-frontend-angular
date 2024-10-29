import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import 'echarts/theme/dark.js';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { Availability } from '../../../pages/slas/Slas.interface';
import { PieChartMetric } from '../../../../../components/charts/charts.interface';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';

@Component({
    selector: 'oitc-sla-availability-overview-pie-echart',
    standalone: true,
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEcharts(),
    ],
    templateUrl: './sla-availability-overview-pie-echart.component.html',
    styleUrl: './sla-availability-overview-pie-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaAvailabilityOverviewPieEchartComponent implements OnInit, OnChanges, OnDestroy {

    public availability = input<Availability>({} as Availability);

    public theme: null | 'dark' = null;
    public chartOption: EChartsOption = {};
    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    private AvailabilityLabel: string = this.TranslocoService.translate('Availability');
    private UptimeLabel: string = this.TranslocoService.translate('Uptime');
    private OutageLabel: string = this.TranslocoService.translate('Outage');

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = null;
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

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes['sla'] || changes['availability']) {

            console.log("renderChart");
            this.renderChart();
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.cdr.markForCheck();
    }

    private renderChart() {

        const passed = this.availability().status_percent;
        const failed = 100 - passed;
        let data: PieChartMetric[] = [
            {value: Number(failed.toFixed(3)), name: this.OutageLabel},
            {value: Number(passed.toFixed(3)), name: this.UptimeLabel}
        ];

        this.chartOption = {
            title: {
                text: this.AvailabilityLabel + ' ' + passed + ' %',
                left: 'center',
                textStyle: {
                    fontSize: 18,
                    fontStyle: 'normal'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 'center'
            },
            series: [
                {
                    name: 'Availability',
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    color: ['#CC0000ff', '#00C851'],
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        this.cdr.markForCheck();
    }
}
