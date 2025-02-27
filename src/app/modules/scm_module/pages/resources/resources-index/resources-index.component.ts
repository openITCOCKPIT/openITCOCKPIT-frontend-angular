import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    getResourcesIndexParams,
    getResourceStatusForApi,
    ResourceEntity,
    ResourcesIndex,
    ResourcesIndexParams,
    ResourceStatus
} from '../resources.interface';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
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
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { ResourcesService } from '../resources.service';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
    selector: 'oitc-resources-index',
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
        RouterLink,
        FaStackComponent,
        FaStackItemSizeDirective,
        BadgeComponent,
        LabelLinkComponent,
        FormCheckComponent,
        MultiSelectComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ResourcesService} // Inject the ResourcesService into the DeleteAllModalComponent
    ],
    templateUrl: './resources-index.component.html',
    styleUrl: './resources-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: ResourcesIndexParams = getResourcesIndexParams();
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public resources?: ResourcesIndex;
    public myResourceGroupIds: number[] = [];
    public resourcegroups: SelectKeyValue[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly ResourcesService = inject(ResourcesService);
    public readonly PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);
    public ResourceStatusFilter: ResourceStatus = {
        unconfirmed: 0,
        ok: 0,
        warning: 0,
        critical: 0
    };

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        this.params['filter[status][]'] = getResourceStatusForApi(this.ResourceStatusFilter);

        this.subscriptions.add(this.ResourcesService.getResources(this.params)
            .subscribe((result) => {
                this.resources = result;
                this.myResourceGroupIds = result.myResourceGroupIds;
                this.cdr.markForCheck();
            })
        );
        this.loadResourcegroups();
    }

    private loadResourcegroups(): void {
        this.subscriptions.add(this.ResourcesService.loadResourcegroups().subscribe((resourcegroups) => {
            this.resourcegroups = resourcegroups;
            this.cdr.markForCheck();
        }))
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onPaginatorChange(resource: PaginatorChangeEvent): void {
        this.params.page = resource.page;
        this.params.scroll = resource.scroll;
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

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getResourcesIndexParams();
        this.ResourceStatusFilter = {
            unconfirmed: 0,
            ok: 0,
            warning: 0,
            critical: 0
        };
        this.load();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(resource?: ResourceEntity) {
        let items: DeleteAllItem[] = [];

        if (resource) {
            // User just want to delete a single calendar
            items = [{
                id: resource.id,
                displayName: resource.name
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

    public myResourcegroupsOnly() {
        this.params = getResourcesIndexParams();
        this.params['filter[Resources.resourcegroup_id][]'] = this.myResourceGroupIds;
        this.load();

    }
}
