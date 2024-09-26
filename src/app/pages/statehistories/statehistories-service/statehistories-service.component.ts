import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
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
import {
    ServiceBrowserMenuConfig,
    ServicesBrowserMenuComponent
} from '../../services/services-browser-menu/services-browser-menu.component';
import {
    ServicestatusSimpleIconComponent
} from '../../services/servicestatus-simple-icon/servicestatus-simple-icon.component';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { StatehistoryService } from '../statehistory.service';
import {
    getDefaultStatehistoryServiceParams,
    StatehistoriesServiceRoot,
    StatehistoryServiceParams
} from '../statehistories.interface';
import { getServiceStateForApi, ServiceNotificationsStateFilter } from '../../notifications/notifications.interface';

@Component({
    selector: 'oitc-statehistories-service',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
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
        ServicesBrowserMenuComponent,
        ServicestatusSimpleIconComponent,
        NgClass,
        CardFooterComponent
    ],
    templateUrl: './statehistories-service.component.html',
    styleUrl: './statehistories-service.component.css'
})
export class StatehistoriesServiceComponent implements OnInit, OnDestroy {
    private serviceId: number = 0;
    private StatehistoryService = inject(StatehistoryService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public params: StatehistoryServiceParams = getDefaultStatehistoryServiceParams();
    public stateFilter: ServiceNotificationsStateFilter = {
        ok: false,
        warning: false,
        unknown: false,
        critical: false
    };

    public state_typesFilter = {
        soft: false,
        hard: false
    };

    public servicestatehistories?: StatehistoriesServiceRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public serviceBrowserConfig?: ServiceBrowserMenuConfig;

    public ngOnInit(): void {
        this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadServicestatehistories();

        // Define the configuration for the ServiceBrowserMenuComponent because we know the serviceId now
        this.serviceBrowserConfig = {
            serviceId: this.serviceId,
            showReschedulingButton: false,
            showBackButton: true
        };

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadServicestatehistories() {
        this.params['filter[StatehistoryServices.state][]'] = getServiceStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }
        this.params['filter[StatehistoryServices.state_type]'] = state_type;


        this.subscriptions.add(this.StatehistoryService.getStatehistoryService(this.serviceId, this.params)
            .subscribe((result) => {
                this.servicestatehistories = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultStatehistoryServiceParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.stateFilter = {
            ok: false,
            warning: false,
            unknown: false,
            critical: false
        };
        this.loadServicestatehistories();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServicestatehistories();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadServicestatehistories();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadServicestatehistories();
        }
    }
}
