import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, OnDestroy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, formatDate } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import {
    CustomalertsStackedBarEchartComponent
} from '../charts/customalerts-stacked-bar-echart/customalerts-stacked-bar-echart.component';
import {
    CustomAlertRulesHistoryParams,
    CustomalertStateOverviewData
} from '../../pages/customalert-rules/customalert-rules.interface';
import {
    CustomAlertsIndexCustomAlertsStateFilter,
    CustomAlertsState
} from '../../pages/customalerts/customalerts.interface';
import { CustomalertRulesService } from '../../pages/customalert-rules/customalert-rules.service';
import { Subscription } from 'rxjs';

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
export class CustomalertsRulesStatusDistributionComponent implements OnDestroy {
    private readonly customalertRulesService = inject(CustomalertRulesService);
    private readonly subscriptions: Subscription = new Subscription();


    // Component inputs received from the parent component
    public params = input.required<CustomAlertRulesHistoryParams>();
    public stateFilter = input.required<CustomAlertsIndexCustomAlertsStateFilter>();
    public from = input.required<string>();
    public to = input.required<string>();
    public refresh = input.required<number>(); // Controlled by the refresh button in the parent


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Reactive API resource that triggers automatically on parameter updates
    public distributionResource = rxResource({
        params: () => ({
            filterParams: this.params(),
            state: this.stateFilter(),
            from: this.from(),
            to: this.to(),
            refresh: this.refresh() // Registers the manual refresh counter reactively
        }),

        stream: ({params}) => {
            // Format date values to match backend specifications
            const formattedFrom = formatDate(new Date(params.from), 'dd.MM.y HH:mm', 'en-US');
            const formattedTo = formatDate(new Date(params.to), 'dd.MM.y HH:mm', 'en-US');

            // Filter and map active alert states
            const activeStates: number[] = [];
            if (params.state[CustomAlertsState.New]) activeStates.push(CustomAlertsState.New);
            if (params.state[CustomAlertsState.InProgress]) activeStates.push(CustomAlertsState.InProgress);
            if (params.state[CustomAlertsState.Done]) activeStates.push(CustomAlertsState.Done);
            if (params.state[CustomAlertsState.ManuallyClosed]) activeStates.push(CustomAlertsState.ManuallyClosed);

            // Build the final API parameter object (the 'refresh' property is omitted here)
            const apiParams: CustomAlertRulesHistoryParams = {
                ...params.filterParams,
                'filter[from]': formattedFrom,
                'filter[to]': formattedTo,
                'filter[CustomalertStatehistory.state][]': activeStates
            };

            // Dispatch the HTTP request via the service
            return this.customalertRulesService.getStatusDistribution(apiParams);
        }
    });

    // Local cache variable to retain chart data during background reloads
    private _distributionCache: CustomalertStateOverviewData | undefined = undefined;

    // Stable linked signal acting as a data buffer to prevent UI flickering
    protected stableResult = linkedSignal<CustomalertStateOverviewData | undefined>(() => {
        const currentApiValue = this.distributionResource.value();

        // Update the local cache whenever new data arrives from the API
        if (currentApiValue !== undefined) {
            this._distributionCache = currentApiValue;
        }

        // Always return the cached data to keep the chart visible during filtering
        return this._distributionCache;
    });

    protected readonly String = String;
}
