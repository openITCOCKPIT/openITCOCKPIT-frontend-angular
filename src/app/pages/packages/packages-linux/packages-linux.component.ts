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
    RowComponent,
    TabDirective,
    TableDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';
import { forkJoin, Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import {
    getDefaultPackagesLinuxParams,
    PackagesLinuxParams,
    PackagesLinuxRoot,
    PackagesLinuxSummary
} from '../packages.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';

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
        TabsComponent,
        TabsListComponent,
        TabDirective,
        TabsContentComponent,
        TabPanelComponent,
        BlockLoaderComponent
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
    protected hideFilter: boolean = true;
    public isLoading: boolean = true;
    public params: PackagesLinuxParams = getDefaultPackagesLinuxParams();
    public packages?: PackagesLinuxRoot;
    public summary?: PackagesLinuxSummary;

    ngOnInit(): void {
        this.load();
    }

    public load() {
        let request = {
            packages: this.PackagesService.getPackages(this.params),
            summary: this.PackagesService.getSummary()
        };

        forkJoin(request).subscribe(
            (result) => {
                this.packages = result.packages;
                this.summary = result.summary
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
        //this.params.page = 1;
        //this.refresh();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        //this.params.page = change.page;
        //this.params.scroll = change.scroll;
        //this.refresh();
    }

    public resetFilter() {
        //this.filter = getDefaultCustomAlertsIndexFilter();
        this.refresh();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            //this.params.sort = sort.active;
            //this.params.direction = sort.direction;
            this.refresh();
        }
    }

    protected refresh(): void {
        this.cdr.markForCheck();
    }
}
