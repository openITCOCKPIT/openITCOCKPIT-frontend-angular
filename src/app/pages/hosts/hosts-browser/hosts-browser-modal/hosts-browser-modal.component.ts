import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../services/timezone.service';
import { Subscription } from 'rxjs';
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
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { HostsService } from '../../hosts.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { HostProcessCheckResultItem } from '../../../../services/external-commands.service';
import { HostsBrowserModalService } from './hosts-browser-modal.service';
import { HostBrowserResult, MergedHost } from '../../hosts.interface';
import { ExternalCommandsEnum } from '../../../../enums/external-commands.enum';
import { DowntimeObject } from '../../../downtimes/downtimes.interface';
import { CancelAllItem } from '../../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime.interface';
import { DeleteAcknowledgementItem } from '../../../acknowledgements/acknowledgement.interface';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CancelHostdowntimeModalComponent
} from '../../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime-modal.component';
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
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HoststatusSimpleIconComponent } from '../../hoststatus-simple-icon/hoststatus-simple-icon.component';
import { RouterLink } from '@angular/router';
import {
    HostAcknowledgeModalComponent
} from '../../../../components/hosts/host-acknowledge-modal/host-acknowledge-modal.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';
import {
    HostsEnableNotificationsModalComponent
} from '../../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import {
    HostsMaintenanceModalComponent
} from '../../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import {
    HostsProcessCheckresultModalComponent
} from '../../../../components/hosts/hosts-process-checkresult-modal/hosts-process-checkresult-modal.component';
import { HostStatusNamePipe } from '../../../../pipes/host-status-name.pipe';
import {
    HostsBrowserServicesListComponent
} from '../../hosts-browser-services-list/hosts-browser-services-list.component';

