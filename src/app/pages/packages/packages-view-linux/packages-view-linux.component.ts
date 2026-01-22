import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    getDefaultPackagesViewLinuxParams,
    PackagesViewLinuxParams,
    PackagesViewLinuxRoot
} from '../packages.interface';
import { PackagesService } from '../packages.service';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { AsyncPipe } from '@angular/common';
import { PermissionsService } from '../../../permissions/permissions.service';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';

@Component({
    selector: 'oitc-packages-view-linux',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        ColComponent,
        RowComponent,
        TemplateIdDirective,
        WidgetStatFComponent,
        TextColorDirective,
        MatSort,
        MatSortHeader,
        TableDirective,
        AsyncPipe,
        BadgeOutlineComponent,
        ContainerComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        BlockLoaderComponent,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
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
        TranslocoPipe,
        CopyToClipboardComponent
    ],
    templateUrl: './packages-view-linux.component.html',
    styleUrl: './packages-view-linux.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesViewLinuxComponent implements OnInit, OnDestroy {

    public package?: PackagesViewLinuxRoot;
    public params: PackagesViewLinuxParams = getDefaultPackagesViewLinuxParams()
    public hideFilter: boolean = true;

    public filterAvailableUpdates = false;
    public filterAvailableSecurityUpdates = false;

    private subscriptions: Subscription = new Subscription();
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);
    public id: number = 0;

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadPackageLinuxView();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadPackageLinuxView() {
        if (this.params['filter[PackagesLinuxHosts.available_version]'] !== '') {
            // If the user wants to filter by available version
            // we only want to show packages that have not been updated yet
            // to avoid confusion
            this.filterAvailableUpdates = true;
        }

        this.params['filter[PackagesLinuxHosts.needs_update]'] = '';
        this.params['filter[PackagesLinuxHosts.is_security_update]'] = '';
        if (this.filterAvailableUpdates) {
            this.params['filter[PackagesLinuxHosts.needs_update]'] = true;
        }
        if (this.filterAvailableSecurityUpdates) {
            this.params['filter[PackagesLinuxHosts.is_security_update]'] = true;
        }

        this.subscriptions.add(
            this.PackagesService.getViewLinux(this.id, this.params).subscribe((response) => {
                this.package = response;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadPackageLinuxView();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadPackageLinuxView();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadPackageLinuxView();
    }

    public resetFilter() {
        this.params = getDefaultPackagesViewLinuxParams();
        this.filterAvailableUpdates = false;
        this.filterAvailableSecurityUpdates = false;

        this.loadPackageLinuxView();
    }

    protected readonly String = String;
}
