import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';


import { Subscription } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { SatellitesService } from '../satellites.service';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    getDefaultSatelliteSystemdowntimesParams,
    SatelliteSystemdowntime,
    SatelliteSystemdowntimesParams,
    SystemdowntimeSatelliteIndexRoot
} from '../satellites.interface';
import { SystemdowntimesService } from '../../../../../pages/systemdowntimes/systemdowntimes.service';


@Component({
    selector: 'oitc-satellite-downtime',
    imports: [
    CardComponent,
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardHeaderComponent,
    CardTitleDirective,
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
    MatSortHeader,
    NgForOf,
    NgIf,
    TableDirective,
    ItemSelectComponent,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    SelectAllComponent,
    AlertComponent,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownItemDirective,
    TableLoaderComponent,
    DeleteAllModalComponent,
    AsyncPipe
],
    templateUrl: './satellites-downtime.component.html',
    styleUrl: './satellites-downtime.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: SystemdowntimesService }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesDowntimeComponent implements OnInit, OnDestroy {
    private SatellitesService = inject(SatellitesService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: SatelliteSystemdowntimesParams = getDefaultSatelliteSystemdowntimesParams();
    public satelliteSystemdowntimes?: SystemdowntimeSatelliteIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadSatelliteSystemdowntimes();
        }));
    }

    public ngOnDestroy(): void {
    }

    public loadSatelliteSystemdowntimes() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.SatellitesService.getSatelliteSystemdowntimes(this.params)
            .subscribe((result) => {
                this.satelliteSystemdowntimes = result;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultSatelliteSystemdowntimesParams();
        this.loadSatelliteSystemdowntimes();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadSatelliteSystemdowntimes();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadSatelliteSystemdowntimes();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadSatelliteSystemdowntimes();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(systemDowntime?: SatelliteSystemdowntime) {
        let items: DeleteAllItem[] = [];
        if (systemDowntime) {
            // User just want to delete a single calendar
            items = [{
                id: systemDowntime.Systemdowntime.id,
                displayName: systemDowntime.Satellite.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Systemdowntime.id,
                    displayName: item.Satellite.name
                };
            });
        }

        // Pass selection to the modal
        this.selectedItems = items;
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadSatelliteSystemdowntimes();
        }
    }
}
