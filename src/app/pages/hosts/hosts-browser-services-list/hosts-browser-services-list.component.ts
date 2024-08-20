import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
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
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AcknowledgementTypes } from '../../acknowledgements/acknowledgement-types.enum';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PopoverGraphComponent } from '../../../components/popover-graph/popover-graph.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import {
    ServicestatusSimpleIconComponent
} from '../../services/servicestatus-simple-icon/servicestatus-simple-icon.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../services/timezone.service';
import {
    getDefaultServicesIndexFilter,
    getServiceCurrentStateForApi,
    ServiceIndexFilter,
    ServiceObject,
    ServicesDeletedServicesRoot,
    ServicesDisabledRoot,
    ServicesIndexRoot,
    ServicesNotMonitoredRoot
} from '../../services/services.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import {
    ExternalCommandsService,
    ServiceAcknowledgeItem,
    ServiceDowntimeItem,
    ServiceNotifcationItem,
    ServiceResetItem
} from '../../../services/external-commands.service';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { EnableItem } from '../../../layouts/coreui/enable-modal/enable.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { EnableModalComponent } from '../../../layouts/coreui/enable-modal/enable-modal.component';
import {
    ServiceAcknowledgeModalComponent
} from '../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ENABLE_SERVICE_TOKEN } from '../../../tokens/enable-injection.token';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    HostsAddToHostgroupComponent
} from '../../../components/hosts/hosts-add-to-hostgroup/hosts-add-to-hostgroup.component';
import {
    ServiceAddToServicegroupModalComponent
} from '../../../components/services/service-add-to-servicegroup-modal/service-add-to-servicegroup-modal.component';

@Component({
    selector: 'oitc-hosts-browser-services-list',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        NgClass,
        AcknowledgementIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        ColComponent,
        ContainerComponent,
        DowntimeIconComponent,
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PopoverGraphComponent,
        RowComponent,
        SelectAllComponent,
        ServicestatusIconComponent,
        ServicestatusSimpleIconComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoPipe,
        XsButtonDirective,
        TooltipDirective,
        RouterLink,
        DeleteAllModalComponent,
        DisableModalComponent,
        EnableModalComponent,
        ServiceAcknowledgeModalComponent,
        ServiceMaintenanceModalComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        FormsModule,
        HostsAddToHostgroupComponent,
        ServiceAddToServicegroupModalComponent
    ],
    templateUrl: './hosts-browser-services-list.component.html',
    styleUrl: './hosts-browser-services-list.component.css',
    providers: [
        {provide: DISABLE_SERVICE_TOKEN, useClass: ServicesService},
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicesService},
        {provide: ENABLE_SERVICE_TOKEN, useClass: ServicesService},
    ]
})
export class HostsBrowserServicesListComponent implements OnInit, OnChanges, OnDestroy {

    @Input() hostId: number = 0;
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component


    public activeTab: string = 'active';

    public timezone!: TimezoneObject;
    public selectedItems: any[] = [];
    public userFullname: string = '';

    public filter: ServiceIndexFilter = getDefaultServicesIndexFilter();

    public params: any = {
        'angular': true,
        'sort': 'Servicestatus.current_state',
        'scroll': true,
        'page': 1,
        'direction': 'desc'
    };

    public services?: ServicesIndexRoot;
    public notMonitoredServices?: ServicesNotMonitoredRoot;
    public disabledServices?: ServicesDisabledRoot;
    public deletedServices?: ServicesDeletedServicesRoot;

    private subscriptions: Subscription = new Subscription();
    private readonly ServicesService: ServicesService = inject(ServicesService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TimezoneService = inject(TimezoneService);
    public readonly router = inject(Router);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);

    constructor(private route: ActivatedRoute) {
    }

    private getDefaultParams(sort: string, direction: string): any {
        return {
            'angular': true,
            'sort': sort,
            'scroll': true,
            'page': 1,
            'direction': direction
        }
    }

