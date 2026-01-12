import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
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
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { AsyncPipe } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import {
    AllChangecalendar,
    ChangeCalendarsIndex,
    ChangeCalendarsIndexParams,
    getDefaultChangeCalendarsIndexParams
} from '../changecalendars.interface';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { ChangecalendarsService } from '../changecalendars.service';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-changecalendars-index',
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
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    MatSort,
    MatSortHeader,
    NavComponent,
    NavItemComponent,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    ItemSelectComponent,
    DropdownDividerDirective,
    SelectAllComponent,
    AsyncPipe
],
    templateUrl: './changecalendars-index.component.html',
    styleUrl: './changecalendars-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ChangecalendarsService}, // Inject the DowntimesService into the CancelAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ChangecalendarsService: ChangecalendarsService = inject(ChangecalendarsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected params: ChangeCalendarsIndexParams = getDefaultChangeCalendarsIndexParams();
    protected result?: ChangeCalendarsIndex;
    protected selectedItems: DeleteAllItem[] = [];
    protected hideFilter: boolean = true;

    public readonly PermissionsService = inject(PermissionsService);

    public ngOnInit() {
        this.reload();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.reload();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.reload();
    }

    public resetFilter() {
        this.params = getDefaultChangeCalendarsIndexParams();
        this.reload();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.reload();
        }
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.reload();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(changecalendar?: AllChangecalendar) {
        let items: DeleteAllItem[] = [];

        if (changecalendar) {
            // User just want to delete a single command
            items = [{
                id: changecalendar.id,
                displayName: changecalendar.name
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

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public reload() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.ChangecalendarsService.getIndex(this.params)
            .subscribe((result: ChangeCalendarsIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }
}
