import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PackagesSummaryComponent } from '../packages-summary/packages-summary.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { PackagesOsTabsComponent } from '../packages-os-tabs/packages-os-tabs.component';
import {
    getDefaultPackagesWindowsAppsParams,
    PackagesWindowsAppsParams,
    PackagesWindowsAppsRoot
} from '../packages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { AsyncPipe } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-packages-windows',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PackagesSummaryComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        PackagesOsTabsComponent,
        TableLoaderComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        ColComponent,
        ContainerComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        RowComponent,
        AsyncPipe,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    templateUrl: './packages-windows.component.html',
    styleUrl: './packages-windows.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesWindowsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);

    public result?: PackagesWindowsAppsRoot;
    public params: PackagesWindowsAppsParams = getDefaultPackagesWindowsAppsParams();


    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected hideFilter: boolean = true;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            // //a/packages/windows?id=161&id=162
            let appId = params['id']
            if (appId) {
                //this.params['filter[PackagesLinux.id][]'] = [].concat(linuxPackageId); // make sure we always get an array
            }

            this.load();
        }));
    }

    public load() {
        this.subscriptions.add(
            this.PackagesService.getWindowsApps(this.params).subscribe((apps) => {
                this.result = apps;
                this.cdr.markForCheck();
            })
        );
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
        this.params = getDefaultPackagesWindowsAppsParams();
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


    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


}
