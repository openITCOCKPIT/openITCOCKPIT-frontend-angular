import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { BackButtonDirective } from '../../../directives/back-button.directive';
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
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalService,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';



import { FormsModule } from '@angular/forms';

import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HostgroupsService } from '../hostgroups.service';
import {
    getDefaultHostgroupsExtendedParams,
    getDefaultHostgroupsExtendedServiceListParams,
    HostgroupAdditionalInformation,
    HostgroupExtended,
    HostGroupExtendedHost,
    HostgroupExtendedRoot,
    HostgroupsExtendedParams,
    HostgroupsExtendedServiceListParams,
    HostgroupsLoadHostgroupsByStringParams,
    LoadServicesForHosts,
    ServicesList
} from '../hostgroups.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';

import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import {
    HostAcknowledgeItem,
    HostDisableNotificationsItem,
    HostDowntimeItem,
    HostEnableNotificationsItem,
} from '../../../services/external-commands.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import {
    HostsMaintenanceModalComponent
} from '../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';
import {
    HostsEnableNotificationsModalComponent
} from '../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import { DebounceDirective } from '../../../directives/debounce.directive';

import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import { HostObject } from '../../hosts/hosts.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    ServiceCumulatedStatusIconComponent
} from '../../../components/services/service-cumulated-status-icon/service-cumulated-status-icon.component';
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { PopoverGraphComponent } from '../../../components/popover-graph/popover-graph.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../services/timezone.service';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import { AcknowledgementTypes } from '../../acknowledgements/acknowledgement-types.enum';
import {
    HostAcknowledgeModalComponent
} from '../../../components/hosts/host-acknowledge-modal/host-acknowledge-modal.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostgroupExtendedTabs } from '../hostgroups.enum';
import {
    SlaHostgroupHostsStatusOverviewComponent
} from '../../../modules/sla_module/components/sla-hostgroup-hosts-status-overview/sla-hostgroup-hosts-status-overview.component';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { HostsService } from '../../hosts/hosts.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ServicesService } from '../../services/services.service';

