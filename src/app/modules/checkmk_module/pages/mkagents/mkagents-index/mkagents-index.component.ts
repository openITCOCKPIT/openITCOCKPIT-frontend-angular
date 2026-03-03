import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { MkagentsService } from '../mkagents.service';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import {
    getDefaultMkagentsIndexParams,
    MkagentCake2,
    MkagentsIndexParams,
    MkagentsIndexRoot
} from '../mkagents.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-mkagents-index',
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        XsButtonDirective,
        FormDirective,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        DebounceDirective,
        FormControlDirective,
        FormsModule,
        TableLoaderComponent,
        TableDirective,
        MatSort,
        ItemSelectComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        NoRecordsComponent,
        ContainerComponent,
        SelectAllComponent,
        PaginateOrScrollComponent,
        CardFooterComponent,
        DeleteAllModalComponent,
        CardBodyComponent,
        TranslocoPipe,
        MatSortHeader,
        CardTitleDirective
    ],
    templateUrl: './mkagents-index.component.html',
    styleUrl: './mkagents-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: MkagentsService} // Inject the CommandsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkagentsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: MkagentsIndexParams = getDefaultMkagentsIndexParams();
    public hideFilter: boolean = true;
    public agents?: MkagentsIndexRoot;
    public selectedItems: DeleteAllItem[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private MkagentsService = inject(MkagentsService)
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadAgents();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgents(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.MkagentsService.getIndex(this.params).subscribe(data => {
            this.agents = data;
            this.cdr.markForCheck();
        }));
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultMkagentsIndexParams();
        this.loadAgents();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAgents();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadAgents();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadAgents();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(mkAgent?: MkagentCake2) {
        let items: DeleteAllItem[] = [];

        if (mkAgent) {
            // User just want to delete a single command
            items = [{
                id: mkAgent.Mkagent.id,
                displayName: mkAgent.Mkagent.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Mkagent.id,
                    displayName: item.Mkagent.name
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

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadAgents();
        }
    }

}
