import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CustomAlertsIndexCustomAlertsStateFilter,
    CustomAlertsState
} from '../../pages/customalerts/customalerts.interface';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import {
    CustomAlertRulesHistoryParams,
    CustomalertStateOverview, CustomalertStateOverviewData
} from '../../pages/customalert-rules/customalert-rules.interface';
import { DatePipe, formatDate } from '@angular/common';
import { CustomalertRulesService } from '../../pages/customalert-rules/customalert-rules.service';
import {
    CustomalertsStackedBarEchartComponent
} from '../charts/customalerts-stacked-bar-echart/customalerts-stacked-bar-echart.component';

@Component({
    selector: 'oitc-customalerts-rules-status-distribution',
    imports: [
        TranslocoDirective,
        TableLoaderComponent,
        CustomalertsStackedBarEchartComponent,
        DatePipe


    ],
    templateUrl: './customalerts-rules-status-distribution.component.html',
    styleUrl: './customalerts-rules-status-distribution.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsRulesStatusDistributionComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly CustomalertRulesService: CustomalertRulesService = inject(CustomalertRulesService);


    public params = input.required<CustomAlertRulesHistoryParams>();
    public stateFilter = input.required<CustomAlertsIndexCustomAlertsStateFilter>();
    public from = input.required<string>();
    public to = input.required<string>();
    protected result!: CustomalertStateOverviewData;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        this.load();
    }

    public load(): void {
        this.params()['filter[from]'] = formatDate(new Date(this.from()), 'dd.MM.y HH:mm', 'en-US');
        this.params()['filter[to]'] = formatDate(new Date(this.to()), 'dd.MM.y HH:mm', 'en-US');

        this.params()['filter[CustomalertStatehistory.state][]'] = [];
        if (this.stateFilter()[CustomAlertsState.New]) {
            this.params()['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.New);
        }
        if (this.stateFilter()[CustomAlertsState.InProgress]) {
            this.params()['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.InProgress);
        }
        if (this.stateFilter()[CustomAlertsState.Done]) {
            this.params()['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.Done);
        }
        if (this.stateFilter()[CustomAlertsState.ManuallyClosed]) {
            this.params()['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.ManuallyClosed);
        }

        this.subscriptions.add(this.CustomalertRulesService.getStatusDistribution(this.params())
            .subscribe((result: CustomalertStateOverviewData) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

    protected readonly String = String;
}
