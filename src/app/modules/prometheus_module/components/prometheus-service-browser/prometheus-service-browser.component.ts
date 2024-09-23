import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrometheusAlertRule, PrometheusMetricDetails } from '../../pages/PrometheusQuery/prometheus-query.interface';
import { ColComponent, RowComponent, TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { KeyValuePipe, NgIf } from '@angular/common';
import { PrometheusQueryService } from '../../pages/PrometheusQuery/prometheus-query.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-prometheus-service-browser',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        TranslocoDirective,
        TableDirective,
        NgIf,
        KeyValuePipe,
        FaIconComponent
    ],
    templateUrl: './prometheus-service-browser.component.html',
    styleUrl: './prometheus-service-browser.component.css'
})
export class PrometheusServiceBrowserComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public serviceId: number = 0;
    @Input() public lastUpdated: Date = new Date();

    public showAll: boolean = false;
    public displayLimit: number = 4;

    public alertRule?: PrometheusAlertRule;
    public metrics: PrometheusMetricDetails[] = [];


    private subscriptions: Subscription = new Subscription();
    private readonly PrometheusQueryService = inject(PrometheusQueryService);

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['serviceId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            this.load();
            return;
        }
    }

    public load() {
        this.subscriptions.add(this.PrometheusQueryService.loadPrometheusStateOverviewForServicesBrowser(this.serviceId).subscribe((result) => {
            this.alertRule = result.alertRule;
            const metricValue = result.metricValue.data.result;

            this.metrics = metricValue.map((metric: any) => {
                const metricDetails: PrometheusMetricDetails = {
                    __name__: metric.metric['__name__'],
                    label: Object.keys(metric.metric).filter((key) => key !== '__name__').map((key) => `${key}="${metric.metric[key]}"`),
                    value: metric.value[1],
                    unit: result.alertRule.unit
                };

                return metricDetails;
            });
        }));
    }

    public toggleShowAll() {
        this.showAll = !this.showAll;
    }

}
