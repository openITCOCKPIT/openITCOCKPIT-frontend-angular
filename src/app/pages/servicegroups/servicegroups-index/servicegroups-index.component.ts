import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { Subscription } from 'rxjs';
import { ServicegroupsService } from '../servicegroups.service';
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
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultServicegroupsIndexFilter,
    getDefaultServicegroupsIndexParams,
    ServicegroupsIndexFilter,
    ServicegroupsIndexParams,
    ServicegroupsIndexRoot,
    ServicegroupsIndexServicegroup
} from '../servicegroups.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { HttpParams } from '@angular/common/http';
import { IndexPage } from '../../../pages.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
    selector: 'oitc-servicegroups-index',
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
    templateUrl: './servicegroups-index.component.html',
    styleUrl: './servicegroups-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicegroupsService} // Inject the ServicegroupsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly modalService: ModalService = inject(ModalService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly router: Router = inject(Router);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    public params: ServicegroupsIndexParams = getDefaultServicegroupsIndexParams();
    public filter: ServicegroupsIndexFilter = getDefaultServicegroupsIndexFilter();

    protected selectedItems: DeleteAllItem[] = [];
    protected servicegroups: ServicegroupsIndexRoot = {all_servicegroups: undefined, _csrfToken: ''}
    protected hideFilter: boolean = true;

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let servicegroupId = params['servicegroup_id'] || params['id'];
            if (servicegroupId) {
                this.filter['Servicegroups.id'] = [].concat(servicegroupId); // make sure we always get an array
            }

            let keywords = params['keywords'] || undefined;
            if (keywords) {
                this.filter['Servicegroups.keywords'] = [keywords];
            }

            let not_keywords = params['not_keywords'] || undefined;
            if (not_keywords) {
                this.filter['Servicegroups.not_keywords'] = [not_keywords];
            }

            this.loadServicegroups();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.filter = getDefaultServicegroupsIndexFilter();
        this.loadServicegroups();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServicegroups();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadServicegroups();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadServicegroups();
        }
    }

    public loadServicegroups() {
        this.SelectionServiceService.deselectAll();
        if (this.route.snapshot.queryParams.hasOwnProperty('filter.Servicegroups.id')) {
            this.filter['Servicegroups.id'] = this.route.snapshot.queryParams['filter.Servicegroups.id'];
        }

        this.subscriptions.add(this.ServicegroupsService.getIndex(this.params, this.filter)
            .subscribe((result: ServicegroupsIndexRoot) => {
                this.servicegroups = result;
                this.cdr.markForCheck();
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadServicegroups();
        }
    }


    // Open the Delete All Modal

    public toggleDeleteAllModal(servicegroup?: ServicegroupsIndexServicegroup) {
        let items: DeleteAllItem[] = [];

        if (servicegroup) {
            // User just want to delete a single Service
            items = [
                {
                    id: servicegroup.id as number,
                    displayName: servicegroup.container.name
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

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'servicegroups', 'copy', ids]);
        } else {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }


    public linkFor(type: string) {
        let baseUrl: string = '/servicegroups/listToPdf.pdf?';
        if (type === 'csv') {
            baseUrl = '/servicegroups/listToCsv?';
        }

        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'filter[Containers.name]': this.filter['Containers.name'],
            'filter[Servicegroups.description]': this.filter['Servicegroups.description'],
            'filter[Servicegroups.keywords][]': this.filter['Servicegroups.keywords'],
            'filter[Servicegroups.not_keywords][]': this.filter['Servicegroups.not_keywords']
        };

        let stringParams: HttpParams = new HttpParams();
        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }
}
