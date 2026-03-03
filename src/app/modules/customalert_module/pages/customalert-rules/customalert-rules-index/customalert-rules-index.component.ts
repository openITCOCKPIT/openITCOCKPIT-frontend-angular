import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent, InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { CustomalertRulesService } from '../customalert-rules.service';
import {
    CustomAlertRulesIndex,
    CustomAlertRulesIndexParams,
    EditableCustomAlertRule,
    getDefaultCustomAlertRulesIndexParams
} from '../customalert-rules.interface';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';


import { NgSelectComponent } from '@ng-select/ng-select';

import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';

@Component({
    selector: 'oitc-customalert-rules-index',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        ContainerComponent,
        ColComponent,
        RowComponent,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        TableLoaderComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        ItemSelectComponent,
        BadgeComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        NgSelectComponent,
        DeleteAllModalComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent
    ],
    templateUrl: './customalert-rules-index.component.html',
    styleUrl: './customalert-rules-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: CustomalertRulesService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertRulesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected params: CustomAlertRulesIndexParams = getDefaultCustomAlertRulesIndexParams();
    protected result?: CustomAlertRulesIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: DeleteAllItem[] = [];
    protected hostTags: string[] = [];
    protected hostTagsExcluded: string[] = [];
    protected serviceTags: string[] = [];
    protected serviceTagsExcluded: string[] = [];

    protected refresh(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.CustomAlertRulesService.getIndex(this.params)
            .subscribe((result: CustomAlertRulesIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(editableCustomAlertRule?: EditableCustomAlertRule): void {
        let items: DeleteAllItem[] = [];
        if (editableCustomAlertRule) {
            // User just want to delete a single Service
            items = [
                {
                    id: editableCustomAlertRule.id as number,
                    displayName: editableCustomAlertRule.name
                }
            ];
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

    public ngOnInit(): void {
        this.refresh();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.refresh();
        }
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.refresh();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.refresh();
    }

    public resetFilter() {
        this.params = getDefaultCustomAlertRulesIndexParams();
        this.refresh();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.refresh();
        }
    }
}
