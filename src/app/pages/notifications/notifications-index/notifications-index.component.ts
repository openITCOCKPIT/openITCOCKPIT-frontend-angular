import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../notifications.service';

import {
    getDefaultNotificationsIndexParams,
    getHostNotificationStateForApi,
    HostNotificationsStateFilter,
    NotificationIndexParams,
    NotificationIndexRoot
} from '../notifications.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { formatDate, NgForOf, NgIf } from '@angular/common';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';

@Component({
    selector: 'oitc-notifications-index',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ColComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RowComponent,
        TranslocoPipe,
        TrueFalseDirective,
        MatSort,
        MatSortHeader,
        NgIf,
        TableDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        ItemSelectComponent,
        NgForOf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        HoststatusSimpleIconComponent,
        ContainerComponent,
        TableLoaderComponent
    ],
    templateUrl: './notifications-index.component.html',
    styleUrl: './notifications-index.component.css'
})
export class NotificationsIndexComponent implements OnInit, OnDestroy {
    private NotificationsService = inject(NotificationsService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: NotificationIndexParams = getDefaultNotificationsIndexParams();
    public stateFilter: HostNotificationsStateFilter = {
        recovery: false,
        down: false,
        unreachable: false
    };
    public notifications?: NotificationIndexRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadNotifications();
        }));
    }

    public ngOnDestroy(): void {
    }


    public loadNotifications() {
        this.params['filter[NotificationHosts.state][]'] = getHostNotificationStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.subscriptions.add(this.NotificationsService.getIndex(this.params)
            .subscribe((result) => {
                this.notifications = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultNotificationsIndexParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.stateFilter = {
            recovery: false,
            down: false,
            unreachable: false
        };
        this.loadNotifications();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadNotifications();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadNotifications();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadNotifications();
        }
    }

}
