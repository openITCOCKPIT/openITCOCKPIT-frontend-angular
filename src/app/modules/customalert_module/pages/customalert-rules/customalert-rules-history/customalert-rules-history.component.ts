import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import {
    CustomAlertRulesHistoryParams,
    CustomAlertsStateHistory,
    getDefaultCustomAlertRulesHistoryParams
} from '../customalert-rules.interface';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { CustomalertRulesService } from '../customalert-rules.service';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { CustomAlertsIndexCustomAlertsStateFilter, CustomAlertsState } from '../../customalerts/customalerts.interface';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { formatDate } from '@angular/common';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-customalert-rules-history',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        FaIconComponent,
        FormDirective,
        FormsModule,
        MatSort,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        MatSortHeader,
        LabelLinkComponent,
        MultiSelectComponent
    ],
    templateUrl: './customalert-rules-history.component.html',
    styleUrl: './customalert-rules-history.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomalertRulesHistoryComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected params: CustomAlertRulesHistoryParams = getDefaultCustomAlertRulesHistoryParams();
    protected result?: CustomAlertsStateHistory;
    protected hideFilter: boolean = true;

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    protected customAlertRules: SelectKeyValue[] = [];

    protected stateFilter: CustomAlertsIndexCustomAlertsStateFilter = {
        [CustomAlertsState.New]: false,
        [CustomAlertsState.InProgress]: false,
        [CustomAlertsState.Done]: false,
        [CustomAlertsState.ManuallyClosed]: false
    };

    public ngOnInit(): void {
        this.loadCustomalertRules();
        this.load();
    }

    public loadCustomalertRules = (): void => {
        this.subscriptions.add(this.CustomAlertRulesService.loadCustomalertRules()
            .subscribe((result: SelectKeyValue[]) => {
                this.customAlertRules = result;
                this.cdr.markForCheck();
            }));
    }

    protected load(): void {
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[CustomalertStatehistory.state][]'] = [];
        if (this.stateFilter[CustomAlertsState.New]) {
            this.params['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.New);
        }
        if (this.stateFilter[CustomAlertsState.InProgress]) {
            this.params['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.InProgress);
        }
        if (this.stateFilter[CustomAlertsState.Done]) {
            this.params['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.Done);
        }
        if (this.stateFilter[CustomAlertsState.ManuallyClosed]) {
            this.params['filter[CustomalertStatehistory.state][]'].push(CustomAlertsState.ManuallyClosed);
        }

        this.subscriptions.add(this.CustomAlertRulesService.getHistory(this.params)
            .subscribe((result: CustomAlertsStateHistory) => {
                this.result = result;
                this.cdr.markForCheck();
            }));

    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: any) {
        this.params.page = 1;
        this.load();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public resetFilter() {
        this.params = getDefaultCustomAlertRulesHistoryParams();
        this.load();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public toggleDeleteAllModal(): void {
    }

    public onMassActionComplete() {
    }

    protected readonly CustomAlertsState = CustomAlertsState;
}
