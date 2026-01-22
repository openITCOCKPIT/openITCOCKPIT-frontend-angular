import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
import { TranslocoDirective } from '@jsverse/transloco';
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
        XsButtonDirective
    ],
    templateUrl: './packages-view-linux.component.html',
    styleUrl: './packages-view-linux.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesViewLinuxComponent implements OnInit, OnDestroy {

    public package?: PackagesViewLinuxRoot;
    public params: PackagesViewLinuxParams = getDefaultPackagesViewLinuxParams()

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
        this.subscriptions.add(
            this.PackagesService.getViewLinux(this.id, this.params).subscribe((response) => {
                this.package = response;
                this.cdr.markForCheck();
            })
        );
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

    protected readonly String = String;
}
