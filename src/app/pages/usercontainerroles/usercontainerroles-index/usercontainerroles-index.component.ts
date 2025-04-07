import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    getUsercontainerrolesIndexParams,
    Usercontainerrole,
    UsercontainerrolesIndex,
    UsercontainerrolesIndexParams
} from '../usercontainerroles.interface';
import {
    CardBodyComponent,
    CardComponent,
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
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { UsercontainerrolesService } from '../usercontainerroles.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';

@Component({
    selector: 'oitc-usercontainerroles-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
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
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoPipe,
        XsButtonDirective,
        AsyncPipe,
        NgForOf,
        BadgeOutlineComponent,
        LabelLinkComponent
    ],
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: UsercontainerrolesService} // Inject the UsercontainerrolesService into the DeleteAllModalComponent
    ],
    templateUrl: './usercontainerroles-index.component.html',
    styleUrl: './usercontainerroles-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsercontainerrolesIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: UsercontainerrolesIndexParams = getUsercontainerrolesIndexParams();
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public usercontainerroles?: UsercontainerrolesIndex;
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly UsercontainerrolesService = inject(UsercontainerrolesService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            this.load();
        }));
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.UsercontainerrolesService.getUsercontainerrolesIndex(this.params)
            .subscribe((result) => {
                this.usercontainerroles = result;
                this.cdr.markForCheck();
            })
        );
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
        this.params = getUsercontainerrolesIndexParams();
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(usercontainerrole?: Usercontainerrole) {
        let items: DeleteAllItem[] = [];

        if (usercontainerrole) {
            // User just want to delete an user container role
            items = [{
                id: usercontainerrole.id,
                displayName: usercontainerrole.name
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'usercontainerroles', 'copy', ids]);
        }
    }

}
