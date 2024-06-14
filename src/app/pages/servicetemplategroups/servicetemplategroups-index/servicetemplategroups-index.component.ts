import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CoreuiComponent} from '../../../layouts/coreui/coreui.component';
import {TranslocoDirective, TranslocoService, TranslocoPipe} from '@jsverse/transloco';
import {SelectionServiceService} from '../../../layouts/coreui/select-all/selection-service.service';
import {Subscription} from 'rxjs';
import {DeleteAllModalComponent} from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {DeleteAllItem} from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../../permissions/permission.directive';
import {DELETE_SERVICE_TOKEN} from '../../../tokens/delete-injection.token';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ActionsButtonComponent} from '../../../components/actions-button/actions-button.component';
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
import {DebounceDirective} from '../../../directives/debounce.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItemSelectComponent} from '../../../layouts/coreui/select-all/item-select/item-select.component';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {NgForOf, NgIf} from '@angular/common';
import {NoRecordsComponent} from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import {SelectAllComponent} from '../../../layouts/coreui/select-all/select-all.component';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {PaginatorChangeEvent} from '../../../layouts/coreui/paginator/paginator.interface';
import {ServicetemplategroupsService} from '../servicetemplategroups.service';
import {
    AllocateToMatchingHostgroupResponse,
    getDefaultServicetemplategroupsIndexParams,
    ServiceTemplateGroupsIndex,
    ServiceTemplateGroupsIndexParams,
    ServiceTemplateGroupsIndexRoot
} from '../servicetemplategroups.interface';
import {GenericResponseWrapper, GenericValidationError} from "../../../generic-responses";
import {NotyService} from "../../../layouts/coreui/noty.service";

@Component({
    selector: 'oitc-servicetemplategroups-index',
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
        BadgeComponent
    ],
    templateUrl: './servicetemplategroups-index.component.html',
    styleUrl: './servicetemplategroups-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicetemplategroupsService} // Inject the ServicetemplategroupsService into the DeleteAllModalComponent
    ]
})
export class ServicetemplategroupsIndexComponent implements OnInit, OnDestroy {
    private readonly modalService: ModalService = inject(ModalService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);

    public params: ServiceTemplateGroupsIndexParams = {} as ServiceTemplateGroupsIndexParams;

    protected readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected selectedItems: DeleteAllItem[] = [];
    protected servicetemplategroups: ServiceTemplateGroupsIndexRoot = {
        all_servicetemplategroups: [],
        _csrfToken: ''
    }
    protected readonly router: Router = inject(Router);
    protected hideFilter: boolean = true;
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadServicetemplategroups();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resetFilter() {
        this.params = getDefaultServicetemplategroupsIndexParams();
        this.loadServicetemplategroups();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServicetemplategroups();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadServicetemplategroups();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadServicetemplategroups();
        }
    }

    public loadServicetemplategroups() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.ServicetemplategroupsService.getIndex(this.params)
            .subscribe((result: ServiceTemplateGroupsIndexRoot) => {
                this.servicetemplategroups = result;
            }));
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadServicetemplategroups();
        }
    }

    public allocateToMatchingHostgroup(servicetemplategroupId: number): void {

        this.subscriptions.add(this.ServicetemplategroupsService.allocateToMatchingHostgroup(servicetemplategroupId)
            .subscribe((result: AllocateToMatchingHostgroupResponse) => {
                if (result.success) {
                    this.notyService.genericSuccess(result.message);
                    return;
                }

                this.notyService.genericWarning(result.message);
            })
        );
    }

    public toggleDeleteAllModal(servicetemplategroup?: ServiceTemplateGroupsIndex) {
        let items: DeleteAllItem[] = [];

        if (servicetemplategroup) {
            // User just want to delete a single Servicetemplate
            items = [
                {
                    id: servicetemplategroup.id as number,
                    displayName: servicetemplategroup.container.name
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
        let ids = this.SelectionServiceService.getSelectedItems().map(item => {
            console.warn(item);
            return item.id;
        }).join(',');
        if (ids) {
            this.router.navigate(['/', 'servicetemplategroups', 'copy', ids]);
        }
    }
}
