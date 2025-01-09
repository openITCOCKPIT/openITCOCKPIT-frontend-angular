import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
  AlertComponent,
  BorderDirective,
  ButtonCloseDirective,
  ButtonGroupComponent,
  ButtonToolbarComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalService,
  ModalTitleDirective,
  RowComponent,
  TooltipDirective
} from '@coreui/angular';
import {
    DeleteAcknowledgementsModalComponent
} from '../../../../layouts/coreui/delete-acknowledgements-modal/delete-acknowledgements-modal.component';
import { DeleteAllModalComponent } from '../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    HostsDisableFlapdetectionModalComponent
} from '../../../../components/hosts/hosts-disable-flapdetection-modal/hosts-disable-flapdetection-modal.component';
import {
    HostsEnableFlapdetectionModalComponent
} from '../../../../components/hosts/hosts-enable-flapdetection-modal/hosts-enable-flapdetection-modal.component';
import {
    HostsSendCustomNotificationModalComponent
} from '../../../../components/hosts/hosts-send-custom-notification-modal/hosts-send-custom-notification-modal.component';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
    ServiceAcknowledgeModalComponent
} from '../../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import { ServiceStatusNamePipe } from '../../../../pipes/service-status-name.pipe';
import {
    ServicesProcessCheckresultModalComponent
} from '../../../../components/services/services-process-checkresult-modal/services-process-checkresult-modal.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MergedService, ServiceBrowserResult } from '../../services.interface';
import { HostObjectCake2 } from '../../../hosts/hosts.interface';
import {
    ExternalCommandsService,
    ServiceNotifcationItem,
    ServiceProcessCheckResultItem,
    ServiceResetItem
} from '../../../../services/external-commands.service';
import { ExternalCommandsEnum } from '../../../../enums/external-commands.enum';
import { DowntimeObject } from '../../../downtimes/downtimes.interface';
import { CancelAllItem } from '../../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime.interface';
import { DeleteAcknowledgementItem } from '../../../acknowledgements/acknowledgement.interface';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../services/timezone.service';
import { SelectKeyValueString } from '../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HostsService } from '../../../hosts/hosts.service';
import { ServicesService } from '../../services.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { HistoryService } from '../../../../history.service';
import { DowntimesService } from '../../../downtimes/downtimes.service';
import { AcknowledgementsService } from '../../../acknowledgements/acknowledgements.service';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { DELETE_SERVICE_TOKEN } from '../../../../tokens/delete-injection.token';
import { DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN } from '../../../../tokens/delete-acknowledgement-injection.token';
import { ServicesBrowserChartComponent } from '../services-browser-chart/services-browser-chart.component';


import { PermissionDirective } from '../../../../permissions/permission.directive';
import {
    CancelHostdowntimeModalComponent
} from '../../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime-modal.component';
import {
    CancelServicedowntimeModalComponent
} from '../../../downtimes/cancel-servicedowntime-modal/cancel-servicedowntime-modal.component';

