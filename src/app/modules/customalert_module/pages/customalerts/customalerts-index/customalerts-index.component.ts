import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    Pipe,
    PipeTransform
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
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
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { CustomAlertsService } from '../customalerts.service';
import {
    Customalert,
    CustomAlertsIndex,
    CustomAlertsIndexCustomAlertsStateFilter,
    CustomAlertsIndexFilter,
    CustomAlertsIndexParams,
    CustomAlertsState,
    getDefaultCustomAlertsIndexCustomAlertsStateFilter,
    getDefaultCustomAlertsIndexFilter,
    getDefaultCustomAlertsIndexParams
} from '../customalerts.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { KeyValuePipe, NgClass } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { FilterBookmarkComponent } from '../../../../../components/filter-bookmark/filter-bookmark.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';

import { PaginatorModule } from 'primeng/paginator';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { LoadContainersRoot } from '../../../../../pages/contactgroups/contactgroups.interface';

import {
    CustomalertsAnnotateModalComponent
} from '../../../components/customalerts-annotate-modal/customalerts-annotate-modal.component';
import {
    CustomalertsCloseModalComponent
} from '../../../components/customalerts-close-modal/customalerts-close-modal.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';

import { IntervalPickerComponent } from '../../../../../components/interval-picker/interval-picker.component';

@Component({
    selector: 'oitc-customalerts-index',
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
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        TableLoaderComponent,
        TextColorDirective,
        ContainerComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        FilterBookmarkComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        TranslocoPipe,
        XsButtonDirective,
        MultiSelectComponent,
        FormCheckInputDirective,
        NavComponent,
        NavItemComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        CustomalertsAnnotateModalComponent,
        CustomalertsCloseModalComponent,
        BadgeOutlineComponent,
        NgClass,
        CardFooterComponent,
        IntervalPickerComponent
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
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private refreshInterval: any = null;

    protected readonly keepOrder = keepOrder;
    protected filter: CustomAlertsIndexFilter = getDefaultCustomAlertsIndexFilter();
    protected containers: SelectKeyValue[] = [];
    protected params: CustomAlertsIndexParams = getDefaultCustomAlertsIndexParams();
    protected stateFilter: CustomAlertsIndexCustomAlertsStateFilter = getDefaultCustomAlertsIndexCustomAlertsStateFilter()
    protected result?: CustomAlertsIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: Customalert[] = [];
    protected groupViewByHost: boolean = false;
    protected groupedList: { [key: number]: Customalert[] } = {};
    protected selectedAutoRefresh: SelectKeyValue = {key: 0, value: 'Disabled'};

    public ngOnInit(): void {
        this.loadContainers();
        //this.refresh();
        // setFilterAndLoad will do the refresh for us
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stopRefreshInterval();
    }

    private getSelectedItems(customAlert?: Customalert): Customalert[] {
        if (customAlert) {
            return [customAlert];
        }
        return this.SelectionServiceService.getSelectedItems().map((item): Customalert => {
            return item;
        });
    }

    public toggleCloseModal(customAlert?: Customalert) {
        let items: Customalert[] = this.getSelectedItems(customAlert);

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'customalertsCloseModal',
        });
        this.cdr.markForCheck();
    }

    protected toggleAnnotateModal = (customAlert?: Customalert) => {
        let items: Customalert[] = this.getSelectedItems(customAlert);

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'customalertsAnnotateModal',
        });
        this.cdr.markForCheck();
    }

    public onRefreshChange = (value?: SelectKeyValue): void => {
        if (value) {
            this.selectedAutoRefresh = value;
        }

        this.stopRefreshInterval();

        if (this.selectedAutoRefresh.key > 0) {
            this.startRefreshInterval(this.selectedAutoRefresh.key);
        }

    }

    private stopRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = null;
    }

    private startRefreshInterval(interval: number) {
        this.stopRefreshInterval();
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, interval * 1000);
    }

    public onSelectedBookmark(filterstring: string) {
        if (filterstring === '') {
            this.resetFilter();
        }

        if (filterstring && filterstring.length > 0) {
            //cnditions to apply old bookmarks
            const bookmarkfilter = JSON.parse(filterstring);
            let filter: CustomAlertsIndexFilter = getDefaultCustomAlertsIndexFilter();
            filter.Customalerts.message = bookmarkfilter.Customalerts.message || '';
            filter.Customalerts.state = bookmarkfilter.Customalerts.state || [true, true, false, false];
            filter.Hosts.container_id = bookmarkfilter.Hosts.container_id || [];
            filter.Hosts.name = bookmarkfilter.Hosts.name || '';
            filter.servicename = bookmarkfilter.servicename || '';
            filter.recursive = bookmarkfilter.recursive || false;
            this.setFilterAndLoad(filter);
        }
        this.cdr.markForCheck();
    }

    private setFilterAndLoad(filter: CustomAlertsIndexFilter) {
        this.filter = filter;


        this.cdr.markForCheck();
        this.onFilterChange(true);
    }


    private loadContainers(): void {
        this.subscriptions.add(this.CustomAlertsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
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
        this.filter = getDefaultCustomAlertsIndexFilter();
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

    protected hostIdsInOrder: number[] = [];

    protected refresh(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.CustomAlertsService.getIndex(this.params, this.filter)
            .subscribe((result: CustomAlertsIndex) => {
                this.result = result;

                this.groupedList = {};
                // Iterate all custom alerts from this.result and group it by the element.service.host.id key


                this.groupedList = {};
                this.hostIdsInOrder = [];
                for (var i in this.result.customalerts) {
                    let customAlert = this.result.customalerts[i];

                    if (!this.groupedList.hasOwnProperty(customAlert.service.host_id)) {
                        // Push the host_ids into an array to restore the order from the server
                        this.hostIdsInOrder.push(customAlert.service.host_id);

                        this.groupedList[customAlert.service.host_id] = []
                    }
                    this.groupedList[customAlert.service.host_id].push(customAlert);
                }

                this.cdr.markForCheck();
            }));
    }

    protected readonly CustomAlertsState = CustomAlertsState;
}

const keepOrder = (a: any, b: any) => a;

// This pipe uses the angular keyvalue pipe. but doesn't change order.
@Pipe({
    standalone: true,
    name: 'sortKeyValue'
})
export class SortKeyValuePipe extends KeyValuePipe implements PipeTransform {

    override transform(value: any, ...args: any[]): any {
        return super.transform(value, keepOrder);
    }

}
