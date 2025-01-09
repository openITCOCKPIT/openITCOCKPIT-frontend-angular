import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
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

import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { IndexPage } from '../../../pages.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    EditableMessageOfTheDay,
    getDefaultMessagesOtdIndexParams,
    MessagesOtdIndexGet,
    MessagesOtdIndexParams
} from '../messagesotd.interface';
import { MessagesOfTheDayService } from '../messagesotd.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';

@Component({
    selector: 'oitc-messagesotd-index',
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
    RowComponent,
    SelectAllComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink
],
    templateUrl: './messagesotd-index.component.html',
    styleUrl: './messagesotd-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: MessagesOfTheDayService } // Inject the ServicetemplategroupsService into the DeleteAllModalComponent
    ]
})
export class MessagesotdIndexComponent implements IndexPage, OnInit, OnDestroy {
    private readonly modalService: ModalService = inject(ModalService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly MessageOfTheDayService: MessagesOfTheDayService = inject(MessagesOfTheDayService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);

    protected params: MessagesOtdIndexParams = {} as MessagesOtdIndexParams;
    protected messagesOfTheDay: MessagesOtdIndexGet = {
        messagesOtd: [],
        _csrfToken : '',
    } as MessagesOtdIndexGet;
    protected selectedItems: DeleteAllItem[] = [];
    protected hideFilter: boolean = true;

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadMessagesOfTheDay();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultMessagesOtdIndexParams();
        this.loadMessagesOfTheDay();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadMessagesOfTheDay();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadMessagesOfTheDay();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadMessagesOfTheDay();
        }
    }


    public loadMessagesOfTheDay() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.MessageOfTheDayService.getIndex(this.params)
            .subscribe((result: MessagesOtdIndexGet) => {
                this.messagesOfTheDay = result;
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadMessagesOfTheDay();
        }
    }


    public toggleDeleteAllModal(messageOfTheDay?: EditableMessageOfTheDay) {
        let items: DeleteAllItem[] = [];

        if (messageOfTheDay) {
            // User just want to delete a single Servicetemplate
            items = [
                {
                    id: messageOfTheDay.id as number,
                    displayName: messageOfTheDay.title
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                console.warn(item);
                return {
                    id: item.id,
                    displayName: item.title
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

}
