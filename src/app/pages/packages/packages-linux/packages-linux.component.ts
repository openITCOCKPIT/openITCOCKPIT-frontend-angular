import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import { PackagesLinuxParams, PackagesLinuxRoot } from '../packages.interface';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AsyncPipe } from '@angular/common';
import { PermissionsService } from '../../../permissions/permissions.service';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PackagesOsTabsComponent } from '../packages-os-tabs/packages-os-tabs.component';
import { PackagesSummaryComponent } from '../packages-summary/packages-summary.component';

@Component({
    selector: 'oitc-packages-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        RowComponent,
        TextColorDirective,
        TranslocoPipe,
        TableDirective,
        BadgeOutlineComponent,
        NoRecordsComponent,
        ContainerComponent,
        PaginateOrScrollComponent,
        MatSort,
        MatSortHeader,
        TableLoaderComponent,
        NavItemComponent,
        NavComponent,
        XsButtonDirective,
        AsyncPipe,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        PackagesOsTabsComponent,
        PackagesSummaryComponent
    ],
    templateUrl: './packages-linux.component.html',
    styleUrl: './packages-linux.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackagesLinuxComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected hideFilter: boolean = true;
    public isLoading: boolean = true;
    public params: PackagesLinuxParams = this.getDefaultPackagesLinuxParams();
    public packages?: PackagesLinuxRoot;

    public filterAvailableUpdates = false;
    public filterAvailableSecurityUpdates = false;

    public packageLinuxStatus: string[] = [
        'success',
        'warning',
        'danger'
    ];

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            // //a/packages/linux?lpid=161&lpid=162
            let linuxPackageId = params['lpid']
            if (linuxPackageId) {
                this.params['filter[PackagesLinux.id][]'] = [].concat(linuxPackageId); // make sure we always get an array
            }

            let availableUpdates = params['filter[available_updates]'];
            if (availableUpdates) {
                this.filterAvailableUpdates = true;
                this.filterAvailableSecurityUpdates = false;
            }
            let availableSecurityUpdates = params['filter[available_security_updates]'];
            if (availableSecurityUpdates) {
                this.filterAvailableUpdates = false;
                this.filterAvailableSecurityUpdates = true;
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
            this.PackagesService.getPackages(this.params).subscribe((packages) => {
                this.packages = packages;
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
        this.filterAvailableUpdates = false;
        this.filterAvailableSecurityUpdates = false;
        this.params = this.getDefaultPackagesLinuxParams();
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

    public getDefaultPackagesLinuxParams(): PackagesLinuxParams {
        this.filterAvailableUpdates = false;
        this.filterAvailableSecurityUpdates = false;
        return {
            angular: true,
            scroll: true,
            sort: 'PackagesLinux.name',
            page: 1,
            direction: 'asc',
            'filter[PackagesLinux.id][]': [],
            'filter[PackagesLinux.name]': '',
            'filter[PackagesLinux.description]': '',
            'filter[available_updates]': '',
            'filter[available_security_updates]': ''
        }
    }


    protected readonly String = String;
}
