import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import {
    InstantreportGenerateResponse,
    InstantreportHtmlHostWithServices,
    InstantreportReportDetails,
    InstantreportService
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



import { TranslocoDirective } from '@jsverse/transloco';
import { ChartAbsolutValue, PieChartMetric } from '../../../../components/charts/charts.interface';
import { HostPieEchartComponent } from '../../../../components/charts/host-pie-echart/host-pie-echart.component';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import {
    ServicePieEchartComponent
} from '../../../../components/charts/service-pie-echart/service-pie-echart.component';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    ServiceProgressbarComponent
} from '../../../../components/services/service-progressbar/service-progressbar.component';
import {
    HostSimplePieChartComponent
} from '../../../../components/charts/host-simple-pie-chart/host-simple-pie-chart.component';

@Component({
    selector: 'oitc-instantreport-viewer',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FaIconComponent,
    RowComponent,
    TranslocoDirective,
    HostPieEchartComponent,
    LabelLinkComponent,
    ServicePieEchartComponent,
    PermissionDirective,
    RouterLink,
    ServiceProgressbarComponent,
    HostSimplePieChartComponent
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
                    let services: InstantreportService[] = [];
                    if (host.Host.Services) {
                        services = Object.values(host.Host.Services);
                    }

                    let hostPieChartMetrics: PieChartMetric[] = [];
                    if (host.Host.reportData) {
                        // Only available if report evaluation is for hosts or hosts + services
                        for (let i = 0; i <= 2; i++) {
                            hostPieChartMetrics.push({
                                name: host.Host.reportData.percentage[i] || 'Error',
                                // @ts-ignore
                                value: host.Host.reportData[i.toString()] || 0
                            });
                        }
                    }

                    host.Host._pieChartMetrics = hostPieChartMetrics;

                    services.forEach(service => {
                        let serviceChartAbsolutValues: ChartAbsolutValue[] = [];
                        for (let i = 0; i <= 3; i++) {
                            const total = service.Service.reportData['0'] + service.Service.reportData['1'] + service.Service.reportData['2'] + service.Service.reportData['3'];
                            serviceChartAbsolutValues.push({
                                Name: service.Service.reportData.percentage[i] || 'Error',
                                // @ts-ignore
                                Value: service.Service.reportData[i.toString()] || 0,
                                Total: total
                            });
                        }
                        service.Service._chartAbsolutValues = serviceChartAbsolutValues;
                    });
                    
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

                if (report && report.instantReport.reportDetails.summary_hosts) {
                    // Only available if report evaluation is for hosts or hosts + services
                    for (let i = 0; i <= 2; i++) {
                        this.hostSummary.push({
                            name: report.instantReport.reportDetails.summary_hosts?.reportData.percentage[i] || 'Error',
                            // @ts-ignore
                            value: report.instantReport.reportDetails.summary_hosts?.reportData[i.toString()] || 0
                        });
                    }
                }

                if (report && report.instantReport.reportDetails.summary_services) {
                    // Only available if report evaluation is for services or hosts + services
                    for (let i = 0; i <= 3; i++) {
                        this.serviceSummary.push({
                            name: report.instantReport.reportDetails.summary_services?.reportData.percentage[i] || 'Error',
                            // @ts-ignore
                            value: report.instantReport.reportDetails.summary_services?.reportData[i.toString()] || 0
                        });
                    }
                }
            }

            this.cdr.markForCheck();
        });
    }

    protected readonly Object = Object;
}
