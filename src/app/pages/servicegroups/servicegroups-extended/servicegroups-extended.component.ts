import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    ButtonGroupComponent,
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
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    RowDirective,
    TableDirective
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicegroupsService } from '../servicegroups.service';
import {
    getDefaultServicegroupsExtendedParams,
    ServiceGroupExtendedRoot,
    ServicegroupsExtendedParams,
    ServicegroupsLoadServicegroupsByStringParams
} from '../servicegroups.interface';
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
    ExternalCommandsService,
    ServiceAcknowledgeItem,
    ServiceDowntimeItem,
    ServiceNotifcationItem,
    ServiceResetItem,
} from '../../../services/external-commands.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { MatSort } from '@angular/material/sort';
import { ServiceObject } from '../../services/services.interface';
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
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import { AcknowledgementTypes } from '../../acknowledgements/acknowledgement-types.enum';
import {
    ServiceAcknowledgeModalComponent
} from '../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import {
    ServicestatusSimpleIconComponent
} from '../../services/servicestatus-simple-icon/servicestatus-simple-icon.component';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { ServicesService } from '../../services/services.service';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';

@Component({
    selector: 'oitc-servicegroups-extended',
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
        DebounceDirective,
        MatSort,
        TableDirective,
        NgForOf,
        ServicestatusIconComponent,
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
        DropdownItemDirective,
        ContainerComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        ServiceAcknowledgeModalComponent,
        TableLoaderComponent,
        ObjectUuidComponent,
        RowDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        HoststatusIconComponent,
        ServicestatusSimpleIconComponent,
        DisableModalComponent,
        DeleteAllModalComponent,
        NgClass
    ],
    templateUrl: './servicegroups-extended.component.html',
    styleUrl: './servicegroups-extended.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicesService},
        {provide: DISABLE_SERVICE_TOKEN, useClass: ServicesService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsExtendedComponent implements OnInit, OnDestroy {

    public selectedItems: any[] = [];
    public serviceParams: ServicegroupsExtendedParams = getDefaultServicegroupsExtendedParams();

    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);

    private cdr = inject(ChangeDetectorRef);

    private userFullname: string = '';

    protected readonly AcknowledgementTypes = AcknowledgementTypes;
    protected servicegroupId: number = 0;
    protected servicegroups: SelectKeyValue[] = [];
    protected servicegroupExtended: ServiceGroupExtendedRoot = {
        servicegroup: {
            Servicegroup: {
                container: {
                    name: ''
                },
                uuid: '',
            },
            StatusSummary: {
                ok: 0,
                warning: 0,
                critical: 0,
                unknown: 0
            }
        }
    } as ServiceGroupExtendedRoot;
    protected timezone!: TimezoneObject;

    protected filter: any = {
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


    public ngOnInit() {
        // Fetch the id from the URL
        this.servicegroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.serviceParams.selected = this.servicegroupId;

        // Fetch the users timezone
        this.getUserTimezone();

        // Load all Servicegroups for the dropdown
        this.loadServicegroups('');

        this.cdr.markForCheck();
    }

    protected onServicegroupChange(): void {
        // Load the servicegroup extended info
        this.loadServicegroupExtended();

        this.serviceParams.selected = this.servicegroupId;

        this.cdr.markForCheck();
    }


    public toggleResetCheckModal() {
        this.selectedItems = this.servicegroupExtended.servicegroup.Services.map((service) => {
            return {
                command: ExternalCommandsEnum.rescheduleService,
                serviceUuid: service.Service.uuid,
                type: '',
                satelliteId: 0
            };
        });

        this.cdr.markForCheck();

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


    private loadServicegroupExtended(): void {
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupWithServicesById(this.servicegroupId, this.serviceParams)
            .subscribe((result: ServiceGroupExtendedRoot) => {
                this.cdr.markForCheck();
                // Then put post where it belongs. Also unpack that bullshit
                this.servicegroupExtended = result;
                this.userFullname = result.username;
            }));
    }

    public loadServicegroups = (searchString: string) => {
        let params: ServicegroupsLoadServicegroupsByStringParams = {
            angular: true,
            'selected[]': [this.servicegroupId],
            'filter[Containers.name]': searchString
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString(params)
            .subscribe((result: SelectKeyValue[]) => {
                // Put the servicegroups to the instance
                this.servicegroups = result;

                // Then load the selected data.
                this.onServicegroupChange();

                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(service?: ServiceObject) {
        let items: DeleteAllItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: Number(service.id),
                displayName: String(service.servicename)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Service.id,
                    displayName: item.Service.servicename
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

    public toggleDowntimeModal() {
        console.log(this.servicegroupExtended.servicegroup.Services);
        this.selectedItems = this.servicegroupExtended.servicegroup.Services.map((service): ServiceDowntimeItem => {
            return {
                command: ExternalCommandsEnum.submitServiceDowntime,
                hostUuid: service.Host.uuid,
                serviceUuid: service.Service.uuid,
                start: 0,
                end: 0,
                author: this.userFullname,
                comment: '',
            };
        });
        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceMaintenanceModal',
        });
    }


    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    protected onServiceFilterChange(event: Event): void {
        this.serviceParams['filter[Servicestatus.current_state][]'] = [];
        if (this.filter.Servicestatus.current_state.ok) {
            this.serviceParams['filter[Servicestatus.current_state][]'].push('ok');
        }
        if (this.filter.Servicestatus.current_state.warning) {
            this.serviceParams['filter[Servicestatus.current_state][]'].push('warning');
        }
        if (this.filter.Servicestatus.current_state.critical) {
            this.serviceParams['filter[Servicestatus.current_state][]'].push('critical');
        }
        if (this.filter.Servicestatus.current_state.unknown) {
            this.serviceParams['filter[Servicestatus.current_state][]'].push('unknown');
        }
        this.serviceParams.page = 1;
        this.loadServicegroupExtended();
    }


    // Callback for Paginator or Scroll Index Component
    public onServicePaginatorChange(change: PaginatorChangeEvent): void {
        this.serviceParams.page = change.page;
        this.serviceParams.scroll = change.scroll;
        this.loadServicegroupExtended();
    }


    public resetChecktime() {
        const items = this.servicegroupExtended.servicegroup.Services.map((service): ServiceResetItem => {
            return {
                command: ExternalCommandsEnum.rescheduleService,
                hostUuid: service.Host.uuid,
                serviceUuid: service.Service.uuid,
                satelliteId: service.Host.satelliteId
            };

        });
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(items).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Reschedule');
                this.notyService.genericSuccess(result.message, title);
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public acknowledgeStatus() {
        let items: ServiceAcknowledgeItem[] = this.servicegroupExtended.servicegroup.Services.map((service): ServiceAcknowledgeItem => {
            return {
                command: ExternalCommandsEnum.submitServicestateAck,
                serviceUuid: service.Service.uuid,
                hostUuid: service.Host.uuid,
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
            id: 'serviceAcknowledgeModal',
        });
    }

    public disableNotifications() {
        this.selectedItems = this.servicegroupExtended.servicegroup.Services.map((service): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitDisableServiceNotifications,
                hostUuid: service.Host.uuid,
                serviceUuid: service.Service.uuid
            };
        });
        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.selectedItems).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('disable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                //this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(() => {
                this.onMassActionComplete(true)
            }, 5000);
        }));
    }

    public enableNotifications() {
        this.selectedItems = this.servicegroupExtended.servicegroup.Services.map((service): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitEnableServiceNotifications,
                hostUuid: service.Host.uuid,
                serviceUuid: service.Service.uuid
            };
        });
        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.selectedItems).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('enable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                //this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(() => {
                this.onMassActionComplete(true)
            }, 5000);
        }));
    }

    protected onMassActionComplete(event: boolean): void {
        this.loadServicegroupExtended()
    }

}
