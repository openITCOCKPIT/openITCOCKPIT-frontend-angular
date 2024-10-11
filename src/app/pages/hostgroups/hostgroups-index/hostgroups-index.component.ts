import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { Subscription } from 'rxjs';
import { HostgroupsService } from '../hostgroups.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultHostgroupsIndexParams,
    HostgroupsIndexHostgroup,
    HostgroupsIndexParams,
    HostgroupsIndexRoot
} from '../hostgroups.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { HttpParams } from '@angular/common/http';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostgroupExtendedTabs } from '../hostgroups.enum';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-hostgroups-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        DeleteAllModalComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
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
        DropdownDividerDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
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
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        BadgeComponent,
        TableLoaderComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective
    ],
    templateUrl: './hostgroups-index.component.html',
    styleUrl: './hostgroups-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: HostgroupsService} // Inject the HostgroupsService into the DeleteAllModalComponent
    ]
})
export class HostgroupsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public readonly PermissionsService = inject(PermissionsService);

    public params: HostgroupsIndexParams = getDefaultHostgroupsIndexParams();

    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    public selectedItems: DeleteAllItem[] = [];
    public hostgroups?: HostgroupsIndexRoot;
    public readonly router: Router = inject(Router);
    public hideFilter: boolean = true;

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Hostgroups.id][]'] = [].concat(id); // make sure we always get an array
            }


            this.loadHostgroups();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultHostgroupsIndexParams();
        this.loadHostgroups();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHostgroups();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadHostgroups();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHostgroups();
        }
    }

    public loadHostgroups() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.HostgroupsService.getIndex(this.params)
            .subscribe((result: HostgroupsIndexRoot) => {
                this.hostgroups = result;
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadHostgroups();
        }
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(hostgroup?: HostgroupsIndexHostgroup) {
        let items: DeleteAllItem[] = [];

        if (hostgroup) {
            // User just want to delete a single host
            items = [
                {
                    id: hostgroup.id as number,
                    displayName: hostgroup.container.name
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                console.warn(item);
                return {
                    id: item.id,
                    displayName: item.container.name
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hostgroups', 'copy', ids]);
        }
    }


    public linkFor(type: string) {
        let baseUrl: string = '/hostgroups/listToPdf.pdf?';
        if (type === 'csv') {
            baseUrl = '/hostgroups/listToCsv?';
        }

        let urlParams = {
            'angular': true,
            'filter[Containers.name]': this.params['filter[Containers.name]'],
            'filter[Hostgroups.description]': this.params['filter[Hostgroups.description]'],
        };


        let stringParams: HttpParams = new HttpParams();

        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }

    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;
}
