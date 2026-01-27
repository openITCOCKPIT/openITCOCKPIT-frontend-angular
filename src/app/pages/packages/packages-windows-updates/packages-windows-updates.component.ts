import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { PackagesOsTabsComponent } from '../packages-os-tabs/packages-os-tabs.component';
import { PackagesSummaryComponent } from '../packages-summary/packages-summary.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { IndexPage } from '../../../pages.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    getDefaultPackagesWindowsUpdatesParams,
    PackagesWindowsUpdatesParams,
    PackagesWindowsUpdatesRoot
} from '../packages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { update } from 'lodash';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';

@Component({
    selector: 'oitc-packages-windows-updates',
    imports: [
        AsyncPipe,
        BadgeOutlineComponent,
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
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PackagesOsTabsComponent,
        PackagesSummaryComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        CopyToClipboardComponent
    ],
    templateUrl: './packages-windows-updates.component.html',
    styleUrl: './packages-windows-updates.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesWindowsUpdatesComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected hideFilter: boolean = true;
    public isLoading: boolean = true;
    public params: PackagesWindowsUpdatesParams = getDefaultPackagesWindowsUpdatesParams()
    public updates?: PackagesWindowsUpdatesRoot;

    public filterAvailableUpdates = false;
    public filterAvailableSecurityUpdates = false;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            // //a/packages/windows?uid=161&uid=162
            let updateId = params['uid']
            if (updateId) {
                this.params['filter[WindowsUpdates.id][]'] = [].concat(updateId); // make sure we always get an array
            }

            this.load();
        }));
    }

    public load() {

        this.params['filter[available_updates]'] = '';
        this.params['filter[available_security_updates]'] = '';
        if (this.filterAvailableUpdates) {
            this.params['filter[available_updates]'] = 1;
        }
        if (this.filterAvailableSecurityUpdates) {
            this.params['filter[available_security_updates]'] = 1;
        }

        this.subscriptions.add(
            this.PackagesService.getWindowsUpdates(this.params).subscribe((response) => {
                this.updates = response;
                this.cdr.markForCheck();
            })
        );
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onMassActionComplete(success: boolean): void {
    }


    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
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
        this.params = getDefaultPackagesWindowsUpdatesParams();
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


    protected readonly String = String;
    protected readonly update = update;
}
