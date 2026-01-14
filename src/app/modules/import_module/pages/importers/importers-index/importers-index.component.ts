import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    getDefaultImportersIndexParams,
    Importer,
    ImportersIndexParams,
    ImportersIndexRoot
} from '../importers.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { forkJoin, Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { ImportersService } from '../importers.service';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { IndexPage } from '../../../../../pages.interface';
import { Hostdefault } from '../../hostdefaults/hostdefaults.interface';

@Component({
    selector: 'oitc-importers-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DebounceDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    DeleteAllModalComponent,
    DropdownDividerDirective,
    ItemSelectComponent,
    MatSort,
    MatSortHeader,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    SelectAllComponent,
    TableDirective
],
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ImportersService} // Inject the ImportersService into the DeleteAllModalComponent
    ],
    templateUrl: './importers-index.component.html',
    styleUrl: './importers-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportersIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: ImportersIndexParams = getDefaultImportersIndexParams();
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public importers?: ImportersIndexRoot;
    public hostdefaults: Hostdefault[] = [];
    public isLoading: boolean = true;


    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly ImportersService = inject(ImportersService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.load();
    }

    public load() {
        let request = {
            importers: this.ImportersService.getImporters(this.params),
            hostdefaults: this.ImportersService.getHostdefaults()
        };

        forkJoin(request).subscribe(
            (result) => {
                this.importers = result.importers;
                this.hostdefaults = result.hostdefaults
                this.isLoading = false;
                this.cdr.markForCheck();
            });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultImportersIndexParams();
        this.load();
    }

    public onPaginatorChange(importer: PaginatorChangeEvent): void {
        this.params.page = importer.page;
        this.params.scroll = importer.scroll;
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
    public toggleDeleteAllModal(importer?: Importer) {
        let items: DeleteAllItem[] = [];

        if (importer) {
            // User just want to delete a single calendar
            items = [{
                id: importer.id,
                displayName: importer.name
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
