import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    RowComponent,
    TableDirective,
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { IndexPage } from '../../../pages.interface';
import {
    getDefaultPatchstatusIndexParams,
    PatchstatusIndexParams,
    PatchstatusIndexRoot
} from '../patchstatus.interface';
import { Subscription } from 'rxjs';
import { PatchstatusService } from '../patchstatus.service';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { AsyncPipe } from '@angular/common';
import { PermissionsService } from '../../../permissions/permissions.service';
import { PatchstatusIconComponent } from '../patchstatus-icon/patchstatus-icon.component';

@Component({
    selector: 'oitc-patchstatus-index',
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
        TranslocoPipe,
        WidgetStatFComponent,
        TextColorDirective,
        BlockLoaderComponent,
        LocalNumberPipe,
        ContainerComponent,
        MatSort,
        MatSortHeader,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        TableDirective,
        TableLoaderComponent,
        BadgeOutlineComponent,
        AsyncPipe,
        PatchstatusIconComponent
    ],
    templateUrl: './patchstatus-index.component.html',
    styleUrl: './patchstatus-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatchstatusIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: PatchstatusIndexParams = getDefaultPatchstatusIndexParams();
    public patchstatus?: PatchstatusIndexRoot;
    public hideFilter: boolean = true;
    public readonly PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private readonly PatchstatusService = inject(PatchstatusService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadPatchstatus();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadPatchstatus(): void {

        this.subscriptions.add(
            this.PatchstatusService.getIndex(this.params).subscribe((patchstatus) => {
                this.patchstatus = patchstatus;
                this.cdr.markForCheck();
            })
        );
    }


    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadPatchstatus();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadPatchstatus();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadPatchstatus();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadPatchstatus();
        }
    }

    public resetFilter() {
        this.params = getDefaultPatchstatusIndexParams();
        this.loadPatchstatus();
    }

    protected readonly String = String;
    protected readonly Boolean = Boolean;
}
