import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
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
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { isActive, RouterLink } from '@angular/router';
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
import { formatDate, NgClass } from '@angular/common';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { HostBrowserTabs } from '../../../../../pages/hosts/hosts.enum';
import {
    CustomalertsRulesHistoryComponent
} from '../../../components/customalerts-rules-history/customalerts-rules-history.component';

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
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RowComponent,
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
        MultiSelectComponent,
        NgClass,
        CustomalertsRulesHistoryComponent
    ],
    templateUrl: './customalert-rules-history-overview.component.html',
    styleUrl: './customalert-rules-history-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomalertRulesHistoryOverviewComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected params: CustomAlertRulesHistoryParams = getDefaultCustomAlertRulesHistoryParams();
    protected result?: CustomAlertsStateHistory;
    protected hideFilter: boolean = true;

    public from: string = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to: string = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public tabs = {
        history: 'history',
        status_distribution: 'status_distribution'
    };

    public selectedTab = this.tabs.history;

    protected customAlertRules: SelectKeyValue[] = [];

    protected stateFilter: CustomAlertsIndexCustomAlertsStateFilter = {
        [CustomAlertsState.New]: false,
        [CustomAlertsState.InProgress]: false,
        [CustomAlertsState.Done]: false,
        [CustomAlertsState.ManuallyClosed]: false
    };

    @ViewChild(CustomalertsRulesHistoryComponent) CustomalertsRulesHistoryComponent!: CustomalertsRulesHistoryComponent;

    public ngOnInit(): void {
        this.loadCustomalertRules();

    }

    public loadCustomalertRules = (): void => {
        this.subscriptions.add(this.CustomAlertRulesService.loadCustomalertRules()
            .subscribe((result: SelectKeyValue[]) => {
                this.customAlertRules = result;
                this.cdr.markForCheck();
            }));
    }

    protected load() {
        console.log('Refresh right tab !!!');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: any): void {
        this.params.page = 1;
        this.CustomalertsRulesHistoryComponent.load();
    }


    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.CustomalertsRulesHistoryComponent.load();
    }

    public resetFilter() {
        this.stateFilter = {
            [CustomAlertsState.New]: false,
            [CustomAlertsState.InProgress]: false,
            [CustomAlertsState.Done]: false,
            [CustomAlertsState.ManuallyClosed]: false
        };
        this.params = getDefaultCustomAlertRulesHistoryParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.CustomalertsRulesHistoryComponent.load();

    }

    public onMassActionComplete() {
    }

    public changeTab(newTab: string): void {
        this.selectedTab = newTab;
    }

    public onSortChange(sort: Sort) {
    }

    protected readonly CustomAlertsState = CustomAlertsState;
    protected readonly String = String;
}
