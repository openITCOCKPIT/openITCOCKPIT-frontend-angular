import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective } from '@jsverse/transloco';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective
} from '@coreui/angular';




import { Subscription } from 'rxjs';
import { MetricsService } from '../metrics.service';
import { MetricsInfoResponse } from '../metrics.interface';

@Component({
    selector: 'oitc-metrics-info',
    imports: [
    FaIconComponent,
    TranslocoDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective
],
    templateUrl: './metrics-info.component.html',
    styleUrl: './metrics-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsInfoComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly metricsService: MetricsService = inject(MetricsService);

    protected hostname: string = '';
    protected metrics: string = '';
    protected serverAddress: string = '';

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.metricsService.getInfo().subscribe((data: MetricsInfoResponse): void => {
            this.hostname = data.systemname;
            this.metrics = data.metrics;
            this.serverAddress = data.serverAddress;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
