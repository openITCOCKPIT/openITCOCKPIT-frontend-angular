import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { UserDefaultTemplatesService } from '../user-default-templates.service';
import { UsersService } from '../../users/users.service';
import { IndexPage } from '../../../pages.interface';
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
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    AllUserdefaulttemplate,
    getDefaultUserDefaultTemplatesIndexParams,
    UserDefaultTemplatesIndexParams,
    UserDefaultTemplatesIndexRoot
} from '../user-default-templates.interface';

@Component({
    selector: 'oitc-user-default-templates-index',
    imports: [
        RouterLink,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        ContainerComponent,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        FormDirective,
        InputGroupTextDirective,
        FormControlDirective,
        DebounceDirective,
        TranslocoPipe,
        FormsModule,
        TableLoaderComponent,
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
        MultiSelectComponent,
    ],
    templateUrl: './user-default-templates-index.component.html',
    styleUrl: './user-default-templates-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: UserDefaultTemplatesService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDefaultTemplatesIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: UserDefaultTemplatesIndexParams = getDefaultUserDefaultTemplatesIndexParams();
    public userdefaulttemplates?: UserDefaultTemplatesIndexRoot;
    public usergroups: SelectKeyValue[] = [];
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly UsersService = inject(UsersService);
    private readonly UserDefaultTemplatesService: UserDefaultTemplatesService = inject(UserDefaultTemplatesService);
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

            this.loadUserDefaultTemplates();
            this.loadUsergroups();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadUserDefaultTemplates(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.UserDefaultTemplatesService.getIndex(this.params).subscribe((usersdefaulttemplates) => {
                this.userdefaulttemplates = usersdefaulttemplates;
                this.cdr.markForCheck();
            })
        );
    }

    public loadUsergroups(): void {
        this.subscriptions.add(
            this.UsersService.loadUsergroups().subscribe((usergroups) => {
                this.usergroups = usergroups;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadUserDefaultTemplates();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadUserDefaultTemplates();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadUserDefaultTemplates();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadUserDefaultTemplates();
        }
    }

    public resetFilter() {
        this.params = getDefaultUserDefaultTemplatesIndexParams();
        this.loadUserDefaultTemplates();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(userdefaulttemplate?: AllUserdefaulttemplate) {
        let items: DeleteAllItem[] = [];

        if (userdefaulttemplate) {
            // User just want to delete a single command
            items = [{
                id: Number(userdefaulttemplate.id),
                displayName: String(userdefaulttemplate.name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.full_name
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

    protected readonly Boolean = Boolean;
}
