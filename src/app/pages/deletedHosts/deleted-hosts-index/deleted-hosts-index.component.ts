import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';


import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormCheckInputDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../directives/debounce.directive';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';


import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Subscription } from 'rxjs';
import {
    DeletedHostsIndexParams,
    DeletedHostsIndexRoot,
    getDefaultDeletedHostsIndexParams
} from '../deleted-hosts.interface';
import { DeletedHostsService } from '../deleted-hosts.service';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-deleted-hosts-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
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
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    TableLoaderComponent,
    RegexHelperTooltipComponent,
    FormCheckInputDirective
],
    templateUrl: './deleted-hosts-index.component.html',
    styleUrl: './deleted-hosts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletedHostsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: DeletedHostsIndexParams = getDefaultDeletedHostsIndexParams();
    public deletedHosts?: DeletedHostsIndexRoot;
    public hideFilter: boolean = true;

    private readonly DeletedHostsService = inject(DeletedHostsService);
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.DeletedHostsService.getIndex(this.params)
            .subscribe((result) => {
                this.deletedHosts = result;
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

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public resetFilter() {
        this.params = getDefaultDeletedHostsIndexParams();
        this.load();
    }

    public onMassActionComplete(success: boolean) {
    }

}
