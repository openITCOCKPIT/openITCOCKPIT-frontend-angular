import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { RouterLink } from '@angular/router';
import { ApexGrid, ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from '../../../../components/charts/host-pie-chart/host-pie-chart.component';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-services-piechart-widget',
    imports: [
        AsyncPipe,
        FaIconComponent,
        NgIf,
        TranslocoDirective,
        RouterLink,
        ChartComponent,
        BlockLoaderComponent
    ],
    templateUrl: './services-piechart-widget.component.html',
    styleUrl: './services-piechart-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPiechartWidgetComponent extends BaseWidgetComponent {
    public statusCounts?: StatuscountResponse;

    @ViewChild("chart") chart?: ChartComponent;
    public chartOptions!: Partial<ChartOptions>;

    private readonly LayoutService = inject(LayoutService);

    public apexGridOptions: ApexGrid = {
        padding: {
            top: 10,
            right: 0,
            bottom: 0,
            left: 0
        },
    };

    public constructor() {
        super();

        // Subscribe to the color mode changes (drop down menu in header)
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            if (this.chart && this.chartOptions) {

                // Read the background color value from the CSS variable and update the chart
                let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();

                //this.chartOptions.plotOptions?.radialBar?.track?.background = cuiSecondaryBg;
                this.chart.updateOptions({
                    plotOptions: {
                        radialBar: {
                            track: {
                                background: cuiSecondaryBg
                            }
                        }
                    }
                });
            }
            this.cdr.markForCheck();
        }));
    }

    public override load() {
        this.subscriptions.add(this.WidgetsService.loadStatusCount()
            .subscribe((result) => {
                this.statusCounts = result;
                this.updateChart();
                this.cdr.markForCheck();
            })
        );
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    private updateChart() {
        if (!this.statusCounts) {
            return;
        }

        let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();
        this.chartOptions = {
            series: [
                this.statusCounts.servicestatusCountPercentage[0],
                this.statusCounts.servicestatusCountPercentage[1],
                this.statusCounts.servicestatusCountPercentage[2],
                this.statusCounts.servicestatusCountPercentage[3],
            ],
            chart: {
                height: 180,
                offsetY: -20,
                type: "radialBar",

                // The sparkline option remove all paddings
                // https://github.com/apexcharts/apexcharts.js/issues/1272#issuecomment-591388290
                sparkline: {
                    enabled: true
                },
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: -180,
                    endAngle: 180,
                    hollow: {
                        margin: 5,
                        size: "30%",
                        background: "transparent",
                        image: undefined,
                    },
                    track: {
                        show: true,
                        background: cuiSecondaryBg,
                        opacity: 0.5,
                        dropShadow: {
                            enabled: false,
                            top: 2,
                            left: 0,
                            color: '#999999',
                            opacity: 0.2,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            show: true
                        }
                    }
                },
            },
            colors: ["#00bc4c", '#efaf2f', "#bf0000", "#6b737c"],
            labels: [
                this.TranslocoService.translate('Ok'),
                this.TranslocoService.translate('Warning'),
                this.TranslocoService.translate('Critical'),
                this.TranslocoService.translate('Unknown'),
            ],
            legend: {
                show: false
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }
            ]
        };
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        if (this.chart) {
            this.chart.updateOptions(this.chartOptions);
        }
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }
}
