import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, DropdownComponent,
    DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, InputGroupComponent, InputGroupTextDirective, ModalService,
    NavComponent,
    NavItemComponent, RowComponent, TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HostgroupsService } from '../hostgroups.service';
import { HostgroupExtended, ServicesList } from '../hostgroups.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import {
    ExternalCommandsService, HostDisableNotificationsItem, HostDowntimeItem, HostEnableNotificationsItem,
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
import { MatSort } from '@angular/material/sort';
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

@Component({
    selector: 'oitc-hostgroups-extended',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        ServiceMaintenanceModalComponent,
        ServiceResetChecktimeModalComponent,
        DisableModalComponent,
        HostsMaintenanceModalComponent,
        HostsDisableNotificationsModalComponent,
        HostsEnableNotificationsModalComponent,
        DebounceDirective,
        MatSort,
        TableDirective,
        NgForOf,
        HoststatusIconComponent,
        TranslocoPipe,
        ButtonGroupComponent,
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
        DropdownItemDirective
    ],
    templateUrl: './hostgroups-extended.component.html',
    styleUrl: './hostgroups-extended.component.css'
})
export class HostgroupsExtendedComponent implements OnInit, OnDestroy {

    private readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);

    protected filter: any = {
        Host: {},
        Hoststatus: {
            current_state: {
                up: null,
                down: null,
                unreachable: null
            }
        },
        Service: {}
    };

    protected hostgroupId: number = 0;
    protected hostgroups: SelectKeyValue[] = [];
    protected hostgroupExtended: HostgroupExtended = {} as HostgroupExtended;
    protected timezone!: TimezoneObject;

    private userFullname: string = '';


    constructor() {
    }

    public ngOnInit() {
        // Fetch the id from the URL
        this.hostgroupId = Number(this.route.snapshot.paramMap.get('id'));

        // Fetch the users timezone
        this.getUserTimezone();

        // Load all hostgroups for the dropdown
        this.loadHostgroups();
    }

    protected onHostgroupChange(): void {
        // Load the hostgroup extended info
        this.loadHostgroupExtended();

        // Load additional information
        this.loadAdditionalInformation();
    }

    public selectedItems: any[] = [];

    public toggleResetCheckModal() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host) => {
            return {
                command: 'rescheduleHost',
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
        this.subscriptions.add(this.HostgroupsService.loadHostgroupWithHostsById(this.hostgroupId)
            .subscribe((result: HostgroupExtended) => {
                // Then put post where it belongs. Also unpack that bullshit
                this.hostgroupExtended = result;
            }));
    }

    private loadHostgroups(): void {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString('')
            .subscribe((result: SelectKeyValue[]) => {
                // Put the hostgroups to the instance
                this.hostgroups = result;

                // Then load the selected data.
                this.onHostgroupChange();
            }));
    }

    private loadAdditionalInformation(): void {
        this.subscriptions.add(this.HostgroupsService.loadAdditionalInformation(this.hostgroupId)
            .subscribe((result: any) => {
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(host?: HostObject) {
        let items: DeleteAllItem[] = [];

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
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public toggleDowntimeModal() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostDowntimeItem => {
            return {
                command: 'submitHostDowntime',
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


    public disableNotifications() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostDisableNotificationsItem => {
            return {
                command: 'submitDisableHostNotifications',
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

    public enableNotifications() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host): HostEnableNotificationsItem => {
            return {
                command: 'submitEnableHostNotifications',
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

    protected toggleHostServicelist(hostId: number): void {
        this.hostgroupExtended.Hosts.map((element) => {
            if (element.Host.id !== hostId) {
                return;
            }
            if (typeof element.services === 'undefined') {
                this.HostgroupsService.loadServicesByHostId(hostId, '').subscribe((services: ServicesList[]) => {
                    element.services = services
                });
                element.services = [];
                return;
            }
            element.services = undefined;
        })
    }


    private readonly TimezoneService: TimezoneService = inject(TimezoneService);

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
        }));
    }

}
