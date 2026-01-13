import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HostdefaultsService } from '../hostdefaults.service';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    CardBodyComponent,
    CardComponent,
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
import { Subscription } from 'rxjs';
import {
    getDefaultHostDefaultsIndexParams,
    Hostdefault,
    HostDefaultsIndexParams,
    HostDefaultsIndexRoot
} from '../hostdefaults.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';

import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';

@Component({
    selector: 'oitc-hostdefaults-index',
    imports: [
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: HostdefaultsService } // Inject the HostdefaultsService into the DeleteAllModalComponent
    ],
    templateUrl: './hostdefaults-index.component.html',
    styleUrl: './hostdefaults-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdefaultsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: HostDefaultsIndexParams = getDefaultHostDefaultsIndexParams();
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public hostdefaults?: HostDefaultsIndexRoot;


    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly HostdefaultsService = inject(HostdefaultsService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.HostdefaultsService.getIndex(this.params)
            .subscribe((result) => {
                this.hostdefaults = result;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultHostDefaultsIndexParams();
        this.load();
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public onPaginatorChange(hostdefault: PaginatorChangeEvent): void {
        this.params.page = hostdefault.page;
        this.params.scroll = hostdefault.scroll;
        this.load();
    }

    public onFilterChange($event: any) {
        this.params.page = 1;
        this.load();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(hostdefault?: Hostdefault) {
        let items: DeleteAllItem[] = [];

        if (hostdefault) {
            // User just want to delete a single calendar
            items = [{
                id: hostdefault.id,
                displayName: hostdefault.name
            }];
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }
}
