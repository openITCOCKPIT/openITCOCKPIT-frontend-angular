import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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

import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { IndexPage } from '../../../../../pages.interface';
import { RotationsService } from '../rotations.service';
import {
    getDefaultRotationsIndexParams,
    Rotation,
    RotationsIndexParams,
    RotationsIndexRoot
} from '../rotations.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-rotations-index',
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
        NoRecordsComponent,
        PaginateOrScrollComponent,
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        TableLoaderComponent,
        PermissionDirective
    ],
    templateUrl: './rotations-index.component.html',
    styleUrl: './rotations-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: RotationsService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RotationsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private subscriptions: Subscription = new Subscription();
    private RotationsService: RotationsService = inject(RotationsService);

    public params: RotationsIndexParams = getDefaultRotationsIndexParams();

    public readonly route = inject(ActivatedRoute);
    public selectedItems: DeleteAllItem[] = [];
    public rotations?: RotationsIndexRoot;
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

            this.loadRotations();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultRotationsIndexParams();
        this.loadRotations();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadRotations();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadRotations();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadRotations();
        }
    }

    public loadRotations() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.RotationsService.getIndex(this.params)
            .subscribe((result: RotationsIndexRoot) => {
                this.rotations = result;
                this.cdr.markForCheck();
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadRotations();
        }
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(map?: Rotation) {
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

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
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
}
