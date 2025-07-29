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


import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import {
    HostBrowserMenuConfig,
    HostsBrowserMenuComponent
} from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { NotificationReasonTypeComponent } from '../notification-reason-type/notification-reason-type.component';

@Component({
    selector: 'oitc-host-notification',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
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
        NgForOf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        HoststatusSimpleIconComponent,
        ContainerComponent,
        TableLoaderComponent,
        HostsBrowserMenuComponent,
        CardFooterComponent,
        NotificationReasonTypeComponent
    ],
    templateUrl: './host-notification.component.html',
    styleUrl: './host-notification.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostNotificationComponent implements OnInit, OnDestroy {
    private hostId: number = 0;
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

    public hostBrowserConfig?: HostBrowserMenuConfig;

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.hostId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadNotifications();

        // Define the configuration for the HostBrowserMenuComponent because we know the hostId now
        this.hostBrowserConfig = {
            hostId: this.hostId,
            showReschedulingButton: false,
            showBackButton: true
        };
        this.cdr.markForCheck();

    }

    public ngOnDestroy(): void {
    }


    public loadNotifications() {
        this.params['filter[NotificationHosts.state][]'] = getHostNotificationStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.subscriptions.add(this.NotificationsService.getHostNotifications(this.hostId, this.params)
            .subscribe((result) => {
                this.notifications = result;
                this.cdr.markForCheck();
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
