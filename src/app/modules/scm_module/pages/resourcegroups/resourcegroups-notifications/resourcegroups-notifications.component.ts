import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    getNotificationReasonTypesForApi,
    getResourcegroupsNotificationsParams,
    Resourcegroup,
    ResourcegroupNotificationReasonTypes,
    ResourcegroupsNotifications,
    ResourcegroupsNotificationsParams
} from '../resourcegroups.interface';
import { ResourcegroupsService } from '../resourcegroups.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    BadgeComponent,
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
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { formatDate } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ScmNotificationLogRecipientTypesEnum, ScmNotificationLogTypesEnum } from './scm-notification-log-types.enum';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';

@Component({
    selector: 'oitc-resourcegroups-notifications',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    FaIconComponent,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    TableDirective,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    TableLoaderComponent,
    MatSort,
    MatSortHeader,
    TranslocoPipe,
    LabelLinkComponent,
    BadgeComponent,
    ColComponent,
    DebounceDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    PaginateOrScrollComponent,
    NoRecordsComponent,
    FaLayersComponent
],
    templateUrl: './resourcegroups-notifications.component.html',
    styleUrl: './resourcegroups-notifications.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsNotificationsComponent implements OnInit, OnDestroy, IndexPage {
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public hideFilter: boolean = true;
    public params: ResourcegroupsNotificationsParams = getResourcegroupsNotificationsParams();
    public notifications!: ResourcegroupsNotifications;
    public resourcegroup!: Resourcegroup;
    private readonly ResourcegroupsService = inject(ResourcegroupsService);
    private cdr = inject(ChangeDetectorRef);
    private resourcegroupId: number = 0;
    protected readonly ScmNotificationLogTypesEnum = ScmNotificationLogTypesEnum;
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public notificationReasonTypeFilter: ResourcegroupNotificationReasonTypes = {
        reminder: 0,
        escalation: 0,
        status_report: 0,
        cumulative_status_report: 0
    };


    public ngOnInit(): void {
        this.resourcegroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.load();
        }));
    }

    public load() {
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[ScmNotificationsLog.reason_type][]'] = getNotificationReasonTypesForApi(this.notificationReasonTypeFilter);

        this.subscriptions.add(this.ResourcegroupsService.getNotifications(this.resourcegroupId, this.params)
            .subscribe((result) => {
                this.notifications = result;
                this.resourcegroup = result.resourcegroup;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public onPaginatorChange(resourcegroup: PaginatorChangeEvent): void {
        this.params.page = resourcegroup.page;
        this.params.scroll = resourcegroup.scroll;
        this.load();
    }

    public onFilterChange($event: any) {
        this.params.page = 1;
        this.load();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getResourcegroupsNotificationsParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.notificationReasonTypeFilter = {
            reminder: 0,
            escalation: 0,
            status_report: 0,
            cumulative_status_report: 0
        };
        this.load();
    }

    public onMassActionComplete(success: boolean): void {
    }

    protected readonly ScmNotificationLogRecipientTypesEnum = ScmNotificationLogRecipientTypesEnum;
}
