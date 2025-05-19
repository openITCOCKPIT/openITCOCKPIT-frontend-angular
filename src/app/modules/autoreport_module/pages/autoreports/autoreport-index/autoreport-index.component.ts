import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { AutoreportsService } from '../autoreports.service';
import { IndexPage } from '../../../../../pages.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent, DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent, TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    AutoreportsIndexParams,
    getDefaultAutoreportsIndexParams,
    AutoreportsIndexRoot,
    AutoreportIndex
} from '../autoreports.interface';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';


@Component({
  selector: 'oitc-autoreport-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        ContainerComponent,
        ColComponent,
        RowComponent,
        FormDirective,
        FormsModule,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        NgIf,
        TableLoaderComponent,
        MatSort,
        TableDirective,
        MatSortHeader,
        NgForOf,
        ItemSelectComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        DeleteAllModalComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DecimalPipe
    ],
  templateUrl: './autoreport-index.component.html',
  styleUrl: './autoreport-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: AutoreportsService } // Inject the CommandsService into the DeleteAllModalComponent
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportIndexComponent implements OnInit, OnDestroy, IndexPage {

    private cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    public hideFilter: boolean = true;
    public params: AutoreportsIndexParams = getDefaultAutoreportsIndexParams();
    public autoreports!: AutoreportsIndexRoot;
    public selectedItems: DeleteAllItem[] = [];

    public ngOnInit(): void {
        this.loadAutoreports();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public loadAutoreports(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.AutoreportsService.getAutoreportsIndex(this.params).subscribe(data => {
            this.autoreports = data;
            this.cdr.markForCheck();
        }));
    }

    public resetFilter(): void {
        this.params = getDefaultAutoreportsIndexParams();
        this.loadAutoreports();
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadAutoreports();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadAutoreports();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAutoreports();
    }

    public toggleDeleteAllModal(autoreport?: AutoreportIndex) {
        let items: DeleteAllItem[] = [];

        if (autoreport) {
            // User just want to delete a single command
            items = [{
                id: autoreport.id,
                displayName: autoreport.name
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

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        this.selectedItems = items;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadAutoreports();
        }
    }

}
