import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
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
    TableDirective
} from '@coreui/angular';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { TimeperiodsService } from '../timeperiods.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    getDefaultTimeperiodsIndexParams,
    TimeperiodIndex,
    TimeperiodIndexRoot,
    TimeperiodsIndexParams
} from '../timeperiods.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { NgForOf, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';

@Component({
    selector: 'oitc-timeperiods-index',
    standalone: true,
    imports: [
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        ButtonGroupComponent,
        DropdownComponent,
        DropdownMenuDirective,
        DropdownToggleDirective,
        TableLoaderComponent
    ],
    templateUrl: './timeperiods-index.component.html',
    styleUrl: './timeperiods-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: TimeperiodsService} // Inject the CommandsService into the DeleteAllModalComponent
    ]
})
export class TimeperiodsIndexComponent implements OnInit, OnDestroy {

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: TimeperiodsIndexParams = getDefaultTimeperiodsIndexParams()
    public timeperiods?: TimeperiodIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private TimeperiodsService = inject(TimeperiodsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public PermissionService: PermissionsService = inject(PermissionsService);

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Timeperiods.id][]'] = [].concat(id); // make sure we always get an array
            }

            this.loadTimeperiods();
        }));
    }

    public loadTimeperiods() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.TimeperiodsService.getIndex(this.params).subscribe(data => {
            this.timeperiods = data;
        }));
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultTimeperiodsIndexParams();
        this.loadTimeperiods();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadTimeperiods();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadTimeperiods();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadTimeperiods();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(timeperiod?: TimeperiodIndex) {
        let items: DeleteAllItem[] = [];

        if (timeperiod) {
            // User just want to delete a single object
            items = [{
                id: timeperiod.Timeperiod.id,
                displayName: timeperiod.Timeperiod.name
            }];
        } else {
            // User clicked on delete selected button
            for (const item of this.SelectionServiceService.getSelectedItems()) {
                if (item.Timeperiod.allow_edit === true) {
                    items.push({
                        id: item.Timeperiod.id,
                        displayName: item.Timeperiod.name
                    });
                }
            }
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
            this.loadTimeperiods();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => {
            if (item.Timeperiod.allow_edit === true) {
                return item.Timeperiod.id
            }
        }).join(',');
        if (ids) {
            this.router.navigate(['/', 'timeperiods', 'copy', ids]);
        }
    }

    public onActionButtonClick(url: string): void {
        this.router.navigateByUrl(url);
    }

}
