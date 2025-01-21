import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { IsarFlowHostsService } from '../isar-flow-hosts.service';
import {
    getDefaultIsarflowHostsIndexParams,
    IsarflowHostsIndexParams,
    IsarflowHostsIndexRoot
} from '../isarflow-hosts.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { HostBrowserTabs } from '../../../../../pages/hosts/hosts.enum';

@Component({
    selector: 'oitc-isar-flow-hosts-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NgIf,
        ReactiveFormsModule,
        RowComponent,
        TableLoaderComponent,
        TranslocoPipe,
        CardFooterComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        TableDirective,
        AsyncPipe,
        ActionsButtonComponent,
        ActionsButtonElementComponent
    ],
    templateUrl: './isar-flow-hosts-index.component.html',
    styleUrl: './isar-flow-hosts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsarFlowHostsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: IsarflowHostsIndexParams = getDefaultIsarflowHostsIndexParams()
    public isarflowHosts?: IsarflowHostsIndexRoot;
    public hideFilter: boolean = true;

    public readonly PermissionsService = inject(PermissionsService);

    private readonly subscriptions: Subscription = new Subscription();
    private readonly IsarFlowHostsService = inject(IsarFlowHostsService)
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.load();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.IsarFlowHostsService.getIndex(this.params).subscribe(result => {
            this.isarflowHosts = result;
            this.cdr.markForCheck();
        }));
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultIsarflowHostsIndexParams();
        this.load();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    protected readonly HostBrowserTabs = HostBrowserTabs;
}
