import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../slas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { getDefaultSlasHostsParams, SlasHostsParams, SlasHostsRoot } from '../slas.interface';
import {
    AlertComponent,
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

import { DebounceDirective } from '../../../../../directives/debounce.directive';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-slas-hosts',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DebounceDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    MatSort,
    MatSortHeader,
    NavComponent,
    NavItemComponent,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    BackButtonDirective,
    AlertComponent,
    AsyncPipe
],
    templateUrl: './slas-hosts.component.html',
    styleUrl: './slas-hosts.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: SlasService} // Inject the ContactsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasHostsComponent implements OnInit, OnDestroy {

    private readonly SlasService: SlasService = inject(SlasService);
    public PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public hideFilter: boolean = true;

    public slaAndHosts?: SlasHostsRoot;
    public params: SlasHostsParams = getDefaultSlasHostsParams();
    protected slaId: number = 0;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.cdr.markForCheck();
        this.loadSlaHosts();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadSlaHosts() {
        this.subscriptions.add(this.SlasService.getSlaHosts(this.slaId, this.params)
            .subscribe((result: SlasHostsRoot) => {
                this.slaAndHosts = result;
                this.cdr.markForCheck();
            }));

    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultSlasHostsParams();
        this.loadSlaHosts();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadSlaHosts();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadSlaHosts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadSlaHosts();
        }
    }
}
