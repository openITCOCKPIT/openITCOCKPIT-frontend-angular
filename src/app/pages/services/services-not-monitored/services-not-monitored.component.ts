import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
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
import {
    ColumnsConfigExportModalComponent
} from '../../../layouts/coreui/columns-config-export-modal/columns-config-export-modal.component';
import {
    ColumnsConfigImportModalComponent
} from '../../../layouts/coreui/columns-config-import-modal/columns-config-import-modal.component';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FilterBookmarkComponent } from '../../../components/filter-bookmark/filter-bookmark.component';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PopoverGraphComponent } from '../../../components/popover-graph/popover-graph.component';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    ServiceAcknowledgeModalComponent
} from '../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicestatusSimpleIconComponent } from '../servicestatus-simple-icon/servicestatus-simple-icon.component';
import { ServicesService } from '../services.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    getDefaultServicesNotMonitoredParams,
    ServiceObject,
    ServicesNotMonitoredParams,
    ServicesNotMonitoredRoot
} from '../services.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-services-not-monitored',
    imports: [
        AcknowledgementIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ColumnsConfigExportModalComponent,
        ColumnsConfigImportModalComponent,
        ContainerComponent,
        CopyToClipboardComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
        DowntimeIconComponent,
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        FilterBookmarkComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        HoststatusIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        PermissionDirective,
        PopoverGraphComponent,
        RegexHelperTooltipComponent,
        RowComponent,
        SelectAllComponent,
        ServiceAcknowledgeModalComponent,
        ServiceMaintenanceModalComponent,
        ServicestatusIconComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        NgClass,
        ServicestatusSimpleIconComponent,
        FormDirective,
        HoststatusSimpleIconComponent,
        QueryHandlerCheckerComponent,
        AsyncPipe,
        FormsModule
    ],
    templateUrl: './services-not-monitored.component.html',
    styleUrl: './services-not-monitored.component.css',
    providers: [
        {provide: DISABLE_SERVICE_TOKEN, useClass: ServicesService}, // Inject the ServicesService into the DisableAllModalComponent
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicesService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesNotMonitoredComponent implements OnInit, OnDestroy {
// Filter vars
    public params: ServicesNotMonitoredParams = getDefaultServicesNotMonitoredParams();
    // Filter end

    public services?: ServicesNotMonitoredRoot;
    public hideFilter: boolean = true;

    public selectedItems: any[] = [];

    private readonly ServicesService = inject(ServicesService);
    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.loadServices();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadServices() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.ServicesService.getNotMonitored(this.params)
            .subscribe((result) => {
                this.services = result;
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
        this.loadServices();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadServices();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServices();
    }

    public resetFilter() {
        this.params = getDefaultServicesNotMonitoredParams();

        this.loadServices();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(service?: ServiceObject) {
        let items: DeleteAllItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: Number(service.id),
                displayName: String(service.hostname) + '/' + String(service.servicename)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Service.id,
                    displayName: String(item.Service.hostname) + '/' + String(item.Service.servicename)
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

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadServices();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Service.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'services', 'copy', ids]);
        }
    }

    public toggleDisableModal(service?: ServiceObject) {
        let items: DisableItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: Number(service.id),
                displayName: String(service.hostname) + '/' + String(service.servicename)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DisableItem => {
                return {
                    id: item.Service.id,
                    displayName: item.Service.hostname + '/' + item.Service.servicename
                };
            });
        }
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;

        this.modalService.toggle({
            show: true,
            id: 'disableModal',
        });
    }
}
