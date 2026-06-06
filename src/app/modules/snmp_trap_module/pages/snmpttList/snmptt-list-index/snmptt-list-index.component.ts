import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SnmpttService } from '../../../snmptt.service';
import {
    getDefaultSnmpttEntryIndexParams,
    SnmpttEntry,
    SnmpttEntryIndexParams,
    SnmpttEntryIndexRoot
} from '../../../snmptt.interface';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

import { NgClass } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { IndexPage } from '../../../../../pages.interface';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';


@Component({
    selector: 'oitc-snmptt-list-index',
    imports: [RouterModule, CardComponent, FaIconComponent, PermissionDirective, TranslocoDirective, CardHeaderComponent, CardTitleDirective, NavComponent, NavItemComponent, XsButtonDirective, CardBodyComponent, ColComponent, ContainerComponent, DebounceDirective, FormControlDirective, FormDirective, FormsModule, InputGroupComponent, InputGroupTextDirective, PaginatorModule, RowComponent, TranslocoPipe, MatSort, MatSortHeader, NoRecordsComponent, PaginateOrScrollComponent, TableDirective, ItemSelectComponent, ActionsButtonComponent, ActionsButtonElementComponent, SelectAllComponent, DeleteAllModalComponent, NgClass, CardFooterComponent, TableLoaderComponent],
    templateUrl: './snmptt-list-index.component.html',
    styleUrl: './snmptt-list-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: SnmpttService} // Inject the CommandsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnmpttListIndexComponent implements OnInit, OnDestroy, IndexPage {
    private SnmpttService = inject(SnmpttService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: SnmpttEntryIndexParams = getDefaultSnmpttEntryIndexParams();

    public snmptt_entries?: SnmpttEntryIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadSnmpttEntries();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadSnmpttEntries() {
        this.subscriptions.add(this.SnmpttService.getIndex(this.params)
            .subscribe((result) => {
                this.snmptt_entries = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadSnmpttEntries();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadSnmpttEntries();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadSnmpttEntries();
        }
    }

    public resetFilter() {
        this.params = getDefaultSnmpttEntryIndexParams();
        this.loadSnmpttEntries();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(snmpttEntry?: SnmpttEntry) {
        let items: DeleteAllItem[] = [];
        if (snmpttEntry) {
            // User just want to delete a single command

            items = [{
                id: snmpttEntry.Snmptt.id,
                displayName: snmpttEntry.Snmptt.eventname
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Snmptt.id,
                    displayName: item.Snmptt.eventname
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadSnmpttEntries();
        }
    }

    protected readonly Number = Number;
}