@Component({
    selector: 'oitc-hosts-browser-modal',
    imports: [
        AlertComponent,
        BlockLoaderComponent,
        ButtonCloseDirective,
        ButtonGroupComponent,
        ButtonToolbarComponent,
        CancelHostdowntimeModalComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        ColComponent,
        DeleteAcknowledgementsModalComponent,
        DeleteAllModalComponent,
        FaIconComponent,
        HostsDisableFlapdetectionModalComponent,
        HostsEnableFlapdetectionModalComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        PermissionDirective,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrustAsHtmlPipe,
        XsButtonDirective,
        NgClass,
        TooltipDirective,
        BorderDirective,
        HoststatusSimpleIconComponent,
        NgForOf,
        TableDirective,
        RouterLink,
        HostAcknowledgeModalComponent,
        HostsDisableNotificationsModalComponent,
        HostsEnableNotificationsModalComponent,
        HostsMaintenanceModalComponent,
        HostsProcessCheckresultModalComponent,
        HostStatusNamePipe,
        HostsBrowserServicesListComponent
    ],
    templateUrl: './hosts-browser-modal.component.html',
    styleUrl: './hosts-browser-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsBrowserModalComponent implements OnInit, OnDestroy {
    public hostId: number = 0;

    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    public timezone!: TimezoneObject;
    public result?: HostBrowserResult;
    public lastUpdated: Date = new Date(); // Used to tell child components to reload data

    public selectedItems: any[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly TimezoneService = inject(TimezoneService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);
    private readonly HostsBrowserModalService = inject(HostsBrowserModalService);
    private cdr = inject(ChangeDetectorRef);

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'hostsBrowserModal'
        });
    }

    private resetModal(): void {
        // Reset everything
        this.selectedItems = [];
        this.result = undefined;
        this.cdr.markForCheck();
    }

    public ngOnInit(): void {
        this.getUserTimezone();

        this.subscriptions.add(this.HostsBrowserModalService.hostId$.subscribe((hostId) => {
            this.hostId = hostId;
            this.resetModal();

            this.loadHost();
            this.cdr.markForCheck();

            // open modal
            // no idea why we need setTimeout here, but otherwise you can not open the modal on the dashboard
            // more than once
            setTimeout(() => {
                this.modalService.toggle({
                    show: true,
                    id: 'hostsBrowserModal'
                });
            }, 150);
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

    public loadHost() {
        if (this.hostId > 0) {
            this.subscriptions.add(this.HostsService.getHostBrowser(this.hostId).subscribe((result) => {
                this.result = result;
                this.lastUpdated = new Date();
                this.cdr.markForCheck();
            }));
        }
    }

    public resetChecktime(host: MergedHost) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.rescheduleHost,
            hostUuid: host.uuid,
            type: 'hostOnly',
            satelliteId: host.satellite_id
        });

        this.modalService.toggle({
            show: true,
            id: 'serviceResetChecktimeModal'
        });
    }

    public toggleDowntimeModal(host: MergedHost) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.submitHostDowntime,
                hostUuid: host.uuid,
                start: 0,
                end: 0,
                author: this.result.username,
                comment: '',
                downtimetype: ''
            });

            this.modalService.toggle({
                show: true,
                id: 'hostMaintenanceModal',
            });
        }
    }

    public acknowledgeStatus(host: MergedHost) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.submitHoststateAck,
                hostUuid: host.uuid,
                hostAckType: 'hostOnly',
                author: this.result.username,
                comment: '',
                notify: true,
                sticky: 0
            });

            this.modalService.toggle({
                show: true,
                id: 'hostAcknowledgeModal',
            });
        }
    }

    public enableNotifications(host: MergedHost) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.submitEnableHostNotifications,
            hostUuid: host.uuid,
            type: 'hostOnly',
        });

        this.modalService.toggle({
            show: true,
            id: 'hostEnableNotificationsModal',
        });
    }

    public disableNotifications(host: MergedHost) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.submitDisableHostNotifications,
            hostUuid: host.uuid,
            type: 'hostOnly',
        });

        this.modalService.toggle({
            show: true,
            id: 'hostDisableNotificationsModal',
        });
    }

    public processCheckResult(host: MergedHost) {
        this.selectedItems = [];

        const item: HostProcessCheckResultItem = {
            command: ExternalCommandsEnum.commitPassiveResult,
            maxCheckAttempts: Number(host.max_check_attempts),
            hostUuid: String(host.uuid),
            status_code: 0, // Will be overwritten with the modals default value
            plugin_output: '', // Will be overwritten with the modals default value
            forceHardstate: false, // Will be overwritten with the modals default value
            long_output: ''
        };

        this.selectedItems.push(item);

        this.modalService.toggle({
            show: true,
            id: 'hostProcessCheckresultModal',
        });
    }

    public enableFlapdetection(host: MergedHost) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.enableOrDisableHostFlapdetection,
            hostUuid: host.uuid,
            condition: 1
        });

        this.modalService.toggle({
            show: true,
            id: 'hostEnableFlapdetectionModal',
        });
    }

    public disableFlapdetection(host: MergedHost) {
        this.selectedItems = [];

        this.selectedItems.push({
            command: ExternalCommandsEnum.enableOrDisableHostFlapdetection,
            hostUuid: host.uuid,
            condition: 0
        });

        this.modalService.toggle({
            show: true,
            id: 'hostDisableFlapdetectionModal',
        });
    }

    public sendCustomNotification(host: MergedHost) {
        this.selectedItems = [];

        if (this.result) {
            this.selectedItems.push({
                command: ExternalCommandsEnum.sendCustomHostNotification,
                hostUuid: host.uuid,
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

    public toggleCancelDowntimeModal(hostDowntime: DowntimeObject) {
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

    public toggleDeleteAcknowledgementModal(host: MergedHost) {
        this.selectedItems = [];

        const item: DeleteAcknowledgementItem[] = [{
            displayName: String(host.name),
            hostId: host.id,
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
            this.loadHost();
        }
    }

    protected readonly Number = Number;
    protected readonly String = String;
    protected readonly Boolean = Boolean;
}
