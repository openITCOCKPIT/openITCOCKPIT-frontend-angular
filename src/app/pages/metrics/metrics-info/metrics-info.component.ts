import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MetricsService } from '../metrics.service';
import { MetricsInfoResponse } from '../metrics.interface';

@Component({
    selector: 'oitc-metrics-info',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        RowComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        AlertHeadingDirective,
        RouterLink
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
