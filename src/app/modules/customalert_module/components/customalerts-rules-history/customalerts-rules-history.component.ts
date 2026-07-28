import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
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
export class CustomalertsRulesHistoryComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomalertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);


    public params = input.required<CustomAlertRulesHistoryParams>();
    public stateFilter = input.required<CustomAlertsIndexCustomAlertsStateFilter>();
    public from = input.required<string>();
    public to = input.required<string>();
    protected result!: CustomAlertsStateHistory;

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

        this.subscriptions.add(this.CustomalertRulesService.getHistory(this.params())
            .subscribe((result: CustomAlertsStateHistory) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }


    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params().sort = sort.active;
            this.params().direction = sort.direction;
            this.load();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params().page = change.page;
        this.params().scroll = change.scroll;
        this.load();
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
