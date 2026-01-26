import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
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
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    getDefaultPackagesMacosAppParams,
    PackagesMacosAppParams,
    PackagesViewMacosAppRoot
} from '../packages.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-packages-view-macos-app',
    imports: [
        AsyncPipe,
        BackButtonDirective,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CopyToClipboardComponent,
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
        RowComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        TextColorDirective
    ],
    templateUrl: './packages-view-macos-app.component.html',
    styleUrl: './packages-view-macos-app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesViewMacosAppComponent implements OnInit, OnDestroy {

    public app?: PackagesViewMacosAppRoot;
    public params: PackagesMacosAppParams = getDefaultPackagesMacosAppParams()
    public hideFilter: boolean = true;

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
            this.loadMacosAppView();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadMacosAppView() {
        this.subscriptions.add(
            this.PackagesService.getViewMacosApp(this.id, this.params).subscribe((response) => {
                this.app = response;
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
        this.loadMacosAppView();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadMacosAppView();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadMacosAppView();
    }

    public resetFilter() {
        this.params = getDefaultPackagesMacosAppParams();

        this.loadMacosAppView();
    }

}
