import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent, TableDirective,
} from "@coreui/angular";
import { Subscription } from 'rxjs';

import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterbookmarkAllocationsService } from '../filterbookmark-allocations.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { IndexPage } from '../../../pages.interface';
import {
    FilterbookmarkAllocationsIndex,
    FilterbookmarkAllocationWithUsersAndUsergroups,
    getDefaultFilterbookmarkAllocationsIndexParams,
    FilterbookmarkAllocationsIndexParams
} from '../filterbookmark-allocations.interface';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { getDefaultTabAllocationsIndexParams } from '../../dashboardallocations/dashboard-allocations.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';

@Component({
    selector: 'oitc-filterbookmark-allocations-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        TableLoaderComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        NoRecordsComponent,
        ColComponent,
        ContainerComponent,
        RowComponent,
        SelectAllComponent,
        PaginateOrScrollComponent,
        DeleteAllModalComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    templateUrl: './filterbookmark-allocations-index.component.html',
    styleUrl: './filterbookmark-allocations-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: FilterbookmarkAllocationsService} // Inject the DashboardAllocationsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterbookmarkAllocationsIndexComponent implements OnInit, OnDestroy {


    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private FilterbookmarkAllocationsService = inject(FilterbookmarkAllocationsService)
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private cdr = inject(ChangeDetectorRef);

    public params: FilterbookmarkAllocationsIndexParams = getDefaultFilterbookmarkAllocationsIndexParams();
    public FilterbookmarkAllocations?: FilterbookmarkAllocationsIndex;
    public selectedItems: DeleteAllItem[] = [];
    public hideFilter: boolean = true;

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[FilterBookmarkAllocations.id][]'] = [].concat(id); // make sure we always get an array
                this.cdr.markForCheck();
            }
            this.loadBookmarkAllocations();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadBookmarkAllocations() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.FilterbookmarkAllocationsService.getIndex(this.params)
            .subscribe((result) => {
                this.FilterbookmarkAllocations = result;
                console.log(this.FilterbookmarkAllocations);
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultFilterbookmarkAllocationsIndexParams();
        this.loadBookmarkAllocations();
    }

    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadBookmarkAllocations();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadBookmarkAllocations();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadBookmarkAllocations();
    }

    public toggleDeleteAllModal(FilterBookmarkAllocation?: FilterbookmarkAllocationWithUsersAndUsergroups) {
        let items: DeleteAllItem[] = [];
        if (FilterBookmarkAllocation) {
            // User just want to delete a single dashboardAllocation
            if (FilterBookmarkAllocation.id) {
                items = [{
                    id: FilterBookmarkAllocation.id,
                    displayName: FilterBookmarkAllocation.name
                }];
            }
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
                };
            });
        }
        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadBookmarkAllocations();
        }
    }
}
