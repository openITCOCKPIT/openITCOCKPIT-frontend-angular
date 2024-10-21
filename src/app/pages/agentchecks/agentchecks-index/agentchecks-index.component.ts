import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentchecksService } from '../agentchecks.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AgentchecksIndexParams,
    AgentchecksIndexRoot,
    AllAgentcheck,
    getDefaultAgentchecksIndexParams
} from '../agentchecks.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgForOf, NgIf, NgSwitchCase } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';

@Component({
    selector: 'oitc-agentchecks-index',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RowComponent,
        TranslocoPipe,
        XsButtonDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        LabelLinkComponent,
        NgSwitchCase
    ],
    templateUrl: './agentchecks-index.component.html',
    styleUrl: './agentchecks-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: AgentchecksService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentchecksIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: AgentchecksIndexParams = getDefaultAgentchecksIndexParams();
    public agentchecks?: AgentchecksIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly AgentchecksService = inject(AgentchecksService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadAgentchecks();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgentchecks(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(
            this.AgentchecksService.getIndex(this.params).subscribe((agentchecks) => {
                this.agentchecks = agentchecks;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadAgentchecks();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadAgentchecks();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAgentchecks();
    }

    public resetFilter(): void {
        this.params = getDefaultAgentchecksIndexParams();
        this.loadAgentchecks();
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadAgentchecks();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(agentcheck?: AllAgentcheck) {
        let items: DeleteAllItem[] = [];

        if (agentcheck) {
            // User just want to delete a single command
            items = [{
                id: Number(agentcheck.id),
                displayName: String(agentcheck.name)
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

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }


    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
