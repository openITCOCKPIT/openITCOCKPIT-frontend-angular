import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CustomAlertsIndexCustomAlertsStateFilter,
    CustomAlertsState
} from '../../pages/customalerts/customalerts.interface';
import {
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    CustomAlertRulesHistoryParams,
    CustomAlertsStateHistory
} from '../../pages/customalert-rules/customalert-rules.interface';
import { formatDate } from '@angular/common';
import { CustomalertRulesService } from '../../pages/customalert-rules/customalert-rules.service';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { HttpParams } from '@angular/common/http';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
    selector: 'oitc-customalerts-rules-history',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        XsButtonDirective,
        ColComponent,
        ContainerComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        RowComponent,
        TableDirective,
        TableLoaderComponent
    ],
    templateUrl: './customalerts-rules-history.component.html',
    styleUrl: './customalerts-rules-history.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsRulesHistoryComponent implements OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomalertRulesService: CustomalertRulesService = inject(CustomalertRulesService);

    // Component inputs from the parent component
    public params = input.required<CustomAlertRulesHistoryParams>();
    public stateFilter = input.required<CustomAlertsIndexCustomAlertsStateFilter>();
    public from = input.required<string>();
    public to = input.required<string>();
    protected result!: CustomAlertsStateHistory;

    // Local signals to handle internal changes for pagination and sorting
    private activePage = signal<number | null>(null);
    private activeScroll = signal<boolean | null>(null);
    private activeSort = signal<string | null>(null);
    private activeDirection = signal<'asc' | 'desc' | '' | null>(null);

    public refresh = input.required<number>(); // Vom Parent gesteuert
    // Local cache variable to retain data during background reloads
    private _historyCache: CustomAlertsStateHistory | undefined = undefined;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Reactive API resource that triggers automatically on parameter updates
    public historyResource = rxResource({
        params: () => ({
            filterParams: this.params(),
            state: this.stateFilter(),
            from: this.from(),
            to: this.to(),
            page: this.activePage(),
            scroll: this.activeScroll(),
            sort: this.activeSort(),
            direction: this.activeDirection(),
            refresh: this.refresh()
        }),
        // Format date values to match backend specifications
        stream: ({params}) => {
            const formattedFrom = formatDate(new Date(params.from), 'dd.MM.y HH:mm', 'en-US');
            const formattedTo = formatDate(new Date(params.to), 'dd.MM.y HH:mm', 'en-US');

            // Filter and map active alert states
            const activeStates: number[] = [];
            if (params.state[CustomAlertsState.New]) activeStates.push(CustomAlertsState.New);
            if (params.state[CustomAlertsState.InProgress]) activeStates.push(CustomAlertsState.InProgress);
            if (params.state[CustomAlertsState.Done]) activeStates.push(CustomAlertsState.Done);
            if (params.state[CustomAlertsState.ManuallyClosed]) activeStates.push(CustomAlertsState.ManuallyClosed);

            // Build the final, strictly typed API parameter object
            const apiParams: CustomAlertRulesHistoryParams = {
                ...params.filterParams,
                page: params.page ?? params.filterParams.page,
                scroll: params.scroll ?? params.filterParams.scroll,
                sort: params.sort ?? params.filterParams.sort,
                direction: params.direction !== null ? params.direction : params.filterParams.direction,
                'filter[from]': formattedFrom,
                'filter[to]': formattedTo,
                'filter[CustomalertStatehistory.state][]': activeStates
            };
            // Dispatch the HTTP request via the service
            return this.CustomalertRulesService.getHistory(apiParams);
        }
    });

    // Stable linked signal acting as a data buffer to prevent UI flickering
    protected stableResult = linkedSignal<CustomAlertsStateHistory | undefined>(() => {
        const currentApiValue = this.historyResource.value();

        // Update the local cache whenever new data arrives from the API
        if (currentApiValue !== undefined) {
            this._historyCache = currentApiValue;
        }

        // Always return the cached data to keep the table populated during filtering
        return this._historyCache;
    });

    // Callback triggered when the table sorting changes
    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.activeSort.set(sort.active);
            this.activeDirection.set(sort.direction as 'asc' | 'desc' | '');
        }
    }

    // Callback triggered by the paginator or scroll index component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.activePage.set(change.page);
        this.activeScroll.set(change.scroll);
    }


    public linkFor(format: 'csv') {
        // Keep the parameter for API compatibility with the caller.
        void format;
        let baseUrl = '/customalert_module/customalert_rules/listToCsv?';

        const from = formatDate(new Date(this.from()), 'dd.MM.y HH:mm', 'en-US');
        const to = formatDate(new Date(this.to()), 'dd.MM.y HH:mm', 'en-US');

        this.params()['filter[from]'] = from;
        this.params()['filter[to]'] = to;

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

        let urlParams = {
            'angular': true,
            'sort': 'CustomalertStatehistory.state_time',
            'page': this.params().page,
            'direction': 'asc',
            'filter[Hosts.name]': this.params()['filter[Hosts.name]'],
            'filter[servicename]': this.params()['filter[servicename]'],
            'filter[CustomalertComments.comment]': this.params()['filter[CustomalertComments.comment]'],
            'filter[CustomalertStatehistory.state][]': this.params()['filter[CustomalertStatehistory.state][]'],
            'filter[CustomalertRules.id][]': this.params()['filter[CustomalertRules.id][]'],
            'filter[from]': from,
            'filter[to]': to
        };

        let stringParams: HttpParams = new HttpParams();
        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();
    }
}
