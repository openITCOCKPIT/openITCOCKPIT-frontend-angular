import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { Subscription } from 'rxjs';
import { HostgroupsService } from '../hostgroups.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
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
import { AsyncPipe } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultHostgroupsIndexFilter,
    getDefaultHostgroupsIndexParams,
    HostgroupsIndexFilter,
    HostgroupsIndexHostgroup,
    HostgroupsIndexParams,
    HostgroupsIndexRoot
} from '../hostgroups.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { HttpParams } from '@angular/common/http';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostgroupExtendedTabs } from '../hostgroups.enum';
import { IndexPage } from '../../../pages.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'oitc-hostgroups-index',
    imports: [
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
    DropdownToggleDirective,
    AsyncPipe,
    NgSelectModule,
    FaStackComponent,
    FaStackItemSizeDirective
],
    templateUrl: './hostgroups-index.component.html',
    styleUrl: './hostgroups-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: HostgroupsService} // Inject the HostgroupsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);

    public params: HostgroupsIndexParams = getDefaultHostgroupsIndexParams();
    public filter: HostgroupsIndexFilter = getDefaultHostgroupsIndexFilter();

    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    public selectedItems: DeleteAllItem[] = [];
    public hostgroups?: HostgroupsIndexRoot;
    public readonly router: Router = inject(Router);
    public hideFilter: boolean = true;
    private cdr = inject(ChangeDetectorRef);


    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            let hostgroupId = params['hostgroup_id'] || params['id'];
            if (hostgroupId) {
                this.filter['Hostgroups.id'] = [].concat(hostgroupId); // make sure we always get an array
            }

            let keywords = params['keywords'] || undefined;
            if (keywords) {
                this.filter['Hostgroups.keywords'] = [keywords];
            }

            let not_keywords = params['not_keywords'] || undefined;
            if (not_keywords) {
                this.filter['Hostgroups.not_keywords'] = [not_keywords];
            }
            this.loadHostgroups();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.filter = getDefaultHostgroupsIndexFilter();
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
        if (this.route.snapshot.queryParams.hasOwnProperty('filter.Hostgroups.id')) {
            this.filter['Hostgroups.id'] = this.route.snapshot.queryParams['filter.Hostgroups.id'];
        }

        this.subscriptions.add(this.HostgroupsService.getIndex(this.params, this.filter)
            .subscribe((result: HostgroupsIndexRoot) => {
                this.hostgroups = result;
                this.cdr.markForCheck();
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

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hostgroups', 'copy', ids]);
        } else {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }


    public linkFor(type: string) {
        let baseUrl: string = '/hostgroups/listToPdf.pdf?';
        if (type === 'csv') {
            baseUrl = '/hostgroups/listToCsv?';
        }


        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'filter[Containers.name]': this.filter['Containers.name'],
            'filter[Hostgroups.description]': this.filter['Hostgroups.description'],
            'filter[Hostgroups.keywords][]': this.filter['Hostgroups.keywords'],
            'filter[Hostgroups.not_keywords][]': this.filter['Hostgroups.not_keywords']
        };

        let stringParams: HttpParams = new HttpParams();
        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }

    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;
}
