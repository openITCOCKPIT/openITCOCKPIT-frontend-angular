import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
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
import {
    getDefaultImportedHostgroupsIndexParams,
    Importedhostgroup,
    ImportedHostgroupIndex,
    ImportedhostgroupsIndexParams,
    ImportedhostgroupsIndexRoot
} from '../importedhostgroups.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { ImportedhostgroupsService } from '../importedhostgroups.service';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { ExternalSystemEntity } from '../../../external-systems.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { ImportITopDataComponent } from '../../../components/import-itop-data/import-itop-data.component';
import { ExternalSystemsService } from '../../../external-systems.service';

@Component({
    selector: 'oitc-imported-hostgroups-index',
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
        PaginatorModule,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        BadgeComponent,
        TableLoaderComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        JsonPipe,
        ImportITopDataComponent
    ],
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ImportedhostgroupsService} // Inject the ImportedhostgroupsService into the DeleteAllModalComponent
    ],
    templateUrl: './imported-hostgroups-index.component.html',
    styleUrl: './imported-hostgroups-index.component.css'
})
export class ImportedHostgroupsIndexComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: ImportedhostgroupsIndexParams = getDefaultImportedHostgroupsIndexParams()

    public importedhostgroups: Importedhostgroup[] = [];
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private readonly ImportedhostgroupsService = inject(ImportedhostgroupsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public externalSystems: ExternalSystemEntity[] = [];
    public allImportedGroups?: ImportedhostgroupsIndexRoot;
    private readonly notyService = inject(NotyService);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);

    constructor() {
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        let imported = null;

        const importedFilter = this.params['filter[ImportedHostgroups.imported]'] ? 1 : 0;
        const notImportedFilter = this.params['filter[ImportedHostgroups.not_imported]'] ? 1 : 0;

        if (importedFilter ^ notImportedFilter) {
            imported = importedFilter === 1;
            this.params['filter[imported]'] = imported ? 'true' : 'false';
        } else {
            this.params['filter[imported]'] = imported;
        }

        this.subscriptions.add(this.ImportedhostgroupsService.getIndex(this.params)
            .subscribe((result) => {
                this.allImportedGroups = result;
                this.importedhostgroups = result.importedhostgroups;
                this.externalSystems = result.externalSystems;
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultImportedHostgroupsIndexParams();
        this.load();
    }

    public onPaginatorChange(importedhostgroup: PaginatorChangeEvent): void {
        this.params.page = importedhostgroup.page;
        this.params.scroll = importedhostgroup.scroll;
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
    public toggleDeleteAllModal(importedhostgroup?: ImportedHostgroupIndex) {
        let items: DeleteAllItem[] = [];

        if (importedhostgroup) {
            // User just want to delete a single calendar
            items = [{
                id: importedhostgroup.id,
                displayName: importedhostgroup.name
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    public synchronizeWithMonitoring() {
        this.subscriptions.add(this.ImportedhostgroupsService.synchronizeWithMonitoring()
            .subscribe((result) => {
                if (result.success) {
                    this.notyService.genericSuccess(result.message);
                    return;
                }
                // Error
                this.notyService.genericError(result.message);
            })
        );
    }

    public loadExternalSystem(externalSystem: ExternalSystemEntity) {
        this.ExternalSystemsService.openImportedHostGroupDataModal(externalSystem);
    }

    public onImportIsCompleted($event: boolean) {
        this.load();

    }
}
