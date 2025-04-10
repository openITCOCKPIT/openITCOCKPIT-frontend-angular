import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
    HostBrowserMenuConfig,
    HostsBrowserMenuComponent
} from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { getHostStateForApi, HostNotificationsStateFilter } from '../../notifications/notifications.interface';
import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { StatehistoryService } from '../statehistory.service';
import {
    getDefaultStatehistoryHostParams,
    StatehistoriesHostRoot,
    StatehistoryHostParams
} from '../statehistories.interface';

@Component({
    selector: 'oitc-statehistories-host',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HostsBrowserMenuComponent,
        HoststatusSimpleIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        TrustAsHtmlPipe,
        XsButtonDirective,
        NgClass,
        CardFooterComponent
    ],
    templateUrl: './statehistories-host.component.html',
    styleUrl: './statehistories-host.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatehistoriesHostComponent implements OnInit, OnDestroy {
    private hostId: number = 0;
    private StatehistoryService = inject(StatehistoryService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public params: StatehistoryHostParams = getDefaultStatehistoryHostParams();
    public stateFilter: HostNotificationsStateFilter = {
        recovery: false,
        down: false,
        unreachable: false
    };

    public state_typesFilter = {
        soft: false,
        hard: false
    };

    public hoststatehistories?: StatehistoriesHostRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public hostBrowserConfig?: HostBrowserMenuConfig;

    public ngOnInit(): void {
        this.hostId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadHoststatehistories();

        // Define the configuration for the HostBrowserMenuComponent because we know the hostId now
        this.hostBrowserConfig = {
            hostId: this.hostId,
            showReschedulingButton: false,
            showBackButton: true
        };
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHoststatehistories() {
        this.params['filter[StatehistoryHosts.state][]'] = getHostStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }
        this.params['filter[StatehistoryHosts.state_type]'] = state_type;


        this.subscriptions.add(this.StatehistoryService.getStatehistoryHost(this.hostId, this.params)
            .subscribe((result) => {
                this.hoststatehistories = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultStatehistoryHostParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.stateFilter = {
            recovery: false,
            down: false,
            unreachable: false
        };
        this.loadHoststatehistories();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHoststatehistories();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadHoststatehistories();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHoststatehistories();
        }
    }
}
