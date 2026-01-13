import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../pages.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    AgentconnectorPullParams,
    AgentconnectorPullRoot,
    getDefaultAgentconnectorPullParams,
    PullAgent
} from '../agentconnector.interface';
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
import { AgentconnectorPullService } from '../agentconnector-pull.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { AsyncPipe } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../permissions/permissions.service';

import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-agentconnector-pull',
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
    LabelLinkComponent,
    MatSort,
    MatSortHeader,
    NavComponent,
    NavItemComponent,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    SelectAllComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    AsyncPipe,
    BadgeOutlineComponent
],
    templateUrl: './agentconnector-pull.component.html',
    styleUrl: './agentconnector-pull.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: AgentconnectorPullService } // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorPullComponent implements OnInit, OnDestroy, IndexPage {

    public params: AgentconnectorPullParams = getDefaultAgentconnectorPullParams();
    public agents?: AgentconnectorPullRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public readonly PermissionsService = inject(PermissionsService);


    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorPullService = inject(AgentconnectorPullService);
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

            this.loadAgents();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgents(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(
            this.AgentconnectorPullService.getPull(this.params).subscribe((agents) => {
                this.agents = agents;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadAgents();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadAgents();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAgents();
    }

    public resetFilter(): void {
        this.params = getDefaultAgentconnectorPullParams();
        this.loadAgents();
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadAgents();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(agent?: PullAgent) {
        let items: DeleteAllItem[] = [];

        if (agent) {
            // User just want to delete a single command
            items = [{
                id: Number(agent.id),
                displayName: String(agent.host?.name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: String(item.host?.name)
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

}
