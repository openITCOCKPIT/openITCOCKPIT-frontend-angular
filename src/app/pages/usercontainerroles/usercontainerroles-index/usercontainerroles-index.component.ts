import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { UsercontainerrolesService } from '../usercontainerroles.service';
import {
    getDefaultContainerRolesIndexParams,
    UserContainerRolesIndex,
    UserContainerRolesIndexParams,
    UserContainerRolesIndexRoot
} from '../usercontainerroles.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-usercontainerroles-index',
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
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
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
        BadgeOutlineComponent
    ],
    templateUrl: './usercontainerroles-index.component.html',
    styleUrl: './usercontainerroles-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: UsercontainerrolesService} // Inject the ServicetemplategroupsService into the DeleteAllModalComponent
    ]
})
export class UsercontainerrolesIndexComponent implements OnInit, OnDestroy {
    private readonly modalService: ModalService = inject(ModalService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UserContainerRolesService: UsercontainerrolesService = inject(UsercontainerrolesService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected params: UserContainerRolesIndexParams = {} as UserContainerRolesIndexParams;
    protected userContainerRolesIndexRoot?: UserContainerRolesIndexRoot;
    protected selectedItems: DeleteAllItem[] = [];
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
            this.loadUserContainerRoles();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultContainerRolesIndexParams();
        this.loadUserContainerRoles();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadUserContainerRoles();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadUserContainerRoles();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadUserContainerRoles();
        }
    }


    public loadUserContainerRoles() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.UserContainerRolesService.getIndex(this.params)
            .subscribe((result: UserContainerRolesIndexRoot) => {
                this.userContainerRolesIndexRoot = result;
                this.cdr.markForCheck();
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadUserContainerRoles();
        }
    }


    public toggleDeleteAllModal(userContainerRole?: UserContainerRolesIndex) {
        let items: DeleteAllItem[] = [];

        if (userContainerRole) {
            // User just want to delete a single Servicetemplate
            items = [
                {
                    id: userContainerRole.id as number,
                    displayName: userContainerRole.name
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'usercontainerroles', 'copy', ids]);
        }
    }

}
