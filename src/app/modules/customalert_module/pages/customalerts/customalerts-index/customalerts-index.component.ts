import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    ModalService,
    RowComponent,
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { CustomAlertsService } from '../customalerts.service';
import {
    CustomAlertsIndex,
    CustomAlertsIndexParams,
    getDefaultCustomAlertsIndexParams
} from '../customalerts.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { FilterBookmarkComponent } from '../../../../../components/filter-bookmark/filter-bookmark.component';

@Component({
    selector: 'oitc-customalerts-index',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardHeaderComponent,
        CardBodyComponent,
        CardComponent,
        CardTitleDirective,
        RowComponent,
        ColComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        TableDirective,
        TableLoaderComponent,
        TextColorDirective,
        ContainerComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        FilterBookmarkComponent
    ],
    templateUrl: './customalerts-index.component.html',
    styleUrl: './customalerts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService: CustomAlertsService = inject(CustomAlertsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected params: CustomAlertsIndexParams = getDefaultCustomAlertsIndexParams();
    protected result?: CustomAlertsIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: DeleteAllItem[] = [];

    protected toggleAnnotateModal(): void {

    }

    protected toggleCloseModal(): void {

    }


    public onSelectedBookmark(filterstring: string) {
        if (filterstring === '') {
            this.resetFilter();
        }

        if (filterstring && filterstring.length > 0) {
            //resetFilter

        }
    }

    public ngOnInit(): void {
        this.refresh();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.refresh();
        }
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.refresh();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.refresh();
    }

    public resetFilter() {
        this.params = getDefaultCustomAlertsIndexParams();
        this.refresh();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.refresh();
        }
    }

    protected refresh(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.CustomAlertsService.getIndex(this.params)
            .subscribe((result: CustomAlertsIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

}
