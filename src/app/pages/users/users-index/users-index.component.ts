import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
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
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import {
    getDefaultUsersIndexParams,
    LoadUsergroupsRoot,
    User,
    UsersIndexParams,
    UsersIndexRoot
} from '../users.interface';
import { RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ResetPasswordModalComponent } from '../../../components/reset-password-modal/reset-password-modal.component';
import { IndexPage } from '../../../pages.interface';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-users-index',
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
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
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
        FormErrorDirective,
        MultiSelectComponent,
        BadgeComponent,
        ResetPasswordModalComponent,
        BadgeOutlineComponent
    ],
    templateUrl: './users-index.component.html',
    styleUrl: './users-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: UsersService} // Inject the ServicegroupsService into the DeleteAllModalComponent
    ]
})
export class UsersIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly modalService: ModalService = inject(ModalService);

    protected params: UsersIndexParams = getDefaultUsersIndexParams();
    protected selectedItems: DeleteAllItem[] = [];
    protected result: UsersIndexRoot = {
        all_users: [],
        _csrfToken: '',
        myUserId: 0,
        isLdapAuth: false
    } as UsersIndexRoot;
    protected hideFilter: boolean = true;
    protected usergroups: SelectKeyValue[] = [];
    protected resetPasswordUser: User = {} as User;

    public loadUsers() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.UsersService.getIndex(this.params)
            .subscribe((result: UsersIndexRoot) => {
                this.result = result;
            }));
    }


    /**
     * Existence is pain. ¯\_(ツ)_/¯
     * Forces the given string to type-match the enumeration for <oitc-badge-outline 's color attribute.
     * @param color
     * @protected
     */
    protected toColor(color: string): ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark') {
        return color as ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark');
    }

    public ngOnInit() {
        this.loadUsergroups();
        this.loadUsers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    private loadUsergroups(): void {
        this.subscriptions.add(this.UsersService.getUsergroups()
            .subscribe((result: LoadUsergroupsRoot) => {
                this.usergroups = result.usergroups;
            }))
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadUsers();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadUsers();
    }

    public resetFilter() {
        this.params = getDefaultUsersIndexParams();
        this.loadUsers();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadUsers();
        }
    }

    // Open the Delete All Modal

    public toggleDeleteAllModal(user?: User) {
        let items: DeleteAllItem[] = [];
        if (user) {
            // User just want to delete a single Service
            items = [
                {
                    id: user.id as number,
                    displayName: user.full_name
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.full_name
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

    public resetPasswordModal(user: User) {
        this.resetPasswordUser = user;
        this.modalService.toggle({
            show: true,
            id: 'resetPasswordModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadUsers();
        }
    }

}