@Component({
    selector: 'oitc-service-browser-modal',
    imports: [
    ButtonCloseDirective,
    ButtonGroupComponent,
    ButtonToolbarComponent,
    ColComponent,
    DeleteAcknowledgementsModalComponent,
    DeleteAllModalComponent,
    FaIconComponent,
    HostsDisableFlapdetectionModalComponent,
    HostsEnableFlapdetectionModalComponent,
    HostsSendCustomNotificationModalComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgIf,
    RowComponent,
    ServiceAcknowledgeModalComponent,
    ServiceMaintenanceModalComponent,
    ServiceResetChecktimeModalComponent,
    ServiceStatusNamePipe,
    ServicesProcessCheckresultModalComponent,
    TranslocoPipe,
    XsButtonDirective,
    TranslocoDirective,
    NgClass,
    BlockLoaderComponent,
    TooltipDirective,
    TrustAsHtmlPipe,
    ServicesBrowserChartComponent,
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    PermissionDirective,
    BorderDirective,
    RouterLink,
    CancelHostdowntimeModalComponent,
    CancelServicedowntimeModalComponent,
    AsyncPipe
],
    templateUrl: './service-browser-modal.component.html',
    styleUrl: './service-browser-modal.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: DowntimesService }, // Inject the DowntimesService into the CancelAllModalComponent
        { provide: DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN, useClass: AcknowledgementsService } // Inject the DowntimesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceBrowserModalComponent implements OnInit, OnDestroy {

    @Input() public serviceId: number = 0;
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    public timezone!: TimezoneObject;
    public result?: ServiceBrowserResult;
    public availableDataSources: SelectKeyValueString[] = []; // The API result is not as good
    public selectedItems: any[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    private readonly notyService = inject(NotyService);
    private readonly TimezoneService = inject(TimezoneService);
    public readonly PermissionsService = inject(PermissionsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly DowntimesService = inject(DowntimesService);
    private readonly AcknowledgementsService = inject(AcknowledgementsService);
    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'automapServiceDetailsModal'
        });
    }

    private resetModal(): void {
        // Reset everything
        this.selectedItems = [];
        this.availableDataSources = [];
        this.result = undefined;
        this.cdr.markForCheck();
    }

    public ngOnInit(): void {
        this.getUserTimezone();

        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'automapServiceDetailsModal') {
                this.resetModal();
                this.loadService();
                this.cdr.markForCheck();
            }

        }));


    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    public loadService() {
        this.subscriptions.add(this.ServicesService.getServiceBrowser(this.serviceId).subscribe((result) => {
            this.result = result;

            for (let key in result.mergedService.Perfdata) {
                const gauge = result.mergedService.Perfdata[key];
                this.availableDataSources.push({
                    key: key, // load this datasource - this is important for Prometheus metrics which have no __name__ like rate() or sum(). We can than load metric 0, 1 or 2...
                    value: gauge.metric // Name of the metric to display in select
                });
            }
            this.cdr.markForCheck();
        }));
    }

    public resetChecktime(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        const commands: ServiceResetItem[] = [
            {
                command: ExternalCommandsEnum.rescheduleService,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid),
                satelliteId: Number(host.Host.satelliteId)
            }
        ];

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Reschedule');
                this.notyService.genericSuccess(result.message, title);
            } else {
                this.notyService.genericError();
            }
        }));

        setTimeout(() => {
            this.loadService()
        }, 5000);
    }

    public toggleDowntimeModal(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.submitServiceDowntime,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid),
                start: 0,
                end: 0,
                author: this.result.username,
                comment: '',
            });

            this.modalService.toggle({
                show: true,
                id: 'serviceMaintenanceModal',
            });
        }
    }

    public acknowledgeStatus(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.submitServicestateAck,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid),
                sticky: 0,
                notify: false,
                author: this.result.username,
                comment: '',
            });

            this.modalService.toggle({
                show: true,
                id: 'serviceAcknowledgeModal',
            });
        }

        setTimeout(() => {
            this.loadService()
        }, 5000);
    }

    public enableNotifications(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        const commands: ServiceNotifcationItem[] = [
            {
                command: ExternalCommandsEnum.submitEnableServiceNotifications,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid)
            }
        ];

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Enable Notifications');
                this.notyService.genericSuccess(result.message, title);
            } else {
                this.notyService.genericError();
            }
        }));

        setTimeout(() => {
            this.loadService()
        }, 5000);
    }

    public disableNotifications(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        const commands: ServiceNotifcationItem[] = [
            {
                command: ExternalCommandsEnum.submitDisableServiceNotifications,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid)
            }
        ];

        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Disable Notifications');
                this.notyService.genericSuccess(result.message, title);
            } else {
                this.notyService.genericError();
            }
        }));

        setTimeout(() => {
            this.loadService()
        }, 5000);
    }

    public processCheckResult(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        const item: ServiceProcessCheckResultItem = {
            command: ExternalCommandsEnum.commitPassiveServiceResult,
            maxCheckAttempts: Number(service.max_check_attempts),
            hostUuid: String(host.Host.uuid),
            serviceUuid: String(service.uuid),
            status_code: 0, // Will be overwritten with the modals default value
            plugin_output: '', // Will be overwritten with the modals default value
            forceHardstate: false, // Will be overwritten with the modals default value
            long_output: ''
        };

        this.selectedItems.push(item);

        this.modalService.toggle({
            show: true,
            id: 'serviceProcessCheckresultModal',
        });
    }

    public enableFlapdetection(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.enableOrDisableServiceFlapdetection,
            hostUuid: String(host.Host.uuid),
            serviceUuid: String(service.uuid),
            condition: 1
        });

        this.modalService.toggle({
            show: true,
            id: 'hostEnableFlapdetectionModal',
        });
    }

    public disableFlapdetection(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.enableOrDisableServiceFlapdetection,
            hostUuid: String(host.Host.uuid),
            serviceUuid: String(service.uuid),
            condition: 0
        });

        this.modalService.toggle({
            show: true,
            id: 'hostDisableFlapdetectionModal',
        });
    }

    public sendCustomNotification(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.sendCustomServiceNotification,
                hostUuid: String(host.Host.uuid),
                serviceUuid: String(service.uuid),
                options: 0, // will be overwritten by modal
                comment: '', // will be overwritten by modal
                author: this.result.username,
            });

            this.modalService.toggle({
                show: true,
                id: 'hostSendCustomNotificationModal',
            });
        }
    }

    public toggleCancelHostDowntimeModal(hostDowntime: DowntimeObject) {
        this.selectedItems = [];

        const item: CancelAllItem[] = [{
            id: hostDowntime.internalDowntimeId
        }];

        // Pass selection to the modal
        this.selectedItems = item;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'cancelHostAllModal',
        });
    }

    public toggleCancelServiceDowntimeModal(serviceDowntime: DowntimeObject) {
        this.selectedItems = [];

        const item: CancelAllItem[] = [{
            id: serviceDowntime.internalDowntimeId
        }];

        // Pass selection to the modal
        this.selectedItems = item;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'cancelServiceAllModal',
        });
    }

    public toggleDeleteAcknowledgementModal(service: MergedService, host: HostObjectCake2) {
        this.selectedItems = [];

        const item: DeleteAcknowledgementItem[] = [{
            displayName: `${host.Host.name}/${service.name}`,
            hostId: Number(host.Host.id),
            serviceId: Number(service.id)
        }];

        // Pass selection to the modal
        this.selectedItems = item;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAcknowledgements',
        });
    }

    public toggleDeleteHostAcknowledgementModal(host: HostObjectCake2) {
        this.selectedItems = [];

        const item: DeleteAcknowledgementItem[] = [{
            displayName: String(host.Host.name),
            hostId: Number(host.Host.id),
            serviceId: null
        }];

        // Pass selection to the modal
        this.selectedItems = item;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAcknowledgements',
        });
    }

    public onMassActionComplete(success: boolean) {
        this.completed.emit(success); // Pass the event to the parent component
        if (success) {
            this.loadService();
        }
    }

    protected readonly Number = Number;
    protected readonly String = String;
}
