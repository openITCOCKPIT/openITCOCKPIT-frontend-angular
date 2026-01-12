import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    EvcIndexHost,
    EventcorrelationsIndexParams,
    EventcorrelationsIndexRoot,
    getDefaultEventcorrelationsIndexParams
} from '../eventcorrelations.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { AsyncPipe } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';

@Component({
    selector: 'oitc-eventcorrelations-index',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardComponent,
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
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    CardFooterComponent,
    DropdownDividerDirective,
    ItemSelectComponent,
    MatSort,
    MatSortHeader,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    SelectAllComponent,
    TableDirective,
    TableLoaderComponent,
    DropdownItemDirective,
    AsyncPipe,
    TooltipDirective,
    DeleteAllModalComponent
],
    templateUrl: './eventcorrelations-index.component.html',
    styleUrl: './eventcorrelations-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: EventcorrelationsService } // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: EventcorrelationsIndexParams = getDefaultEventcorrelationsIndexParams();
    public eventcorrelations?: EventcorrelationsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public PermissionsService: PermissionsService = inject(PermissionsService);


    private subscriptions: Subscription = new Subscription();
    private readonly EventcorrelationsService = inject(EventcorrelationsService);
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

            this.loadEventCorrelations();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventCorrelations(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.EventcorrelationsService.getIndex(this.params).subscribe((eventcorrelations) => {
                this.eventcorrelations = eventcorrelations;
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
        this.loadEventCorrelations();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadEventCorrelations();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadEventCorrelations();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadEventCorrelations();
        }
    }

    public resetFilter() {
        this.params = getDefaultEventcorrelationsIndexParams();
        this.loadEventCorrelations();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(evcHost?: EvcIndexHost) {
        let items: DeleteAllItem[] = [];

        if (evcHost) {
            if (evcHost.hasWritePermission) {
                // User just want to delete a single command
                items = [{
                    id: Number(evcHost.Host.id),
                    displayName: String(evcHost.Host.name)
                }];
            }
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.name
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