@Component({
    selector: 'oitc-hostgroups-extended',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    NgIf,
    PaginatorModule,
    PermissionDirective,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    DropdownDividerDirective,
    ServiceResetChecktimeModalComponent,
    DisableModalComponent,
    HostsMaintenanceModalComponent,
    HostsDisableNotificationsModalComponent,
    HostsEnableNotificationsModalComponent,
    DebounceDirective,
    TableDirective,
    NgForOf,
    HoststatusIconComponent,
    TranslocoPipe,
    ServiceCumulatedStatusIconComponent,
    RowComponent,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ServicestatusIconComponent,
    PopoverGraphComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    ContainerComponent,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    HostAcknowledgeModalComponent,
    TableLoaderComponent,
    ObjectUuidComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    NgClass,
    SlaHostgroupHostsStatusOverviewComponent,
    DeleteAllModalComponent,
    AsyncPipe
],
    templateUrl: './hostgroups-extended.component.html',
    styleUrl: './hostgroups-extended.component.css',
    providers: [
        { provide: DISABLE_SERVICE_TOKEN, useClass: HostsService },
        { provide: DELETE_SERVICE_TOKEN, useClass: HostsService }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsExtendedComponent implements OnInit, OnDestroy {

    private readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly ServicesService: ServicesService = inject(ServicesService);
    private readonly HostsService: HostsService = inject(HostsService);
    protected deleteService: any = undefined;
    public readonly PermissionsService = inject(PermissionsService);
    public selectedTab: HostgroupExtendedTabs = HostgroupExtendedTabs.Hosts;
    private userFullname: string = '';

    protected hostgroupId: number = 0;
    protected hostgroups: SelectKeyValue[] = [];
    protected hostgroupExtended: HostgroupExtended = {
        Hosts: [],
        Hostgroup: {
            id: 0,
            uuid: '',
            container_id: 0,
            description: '',
            hostgroup_url: '',
            container: {
                id: 0,
                containertype_id: 0,
                name: '',
                parent_id: 0,
                lft: 0,
                rght: 0,
            },
            allowEdit: false,
        },
        StatusSummary: {
            up: 0,
            down: 0,
            unreachable: 0
        },
        hasSLAHosts: false,
    } as HostgroupExtended;
    protected hostgroupExtendedRoot: HostgroupExtendedRoot = {} as HostgroupExtendedRoot;
    protected timezone!: TimezoneObject;
    protected AdditionalInformationExists: boolean = false;

    protected filter: any = {
        Host: {
            name: ''
        },
        Hoststatus: {
            current_state: {
                up: false,
                down: false,
                unreachable: false
            }
        },
        Service: {
            name: ''
        },
        Servicestatus: {
            current_state: {
                ok: false,
                warning: false,
                critical: false,
                unknown: false
            }
        }
    };
    public selectedItems: any[] = [];
    public hostParams: HostgroupsExtendedParams = getDefaultHostgroupsExtendedParams();
    protected readonly AcknowledgementTypes = AcknowledgementTypes;
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        // Fetch the id from the URL
        this.hostgroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.hostParams.selected = this.hostgroupId;

        let selectedTab: string | null = this.route.snapshot.paramMap.get('selectedTab');
        if (selectedTab !== null) {
            this.changeTab(selectedTab as HostgroupExtendedTabs);
        }
        this.cdr.markForCheck();

        // Fetch the users timezone
        this.getUserTimezone();

        // Load all hostgroups for the dropdown
        this.loadHostgroups('');
    }

    protected onHostgroupChange(): void {
        // Load the hostgroup extended info
        this.loadHostgroupExtended();

        this.hostParams.selected = this.hostgroupId;

        // Load additional information
        this.loadAdditionalInformation();
    }


    public toggleResetCheckModal() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host) => {
            return {
                command: ExternalCommandsEnum.rescheduleHost,
                hostUuid: host.Host.uuid,
                type: '',
                satelliteId: 0
            };
        });

        this.modalService.toggle({
            show: true,
            id: 'serviceResetChecktimeModal'
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onResetChecktime(success: boolean) {
        if (!success) {
            this.notyService.genericWarning();
            return;
        }
        this.notyService.genericSuccess();
        // Reload page content?
        this.ngOnInit();
    }

    private loadHostgroupExtended(): void {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupWithHostsById(this.hostgroupId, this.hostParams)
            .subscribe((result: HostgroupExtendedRoot) => {
                this.cdr.markForCheck();
                this.hostgroupExtended = result.hostgroup;
                this.userFullname = result.username;
                this.hostgroupExtended.Hosts.forEach((host: HostGroupExtendedHost) => {
                    host.serviceParams = getDefaultHostgroupsExtendedServiceListParams();
                    host.serviceParams['filter[Hosts.id]'] = host.Host.id;


                    host.Servicestatus = {
                        current_state: {
                            ok: false,
                            warning: false,
                            critical: false,
                            unknown: false
                        }
                    }
                });
                this.hostgroupExtendedRoot = result;
            }));
    }

    public loadHostgroups = (searchString: string) => {
        let params: HostgroupsLoadHostgroupsByStringParams = {
            angular: true,
            'selected[]': [this.hostgroupId],
            'filter[Containers.name]': searchString
        }
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString(params)
            .subscribe((result: SelectKeyValue[]) => {
                // Put the hostgroups to the instance
                this.hostgroups = result;
                this.cdr.markForCheck();

                // Then load the selected data.
                this.onHostgroupChange();
            }));
    }

    private loadAdditionalInformation(): void {
        this.subscriptions.add(this.HostgroupsService.loadAdditionalInformation(this.hostgroupId)
            .subscribe((result: HostgroupAdditionalInformation) => {
                this.cdr.markForCheck();
                this.AdditionalInformationExists = result.AdditionalInformationExists;
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Open the Delete All Modal
    public toggleDeleteAllHostsModal(host?: HostObject) {
        let items: DeleteAllItem[] = [];
        // Override the used service to be HostsService.
        this.deleteService = this.HostsService;

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.hostname)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.hostname
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

    // Called by (click) - no manual change detection required
    public toggleDeleteAllServicesModal(service?: ServicesList) {
        let items: DeleteAllItem[] = [];
        // Override the used service to be ServicesService.
        this.deleteService = this.ServicesService;

        if (service) {
            // User just want to delete a single command
            items = [{
                id: Number(service.Service.id),
                displayName: String(service.Service.servicename)
            }];
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

    // Called by (click) - no manual change detection required
    public toggleDowntimeModal() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostDowntimeItem => {
            return {
                command: ExternalCommandsEnum.submitHostDowntime,
                hostUuid: host.Host.uuid,
                start: 0,
                end: 0,
                author: this.userFullname,
                comment: '',
                downtimetype: ''
            };
        });
        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'hostMaintenanceModal',
        });
    }


    // Called by (click) - no manual change detection required
    public disableNotifications() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostDisableNotificationsItem => {
            return {
                command: ExternalCommandsEnum.submitDisableHostNotifications,
                hostUuid: host.Host.uuid,
                type: 'hostOnly',
            };
        });

        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        this.modalService.toggle({
            show: true,
            id: 'hostDisableNotificationsModal',
        });
    }

    // Called by (click) - no manual change detection required
    public enableNotifications() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostEnableNotificationsItem => {
            return {
                command: ExternalCommandsEnum.submitEnableHostNotifications,
                hostUuid: host.Host.uuid,
                type: 'hostOnly',
            };
        });

        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        this.modalService.toggle({
            show: true,
            id: 'hostEnableNotificationsModal',
        });
    }

    // Called by (click) - no manual change detection required
    protected toggleHostServicelist(hostId: number): void {
        this.hostgroupExtended.Hosts.map((element) => {
            if (element.Host.id !== hostId) {
                return;
            }
            if (typeof element.services !== 'undefined') {
                element.services = undefined;
                return;
            }
            this.loadServicesList(element);
        })
    }

    // Called by (click) - no manual change detection required
    private loadServicesList(element: HostGroupExtendedHost): void {
        element.serviceParams['filter[Servicestatus.current_state][]'] = [];
        if (element.Servicestatus.current_state.ok) {
            element.serviceParams['filter[Servicestatus.current_state][]'].push('ok');
        }
        if (element.Servicestatus.current_state.warning) {
            element.serviceParams['filter[Servicestatus.current_state][]'].push('warning');
        }
        if (element.Servicestatus.current_state.critical) {
            element.serviceParams['filter[Servicestatus.current_state][]'].push('critical');
        }
        if (element.Servicestatus.current_state.unknown) {
            element.serviceParams['filter[Servicestatus.current_state][]'].push('unknown');
        }
        this.HostgroupsService.loadServicesByHostId(element.Host.id, element.serviceParams as HostgroupsExtendedServiceListParams).subscribe((root: LoadServicesForHosts) => {
            element.services = root.all_services;
            element.servicesRoot = root;
            this.cdr.markForCheck();
        });
        element.services = [];
        return;
    }


    // Called by (click) - no manual change detection required
    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
        }));
    }

    protected onHostFilterChange(event: Event): void {
        this.hostParams['filter[Hoststatus.current_state][]'] = [];
        if (this.filter.Hoststatus.current_state.up) {
            this.hostParams['filter[Hoststatus.current_state][]'].push('up');
        }
        if (this.filter.Hoststatus.current_state.down) {
            this.hostParams['filter[Hoststatus.current_state][]'].push('down');
        }
        if (this.filter.Hoststatus.current_state.unreachable) {
            this.hostParams['filter[Hoststatus.current_state][]'].push('unreachable');
        }
        this.hostParams.page = 1;
        this.loadHostgroupExtended();
    }

    protected onServiceFilterChange(event: Event, element: any): void {
        element.serviceParams.page = 1;
        this.loadServicesList(element);
    }

    // Callback for Paginator or Scroll Index Component
    public onHostPaginatorChange(change: PaginatorChangeEvent): void {
        this.hostParams.page = change.page;
        this.hostParams.scroll = change.scroll;
        this.loadHostgroupExtended();
    }

    public onServicePaginatorChange(change: PaginatorChangeEvent, host: HostGroupExtendedHost): void {
        host.serviceParams.page = change.page;
        host.serviceParams.scroll = change.scroll;
        this.loadServicesList(host);
    }

    public toggleDisableModal(host?: HostObject) {
        let items: DisableItem[] = [];

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.name)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DisableItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.name
                };
            });
        }
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;
        this.cdr.markForCheck();

        this.modalService.toggle({
            show: true,
            id: 'disableModal',
        });
    }

    // Called by (click) - no manual change detection required
    public acknowledgeStatus() {
        let items: HostAcknowledgeItem[] = this.hostgroupExtended.Hosts.map((host: HostGroupExtendedHost): HostAcknowledgeItem => {
            return {
                command: ExternalCommandsEnum.submitHoststateAck,
                hostUuid: host.Host.uuid,
                hostAckType: 'hostOnly',
                author: this.userFullname,
                comment: '',
                notify: true,
                sticky: 0
            };
        });
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'hostAcknowledgeModal',
        });
    }

    public changeTab(newTab: HostgroupExtendedTabs): void {
        this.selectedTab = newTab;
    }
}
