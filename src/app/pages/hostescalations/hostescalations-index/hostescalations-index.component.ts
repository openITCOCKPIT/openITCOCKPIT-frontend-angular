import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import {
    getDefaultHostescalationsIndexParams,
    HostescalationIndex,
    HostescalationIndexRoot,
    HostescalationsIndexParams
} from '../hostescalations.interface';
import { HostescalationsService } from '../hostescalations.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';

import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-hostescalations-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
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
    DropdownDividerDirective,
    ItemSelectComponent,
    NgForOf,
    NgIf,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    SelectAllComponent,
    TableDirective,
    FaStackComponent,
    FaStackItemSizeDirective,
    DeleteAllModalComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    TrueFalseDirective,
    TableLoaderComponent,
    CardFooterComponent
],
    templateUrl: './hostescalations-index.component.html',
    styleUrl: './hostescalations-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: HostescalationsService } // Inject the HostescalationsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostescalationsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly TranslocoService = inject(TranslocoService);
    public params: HostescalationsIndexParams = getDefaultHostescalationsIndexParams();
    public hostescalations?: HostescalationIndexRoot;
    public hideFilter: boolean = true;

    public hostFocus: boolean = true;
    public hostExcludeFocus: boolean = false;

    public hostgroupFocus: boolean = true;
    public hostgroupExcludeFocus: boolean = false;


    public selectedItems: DeleteAllItem[] = [];

    private readonly HostescalationsService = inject(HostescalationsService);
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Hostescalations.id][]'] = [].concat(id); // make sure we always get an array
            }

            this.loadHostescalations();
        }));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHostescalations() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.HostescalationsService.getIndex(this.params)
            .subscribe((result) => {
                this.hostescalations = result;
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
        this.loadHostescalations();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHostescalations();
    }

    public resetFilter() {
        this.params = getDefaultHostescalationsIndexParams();
        this.loadHostescalations();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(hostescalation?: HostescalationIndex) {
        let items: DeleteAllItem[] = [];
        if (hostescalation) {
            // User just want to delete a single command
            items = [{
                id: hostescalation.id,
                displayName: this.TranslocoService.translate('Host escalation #{0}', {"0": hostescalation.id})
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: this.TranslocoService.translate('Host escalation #{0}', {"0": item.id})
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
            this.loadHostescalations();
        }
    }

    public onSortChange(sort: Sort) {
    }
}
