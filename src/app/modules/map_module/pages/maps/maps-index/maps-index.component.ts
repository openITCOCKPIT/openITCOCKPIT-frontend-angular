import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { Subscription } from 'rxjs';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
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
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { IndexPage } from '../../../../../pages.interface';
import { MapsService } from '../maps.service';
import { getDefaultMapsIndexParams, Map, MapsIndexParams, MapsIndexRoot } from '../maps.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-maps-index',
    imports: [
        TranslocoDirective,
        DeleteAllModalComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        DropdownDividerDirective,
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
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        TableLoaderComponent,
        AsyncPipe
    ],
    templateUrl: './maps-index.component.html',
    styleUrl: './maps-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: MapsService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private subscriptions: Subscription = new Subscription();
    private MapsService: MapsService = inject(MapsService);

    public params: MapsIndexParams = getDefaultMapsIndexParams();

    public readonly route = inject(ActivatedRoute);
    public selectedItems: DeleteAllItem[] = [];
    public maps?: MapsIndexRoot;
    public readonly router = inject(Router);
    public hideFilter: boolean = true;
    private cdr = inject(ChangeDetectorRef);


    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadMaps();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultMapsIndexParams();
        this.loadMaps();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadMaps();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadMaps();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadMaps();
        }
    }

    public loadMaps() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.MapsService.getIndex(this.params)
            .subscribe((result: MapsIndexRoot) => {
                this.maps = result;
                this.cdr.markForCheck();
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadMaps();
        }
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(map?: Map) {
        let items: DeleteAllItem[] = [];

        if (map) {
            // User just want to delete a single contact
            items = [
                {
                    id: map.id as number,
                    displayName: map.name
                }
            ];
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
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'map_module', 'maps', 'copy', ids]);
        }
    }
}
