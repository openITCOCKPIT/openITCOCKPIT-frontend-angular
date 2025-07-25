import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { Subscription } from 'rxjs';
import { ContactsService } from '../contacts.service';
import {
    ContactsIndex,
    ContactsIndexParams,
    ContactsIndexRoot,
    getDefaultContactsIndexParams
} from '../contacts.interface';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
  BadgeComponent,
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { IndexPage } from '../../../pages.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-contacts-index',
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
        BadgeComponent,
        TableLoaderComponent,
        AsyncPipe
    ],
    templateUrl: './contacts-index.component.html',
    styleUrl: './contacts-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: ContactsService } // Inject the ContactsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private subscriptions: Subscription = new Subscription();
    private ContactsService: ContactsService = inject(ContactsService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    public params: ContactsIndexParams = getDefaultContactsIndexParams();

    public readonly route = inject(ActivatedRoute);
    public selectedItems: DeleteAllItem[] = [];
    public contacts?: ContactsIndexRoot;
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

            let id = params['id'];
            if (id) {
                this.params['filter[Contacts.id][]'] = [].concat(id); // make sure we always get an array
            }

            this.loadContacts();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultContactsIndexParams();
        this.loadContacts();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadContacts();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadContacts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadContacts();
        }
    }

    public loadContacts() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.ContactsService.getIndex(this.params)
            .subscribe((result: ContactsIndexRoot) => {
                this.contacts = result;
                this.cdr.markForCheck();
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadContacts();
        }
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(contact?: ContactsIndex) {
        let items: DeleteAllItem[] = [];

        if (contact) {
            // User just want to delete a single contact
            items = [
                {
                    id: contact.Contact.id as number,
                    displayName: contact.Contact.name
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Contact.id,
                    displayName: item.Contact.name
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Contact.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'contacts', 'copy', ids]);
        } else {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }
}
