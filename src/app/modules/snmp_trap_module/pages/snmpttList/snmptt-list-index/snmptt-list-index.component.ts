import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
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
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
    HoststatusSimpleIconComponent
} from '../../../../../pages/hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
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


@Component({
    selector: 'oitc-snmptt-list-index',
    standalone: true,
    imports: [RouterModule, CardComponent, CoreuiComponent, FaIconComponent, PermissionDirective, TranslocoDirective, CardHeaderComponent, CardTitleDirective, NavComponent, NavItemComponent, XsButtonDirective, CardBodyComponent, ColComponent, ContainerComponent, DebounceDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective, FormDirective, FormsModule, InputGroupComponent, InputGroupTextDirective, PaginatorModule, RowComponent, TranslocoPipe, TrueFalseDirective, HoststatusSimpleIconComponent, MatSort, MatSortHeader, NgForOf, NgIf, NoRecordsComponent, PaginateOrScrollComponent, TableDirective, ItemSelectComponent, ActionsButtonComponent, ActionsButtonElementComponent, DropdownDividerDirective, SelectAllComponent, DeleteAllModalComponent, NgClass, CardFooterComponent],
    templateUrl: './snmptt-list-index.component.html',
    styleUrl: './snmptt-list-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: SnmpttService} // Inject the CommandsService into the DeleteAllModalComponent
    ]
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
            this.loadSnmpttEntries();
        }
    }

    protected readonly Number = Number;
}
