import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
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
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { forkJoin, Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { PackagesLinuxParams, PackagesLinuxRoot, PackagesTotalSummary } from '../packages.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
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
        TemplateIdDirective,
        WidgetStatFComponent,
        TextColorDirective,
        TranslocoPipe,
        TableDirective,
        BadgeOutlineComponent,
        BlockLoaderComponent,
        LocalNumberPipe,
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
        ReactiveFormsModule
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

    protected hideFilter: boolean = true;
    public isLoading: boolean = true;
    public params: PackagesLinuxParams = this.getDefaultPackagesLinuxParams();
    public packages?: PackagesLinuxRoot;
    public summary?: PackagesTotalSummary;

    public filterAvailableUpdates = false;
    public filterAvailableSecurityUpdates = false;

    public packageLinuxStatus: string[] = [
        'success',
        'warning',
        'danger'
    ];

    ngOnInit(): void {
        this.load();
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


        let request = {
            packages: this.PackagesService.getPackages(this.params),
            summary: this.PackagesService.getSummary()
        };

        forkJoin(request).subscribe(
            (result) => {
                this.packages = result.packages;
                this.summary = result.summary;

                this.isLoading = false;
                this.cdr.markForCheck();
            });
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
