import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TenantsService } from '../tenants.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AllTenant, getDefaultTenantsIndexParams, TenantsIndexParams, TenantsIndexRoot } from '../tenant.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-tenants-index',
    standalone: true,
    imports: [
        ActionsButtonComponent,
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
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './tenants-index.component.html',
    styleUrl: './tenants-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: TenantsService} // Inject the ServicesService into the DeleteAllModalComponent
    ]
})
export class TenantsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: TenantsIndexParams = getDefaultTenantsIndexParams();
    public tenants?: TenantsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly TenantsService = inject(TenantsService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadTenants();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadTenants(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.TenantsService.getIndex(this.params).subscribe((tenants) => {
                this.tenants = tenants;
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
        this.loadTenants();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadTenants();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadTenants();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadTenants();
        }
    }

    public resetFilter() {
        this.params = getDefaultTenantsIndexParams();
        this.loadTenants();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(tenant?: AllTenant) {
        let items: DeleteAllItem[] = [];

        if (tenant) {
            // User just want to delete a single command
            items = [{
                id: Number(tenant.Tenant.container_id),
                displayName: String(tenant.Container.name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Tenant.container_id,
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
