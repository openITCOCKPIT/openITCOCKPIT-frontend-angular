import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import {
    InstantreportGenerateResponse,
    InstantreportHtmlHostWithServices,
    InstantreportReportDetails
} from '../../instantreports.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    HostRadialbarChartComponent
} from '../../../../components/charts/host-radialbar-chart/host-radialbar-chart.component';
import { NgForOf, NgIf } from '@angular/common';
import {
    ServiceRadialbarChartComponent
} from '../../../../components/charts/service-radialbar-chart/service-radialbar-chart.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { PieChartMetric } from '../../../../components/charts/charts.interface';
import { HostPieEchartComponent } from '../../../../components/charts/host-pie-echart/host-pie-echart.component';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import {
    ServicePieEchartComponent
} from '../../../../components/charts/service-pie-echart/service-pie-echart.component';

@Component({
    selector: 'oitc-instantreport-viewer',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FaIconComponent,
        HostRadialbarChartComponent,
        NgIf,
        RowComponent,
        ServiceRadialbarChartComponent,
        TranslocoDirective,
        HostPieEchartComponent,
        LabelLinkComponent,
        NgForOf,
        ServicePieEchartComponent
    ],
    templateUrl: './instantreport-viewer.component.html',
    styleUrl: './instantreport-viewer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstantreportViewerComponent {

    public report = input<InstantreportGenerateResponse>();

    public reportDetails?: InstantreportReportDetails;
    public hostsWithServices: InstantreportHtmlHostWithServices[] = [];

    // Used if summary == 1
    public hostSummary: PieChartMetric[] = [];
    public serviceSummary: PieChartMetric[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            // We need to reformat the data a bit because the server returns a hashmap with uuid as key
            // Angular needs an array for ngFor
            const report = this.report();
            this.reportDetails = report?.instantReport.reportDetails;

            this.hostsWithServices = [];
            if (report?.instantReport.hosts) {
                for (const hostUuid in report.instantReport.hosts) {
                    const host = report.instantReport.hosts[hostUuid];
                    const services = Object.values(host.Services);
                    this.hostsWithServices.push({
                            Host: host.Host,
                            Services: services
                        }
                    );
                }
            }

            if (report?.instantReport.reportDetails.summary === 1) {
                this.hostSummary = [];
                this.serviceSummary = [];

                this.hostSummary.push({
                    name: report.instantReport.reportDetails.summary_hosts?.reportData.percentage[0] || 'Error',
                    value: report.instantReport.reportDetails.summary_hosts?.reportData['0'] || 0
                });
                this.hostSummary.push({
                    name: report.instantReport.reportDetails.summary_hosts?.reportData.percentage[1] || 'Error',
                    value: report.instantReport.reportDetails.summary_hosts?.reportData['1'] || 0
                });
                this.hostSummary.push({
                    name: report.instantReport.reportDetails.summary_hosts?.reportData.percentage[2] || 'Error',
                    value: report.instantReport.reportDetails.summary_hosts?.reportData['2'] || 0
                });

                this.serviceSummary.push({
                    name: report.instantReport.reportDetails.summary_services?.reportData.percentage[0] || 'Error',
                    value: report.instantReport.reportDetails.summary_services?.reportData['0'] || 0
                });
                this.serviceSummary.push({
                    name: report.instantReport.reportDetails.summary_services?.reportData.percentage[1] || 'Error',
                    value: report.instantReport.reportDetails.summary_services?.reportData['1'] || 0
                });
                this.serviceSummary.push({
                    name: report.instantReport.reportDetails.summary_services?.reportData.percentage[2] || 'Error',
                    value: report.instantReport.reportDetails.summary_services?.reportData['2'] || 0
                });
                this.serviceSummary.push({
                    name: report.instantReport.reportDetails.summary_services?.reportData.percentage[3] || 'Error',
                    value: report.instantReport.reportDetails.summary_services?.reportData['3'] || 0
                });
            }

            this.cdr.markForCheck();
        });
    }

    protected readonly Object = Object;
}
