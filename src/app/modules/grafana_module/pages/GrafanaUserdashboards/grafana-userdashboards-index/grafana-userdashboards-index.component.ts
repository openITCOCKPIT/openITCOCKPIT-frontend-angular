import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { AsyncPipe } from '@angular/common';
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
    DropdownItemDirective,
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
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    getDefaultGrafanaUserDashboardsIndexParams,
    GrafanaUserdashboardsIndex,
    GrafanaUserDashboardsIndexParams,
    GrafanaUserdashboardsIndexRoot
} from '../grafana-userdashboards.interface';
import { Subscription } from 'rxjs';
import { GrafanaUserdashboardsService } from '../grafana-userdashboards.service';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    SynchronizeGrafanaModalComponent
} from '../../../components/synchronize-grafana-modal/synchronize-grafana-modal.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-grafana-userdashboards-index',
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        AsyncPipe,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        ItemSelectComponent,
        BadgeComponent,
        DropdownItemDirective,
        DropdownDividerDirective,
        SelectAllComponent,
        DeleteAllModalComponent,
        SynchronizeGrafanaModalComponent
    ],
    templateUrl: './grafana-userdashboards-index.component.html',
    styleUrl: './grafana-userdashboards-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: GrafanaUserdashboardsService} // Inject the GrafanaUserdashboardsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: GrafanaUserDashboardsIndexParams = getDefaultGrafanaUserDashboardsIndexParams();
    public grafanaUserdhasobards?: GrafanaUserdashboardsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    public PermissionsService: PermissionsService = inject(PermissionsService);

    private readonly modalService = inject(ModalService);
    private readonly GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService);
    private subscriptions: Subscription = new Subscription();
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadGrafanaUserdashboards();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadGrafanaUserdashboards() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.GrafanaUserdashboardsService.getIndex(this.params).subscribe((response: GrafanaUserdashboardsIndexRoot) => {
            this.grafanaUserdhasobards = response;
            this.cdr.markForCheck();
        }));
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultGrafanaUserDashboardsIndexParams();
        this.loadGrafanaUserdashboards();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadGrafanaUserdashboards();
    }

    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadGrafanaUserdashboards();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadGrafanaUserdashboards();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(userdashboard?: GrafanaUserdashboardsIndex) {
        this.selectedItems = [];
        let items: DeleteAllItem[] = [];

        if (userdashboard) {
            // User just want to delete a single command
            items = [{
                id: userdashboard.id,
                displayName: userdashboard.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item: GrafanaUserdashboardsIndex): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadGrafanaUserdashboards();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'grafana_module', 'grafana_userdashboards', 'copy', ids]);
        } else {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }


    // Open the synchronize with Grafana Modal
    public synchronizeWithGrafana(userdashboard?: GrafanaUserdashboardsIndex) {
        let items: DeleteAllItem[] = [];
        this.selectedItems = [];

        if (userdashboard) {
            // User just want to synchronize a single command
            items = [{
                id: userdashboard.id,
                displayName: userdashboard.name
            }];
        } else {
            // User clicked on synchronize selected button
            items = this.SelectionServiceService.getSelectedItems().map((item: GrafanaUserdashboardsIndex): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
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
            id: 'synchronizeGrafanaModal',
        });
    }

}
