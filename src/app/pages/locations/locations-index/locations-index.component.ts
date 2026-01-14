import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
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
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    AllLocation,
    getDefaultLocationsIndexParams,
    LocationsIndexParams,
    LocationsIndexRoot
} from '../locations.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';

import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { LocationsService } from '../locations.service';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';

import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-locations-index',
    imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    ColComponent,
    ContainerComponent,
    DebounceDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TranslocoPipe,
    MatSort,
    TableDirective,
    MatSortHeader,
    TableLoaderComponent,
    ItemSelectComponent,
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    DropdownDividerDirective,
    DeleteAllModalComponent,
    NoRecordsComponent,
    SelectAllComponent,
    PaginateOrScrollComponent,
    CardFooterComponent
],
    templateUrl: './locations-index.component.html',
    styleUrl: './locations-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: LocationsService } // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: LocationsIndexParams = getDefaultLocationsIndexParams()
    public locations?: LocationsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly LocationsService = inject(LocationsService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadLocations();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadLocations(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.LocationsService.getIndex(this.params).subscribe((locations) => {
                this.locations = locations;
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
        this.loadLocations();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadLocations();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadLocations();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadLocations();
        }
    }

    public resetFilter() {
        this.params = getDefaultLocationsIndexParams();
        this.loadLocations();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(location?: AllLocation) {
        let items: DeleteAllItem[] = [];

        if (location) {
            // User just want to delete a single command
            items = [{
                id: Number(location.Location.container_id),
                displayName: String(location.Container.name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Location.container_id,
                    displayName: item.Container.name
                };
            });
        }


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
            id: 'deleteAllModal',
        });
    }

    protected readonly Boolean = Boolean;
}