    public ngOnInit(): void {
        this.getUserTimezone();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['hostId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            this.load();
            return;
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
        }));
    }

    public load() {
        switch (this.activeTab) {
            case 'active':
                this.loadActiveServices();
                break;

            case 'notMonitored':
                this.loadNotMonitoredServices();
                break;

            case 'disabled':
                this.loadDisabledServices();
                break;

            case 'deleted':
                this.loadDeletedServices();
                break;
        }
    };

    private loadActiveServices() {
        if (!this.hostId) {
            return;
        }

        this.params['filter[Hosts.id]'] = this.hostId;
        this.params['filter[servicename]'] = this.filter.Services.name;
        this.params['filter[servicename_regex]'] = this.filter.Services.name_regex;
        this.params['filter[Servicestatus.current_state][]'] = getServiceCurrentStateForApi(this.filter.Servicestatus.current_state);
        this.params['filter[Servicestatus.output]'] = this.filter.Servicestatus.output;

        this.subscriptions.add(this.ServicesService.getServicesIndex(this.params)
            .subscribe((services) => {
                this.services = services;
                this.userFullname = services.username;
            })
        );
    }

    private loadNotMonitoredServices() {
        if (!this.hostId) {
            return;
        }

        this.params['filter[Hosts.id]'] = this.hostId;

        this.subscriptions.add(this.ServicesService.getNotMonitored(this.params)
            .subscribe((services) => {
                this.notMonitoredServices = services;
            })
        );
    }

    private loadDisabledServices() {
        if (!this.hostId) {
            return;
        }

        this.params['filter[Hosts.id]'] = this.hostId;

        this.subscriptions.add(this.ServicesService.getDisabled(this.params)
            .subscribe((services) => {
                this.disabledServices = services;
            })
        );
    }

    private loadDeletedServices() {
        if (!this.hostId) {
            return;
        }

        this.params['filter[DeletedServices.host_id]'] = this.hostId;

        this.subscriptions.add(this.ServicesService.getServicesDeleted(this.params)
            .subscribe((services) => {
                this.deletedServices = services;
            })
        );
    }

    public changeTab(tab: string): void {
        if (tab !== this.activeTab) {
            this.activeTab = tab;

            // clear old data
            this.services = undefined;
            this.notMonitoredServices = undefined;
            this.disabledServices = undefined;
            this.deletedServices = undefined;

            this.SelectionServiceService.deselectAll();

            // Remove all old params
            this.params = this.getDefaultParams('servicename', 'asc');

            if (this.activeTab === 'deleted') {
                this.params.sort = 'DeletedServices.name';
            }

            this.load();
        }
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.load();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.SelectionServiceService.deselectAll();
            this.load();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.SelectionServiceService.deselectAll();
        this.load();
    }

    public resetChecktime() {
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceResetItem => {
            return {
                command: ExternalCommandsEnum.rescheduleService,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                satelliteId: item.Host.satelliteId
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Reschedule');
                const url = ['services', 'index'];
                this.notyService.genericSuccess(result.message, title, url);
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public disableNotifications() {
        // let commands = [];
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitDisableServiceNotifications,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Disable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                // this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }
            setTimeout(() => {
                this.load()
            }, 5000);
        }));
    }

    public enableNotifications() {
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitEnableServiceNotifications,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('enable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                //this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(() => {
                this.load()
            }, 5000);
        }));
    }

    public toggleDowntimeModal() {
        let items: ServiceDowntimeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): ServiceDowntimeItem => {
            return {
                command: ExternalCommandsEnum.submitServiceDowntime,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                start: 0,
                end: 0,
                author: this.userFullname,
                comment: '',
            };
        });

        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceMaintenanceModal',
        });
    }

    public toggleDisableModal(service?: ServiceObject) {
        let items: DisableItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: service.id,
                displayName: service.hostname + '/' + service.servicename
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

    public toggleEnableModal(service?: ServiceObject) {
        let items: EnableItem[] = [];

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
            id: 'enableModal',
        });
    }

    public acknowledgeStatus() {
        let items: ServiceAcknowledgeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): ServiceAcknowledgeItem => {
            return {
                command: ExternalCommandsEnum.submitServicestateAck,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                sticky: 0,
                notify: false,
                author: this.userFullname,
                comment: '',
            };
        });
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceAcknowledgeModal',
        });
    }

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
                    displayName: item.Service.hostname + '/' + item.Service.servicename
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
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Service.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'services', 'copy', ids]);
        }
    }

    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    protected confirmAddServicesToServicegroup(service?: ServiceObject): void {
        let items: SelectKeyValue[] = [];

        if (service) {
            items = [{
                key: Number(service.id),
                value: String(service.hostname + "/" + service.servicename)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): SelectKeyValue => {
                console.log(item);
                return {
                    key: item.Service.id,
                    value: item.Service.hostname + "/" + item.Service.servicename
                };
            });
        }
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceAddToServicegroupModal',
        });
    }



    protected readonly AcknowledgementTypes = AcknowledgementTypes;
}
