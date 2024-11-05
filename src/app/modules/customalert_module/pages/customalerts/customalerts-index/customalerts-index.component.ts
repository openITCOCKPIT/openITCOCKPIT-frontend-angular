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
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
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
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { CustomAlertsService } from '../customalerts.service';
import {
    Customalert,
    CustomAlertsIndex, CustomAlertsIndexCustomAlertsStateFilter,
    CustomAlertsIndexParams, CustomAlertsState, getDefaultCustomAlertsIndexCustomAlertsStateFilter,
    getDefaultCustomAlertsIndexParams
} from '../customalerts.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { FilterBookmarkComponent } from '../../../../../components/filter-bookmark/filter-bookmark.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PaginatorModule } from 'primeng/paginator';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { LoadContainersRoot } from '../../../../../pages/contactgroups/contactgroups.interface';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    CustomalertsAnnotateModalComponent
} from '../../../components/customalerts-annotate-modal/customalerts-annotate-modal.component';
import {
    CustomalertsCloseModalComponent
} from '../../../components/customalerts-close-modal/customalerts-close-modal.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
import {
    getDefaultInstantreportsIndexObjectTypesFilter,
    InstantreportsIndexObjectTypesFilter
} from '../../../../../pages/instantreports/instantreports.interface';
import _ from 'lodash';

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
        FilterBookmarkComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NgSelectComponent,
        PaginatorModule,
        TranslocoPipe,
        XsButtonDirective,
        MultiSelectComponent,
        FormCheckInputDirective,
        NavComponent,
        NavItemComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        DeleteAllModalComponent,
        CustomalertsAnnotateModalComponent,
        CustomalertsCloseModalComponent,
        DatePipe,
        LabelLinkComponent,
        KeyValuePipe,
        BadgeOutlineComponent,
        NgClass
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

    protected readonly keepOrder = keepOrder;
    protected containers: SelectKeyValue[] = [];
    protected params: CustomAlertsIndexParams = getDefaultCustomAlertsIndexParams();
    protected stateFilter: CustomAlertsIndexCustomAlertsStateFilter = getDefaultCustomAlertsIndexCustomAlertsStateFilter()
    protected result?: CustomAlertsIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: DeleteAllItem[] = [];
    protected groupViewByHost: boolean = false;
    protected groupedList: { [key: number]: Customalert[] } = {} as { [key: number]: Customalert[] };

    private getSelectedItems(customAlert?: Customalert): DeleteAllItem[] {
        if (customAlert) {
            return [{
                id: Number(customAlert.id),
                displayName: String(customAlert.servicename)
            }] as DeleteAllItem[];
        }
        return this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
            return {
                id: item.id,
                displayName: '{"name":"'+item.service.host.name+'/'+item.servicename+'", "host_id":"'+item.service.host.id+'", "service_id":"'+item.service.id+'"}',
            };
        });
    }

    public toggleCloseModal(customAlert?: Customalert) {
        let items: DeleteAllItem[] = this.getSelectedItems(customAlert);

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

    protected toggleAnnotateModal(customAlert?: Customalert) {
        let items: DeleteAllItem[] = this.getSelectedItems(customAlert);

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


    public onSelectedBookmark(filterstring: string) {
        if (filterstring === '') {
            this.resetFilter();
        }

        if (filterstring && filterstring.length > 0) {
            //resetFilter

        }
    }

    public ngOnInit(): void {
        this.loadContainers();
        this.refresh();
    }

    private loadContainers(): void {
        this.subscriptions.add(this.CustomAlertsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
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
        this.params['filter[Customalerts.state][]'] = Object.keys(_.pickBy(this.stateFilter, (value, key) => value === true)) as unknown as number[];

        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.CustomAlertsService.getIndex(this.params)
            .subscribe((result: CustomAlertsIndex) => {
                this.result = result;

                this.groupedList = [];
                // Iterate all custom alerts from this.result and group it by the element.service.host.id key


                for (let i in this.result.customalerts) {
                    const item = this.result.customalerts[i] as Customalert;

                    // Find the group
                    let hostId = item.service.host.id;

                    // Check if array position hostId in this.groupedList exists.
                    if (!(hostId in this.groupedList)) {
                        // If the key does not exist, create it and initialize with an empty array
                        this.groupedList[hostId] = [];
                    }

                    this.groupedList[hostId].push(item);
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
