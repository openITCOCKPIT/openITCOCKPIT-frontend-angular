import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { getStatuslogParams, StatuslogParams, StatuslogResponse } from '../resources.interface';
import { ResourcesService } from '../resources.service';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { NgClass } from '@angular/common';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-resources-statuslog',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    BlockLoaderComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    NoRecordsComponent,
    XsButtonDirective,
    NgClass,
    ColComponent,
    PaginateOrScrollComponent,
    RowComponent,
    BackButtonDirective
],
    templateUrl: './resources-statuslog.component.html',
    styleUrl: './resources-statuslog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesStatuslogComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly ResourcesService = inject(ResourcesService);
    public statuslog!: StatuslogResponse;
    private cdr = inject(ChangeDetectorRef);
    public params: StatuslogParams = getStatuslogParams();
    private resourceId: number = 0;


    public ngOnInit(): void {
        this.resourceId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public load() {
        this.subscriptions.add(this.ResourcesService.getStatuslog(this.resourceId, this.params)
            .subscribe((result) => {
                this.statuslog = result;
                this.cdr.markForCheck();
            })
        );
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onFilterChange(event: Event): void {
    }

    public onMassActionComplete(success: boolean): void {
    }

    public onPaginatorChange(statuslog: PaginatorChangeEvent): void {
        this.params.page = statuslog.page;
        this.params.scroll = statuslog.scroll;
        this.load();
    }


    public onSortChange(sort: Sort): void {
    }

    public resetFilter(): void {
    }

    public toggleFilter(): void {
    }

    protected readonly status = status;
}
