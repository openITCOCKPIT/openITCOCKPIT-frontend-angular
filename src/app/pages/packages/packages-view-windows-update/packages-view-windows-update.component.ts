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
    getDefaultPackagesViewWindowsUpdateParams,
    PackagesViewWindowsUpdateParams,
    PackagesViewWindowsUpdateRoot
} from '../packages.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-packages-view-windows-update',
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
        TextColorDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        BadgeOutlineComponent
    ],
    templateUrl: './packages-view-windows-update.component.html',
    styleUrl: './packages-view-windows-update.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesViewWindowsUpdateComponent implements OnInit, OnDestroy {
    public update?: PackagesViewWindowsUpdateRoot;
    public params: PackagesViewWindowsUpdateParams = getDefaultPackagesViewWindowsUpdateParams()
    public hideFilter: boolean = true;

    public filterRebootRequired = false;
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
            this.loadWindowsUpdateView();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadWindowsUpdateView() {

        this.params['filter[WindowsUpdatesHosts.reboot_required]'] = '';
        this.params['filter[WindowsUpdatesHosts.is_security_update]'] = '';
        if (this.filterRebootRequired) {
            this.params['filter[WindowsUpdatesHosts.reboot_required]'] = 1;
        }
        if (this.filterAvailableSecurityUpdates) {
            this.params['filter[WindowsUpdatesHosts.is_security_update]'] = 1;
        }

        this.subscriptions.add(
            this.PackagesService.getViewWindowsUpdate(this.id, this.params).subscribe((response) => {
                this.update = response;
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
        this.loadWindowsUpdateView();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadWindowsUpdateView();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadWindowsUpdateView();
    }

    public resetFilter() {
        this.params = getDefaultPackagesViewWindowsUpdateParams();
        this.filterRebootRequired = false;
        this.filterAvailableSecurityUpdates = false;

        this.loadWindowsUpdateView();
    }

}
