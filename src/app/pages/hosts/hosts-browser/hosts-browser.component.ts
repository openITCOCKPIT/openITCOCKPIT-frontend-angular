import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { HostsService } from '../hosts.service';
import { UUID } from '../../../classes/UUID';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    AlertComponent,
    BadgeComponent,
    BorderDirective,
    ButtonGroupComponent,
    ButtonToolbarComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    TooltipDirective
} from '@coreui/angular';
import { HostBrowserMenuConfig, HostsBrowserMenuComponent } from '../hosts-browser-menu/hosts-browser-menu.component';
import { AsyncPipe, KeyValuePipe, NgClass } from '@angular/common';
import { BrowserLoaderComponent } from '../../../layouts/primeng/loading/browser-loader/browser-loader.component';
import { HostBrowserResult, HostBrowserSlaOverview, MergedHost, SoftwareInformationHost } from '../hosts.interface';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { HostBrowserTabs } from '../hosts.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import { GrafanaIframeUrlForDatepicker } from '../../../modules/grafana_module/grafana.interface';
import {
    HostAcknowledgeModalComponent
} from '../../../components/hosts/host-acknowledge-modal/host-acknowledge-modal.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';
import {
    HostsEnableNotificationsModalComponent
} from '../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import {
    HostsMaintenanceModalComponent
} from '../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    HostsProcessCheckresultModalComponent
} from '../../../components/hosts/hosts-process-checkresult-modal/hosts-process-checkresult-modal.component';
import { HostProcessCheckResultItem } from '../../../services/external-commands.service';
import {
    HostsEnableFlapdetectionModalComponent
} from '../../../components/hosts/hosts-enable-flapdetection-modal/hosts-enable-flapdetection-modal.component';
import {
    HostsDisableFlapdetectionModalComponent
} from '../../../components/hosts/hosts-disable-flapdetection-modal/hosts-disable-flapdetection-modal.component';
import { HostStatusNamePipe } from '../../../pipes/host-status-name.pipe';
import {
    HostsSendCustomNotificationModalComponent
} from '../../../components/hosts/hosts-send-custom-notification-modal/hosts-send-custom-notification-modal.component';
import {
    CancelHostdowntimeModalComponent
} from '../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime-modal.component';
import { DowntimeObject } from '../../downtimes/downtimes.interface';
import { CancelAllItem } from '../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime.interface';
import { DowntimesService } from '../../downtimes/downtimes.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { DeleteAcknowledgementItem } from '../../acknowledgements/acknowledgement.interface';
import {
    DeleteAcknowledgementsModalComponent
} from '../../../layouts/coreui/delete-acknowledgements-modal/delete-acknowledgements-modal.component';
import { AcknowledgementsService } from '../../acknowledgements/acknowledgements.service';
import { DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN } from '../../../tokens/delete-acknowledgement-injection.token';

import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { HoststatusSimpleIconComponent } from '../hoststatus-simple-icon/hoststatus-simple-icon.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';

import {
    SatelliteNameComponent
} from '../../../modules/distribute_module/components/satellite-name/satellite-name.component';
import { BrowserTimelineComponent } from '../../../components/timeline/browser-timeline/browser-timeline.component';
import {
    HostTimelineLegendComponent
} from '../../../components/timeline/host-timeline-legend/host-timeline-legend.component';
import {
    HostsBrowserServicesListComponent
} from '../hosts-browser-services-list/hosts-browser-services-list.component';
import { IframeComponent } from '../../../components/iframe/iframe.component';
import {
    GrafanaTimepickerComponent
} from '../../../modules/grafana_module/components/grafana-timepicker/grafana-timepicker.component';
import {
    GrafanaTimepickerChange
} from '../../../modules/grafana_module/components/grafana-timepicker/grafana-timepicker.interface';
import {
    ServicenowHostBrowserTabComponent
} from '../../../modules/servicenow_module/components/servicenow-host-browser-tab/servicenow-host-browser-tab.component';
import {
    AdditionalHostInformationComponent
} from '../../../modules/import_module/components/additional-host-information/additional-host-information.component';
import {
    SlaHostInformationElementComponent
} from '../../../modules/sla_module/components/sla-host-information-element/sla-host-information-element.component';
import {
    IsarFlowHostBrowserTabComponent
} from '../../../modules/isarflow_module/components/isar-flow-host-browser-tab/isar-flow-host-browser-tab.component';
import { TitleService } from '../../../services/title.service';

@Component({
    selector: 'oitc-hosts-browser',
    imports: [
        TranslocoDirective,
        QueryHandlerCheckerComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        HostsBrowserMenuComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        BrowserLoaderComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        BackButtonDirective,
        NgClass,
        ButtonGroupComponent,
        ButtonToolbarComponent,
        TranslocoPipe,
        TooltipDirective,
        HostAcknowledgeModalComponent,
        HostsDisableNotificationsModalComponent,
        HostsEnableNotificationsModalComponent,
        HostsMaintenanceModalComponent,
        ServiceResetChecktimeModalComponent,
        HostsProcessCheckresultModalComponent,
        HostsEnableFlapdetectionModalComponent,
        HostsDisableFlapdetectionModalComponent,
        CardTextDirective,
        BorderDirective,
        HostStatusNamePipe,
        AlertComponent,
        HostsSendCustomNotificationModalComponent,
        CancelHostdowntimeModalComponent,
        TrustAsHtmlPipe,
        DeleteAcknowledgementsModalComponent,
        TableDirective,
        CopyToClipboardComponent,
        BadgeComponent,
        HoststatusSimpleIconComponent,
        LabelLinkComponent,
        KeyValuePipe,
        SatelliteNameComponent,
        BrowserTimelineComponent,
        HostTimelineLegendComponent,
        HostsBrowserServicesListComponent,
        IframeComponent,
        GrafanaTimepickerComponent,
        ServicenowHostBrowserTabComponent,
        AdditionalHostInformationComponent,
        AsyncPipe,
        SlaHostInformationElementComponent,
        IsarFlowHostBrowserTabComponent,
        TextColorDirective
    ],
    templateUrl: './hosts-browser.component.html',
    styleUrl: './hosts-browser.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: DowntimesService}, // Inject the DowntimesService into the CancelAllModalComponent
        {provide: DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN, useClass: AcknowledgementsService} // Inject the DowntimesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public hostBrowserConfig?: HostBrowserMenuConfig;

    public result?: HostBrowserResult;
    public lastUpdated: Date = new Date(); // Used to tell child components to reload data

    public selectedTab: HostBrowserTabs = HostBrowserTabs.StatusInformation;
    public selectedItems: any[] = [];
    public priorityClasses: string[] = ['ok-soft', 'ok', 'warning', 'critical-soft', 'critical'];
    public priorities: string[] = [];
    public tags: string[] = [];

    public GrafanaIframe?: GrafanaIframeUrlForDatepicker;

    public selectedGrafanaTimerange: string = 'now-3h';
    public selectedGrafanaAutorefresh: string = '1m';

    public AdditionalInformationExists: boolean = false;
    public isarFlowInformationExists: boolean = false;
    public softwareInformation?: SoftwareInformationHost;

    public SlaOverview: false | HostBrowserSlaOverview = false;

    private acknowledgeOpened: boolean = false;
    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TitleService: TitleService = inject(TitleService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    public readonly PermissionsService = inject(PermissionsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);
    private readonly DowntimesService = inject(DowntimesService);
    private readonly AcknowledgementsService = inject(AcknowledgementsService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
    }

    public ngOnInit(): void {
        const idOrUuid = String(this.route.snapshot.paramMap.get('idOrUuid'));

        const uuid = new UUID();
        if (uuid.isUuid(idOrUuid)) {
            // UUID was passed via URL
            this.subscriptions.add(this.HostsService.getHostByUuid(idOrUuid).subscribe((host) => {
                this.id = host.id;
                this.loadHost();
            }));
        } else {
            // ID was passed via URL
            this.id = Number(idOrUuid);
            this.loadHost();
        }

        this.route.queryParams.subscribe(params => {
            let selectedTab = params['selectedTab'] || undefined;
            if (selectedTab) {
                this.changeTab(selectedTab);
                this.cdr.markForCheck();
            }
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHost() {
        // Define the configuration for the HostBrowserMenuComponent because we know the hostId now
        this.hostBrowserConfig = {
            hostId: this.id,
            showReschedulingButton: true,
            rescheduleCallback: () => {
                console.log('implement callback')
            },
            showBackButton: false
        };

        this.subscriptions.add(this.HostsService.getHostBrowser(this.id).subscribe((result) => {
            this.cdr.markForCheck();
            this.result = result;

            let priority = Number(result.mergedHost.priority);
            // Sift priority into array index
            if (priority > 0) {
                priority = priority - 1;
            }
            this.priorities = ['text-muted', 'text-muted', 'text-muted', 'text-muted', 'text-muted']; // make all icons gray
            for (let i = 0; i <= priority; i++) {
                this.priorities[i] = this.priorityClasses[priority]; // set color depending on priority level
            }

            if (String(result.mergedHost.tags) !== "") {
                this.tags = String(result.mergedHost.tags).split(',');
            }

            this.loadGrafanaIframeUrl();
            this.loadAdditionalInformation();
            this.loadIsarFlowInformation();
            this.loadSlaInformation();
            this.loadSoftwareInformation();

            this.lastUpdated = new Date();

            // Update the title.
            let newTitle: string = this.result.mergedHost.name ?? this.TranslocoService.translate('Host');
            this.TitleService.setTitle(`${newTitle} | ` + this.TranslocoService.translate('Host Browser'));

            if (this.router.url.includes('#acknowledge')) {
                if (this.result && !this.acknowledgeOpened) {
                    this.acknowledgeOpened = true;
                    this.acknowledgeStatus(this.result.mergedHost);
                }
            }
        }));
    }

    public loadGrafanaIframeUrl(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadHostGrafanaIframeUrl(String(this.result.mergedHost.uuid), this.selectedGrafanaTimerange, this.selectedGrafanaAutorefresh).subscribe((result) => {
                this.GrafanaIframe = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public onGrafanaTimeRangeChange(event: GrafanaTimepickerChange): void {
        this.selectedGrafanaTimerange = event.timerange;
        this.selectedGrafanaAutorefresh = event.autorefresh;
        this.loadGrafanaIframeUrl();
    }

    public loadAdditionalInformation(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadAdditionalInformation(this.result.mergedHost.id).subscribe((result) => {
                this.AdditionalInformationExists = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public loadIsarFlowInformation(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadIsarFlowInformation(this.result.mergedHost.id).subscribe((result) => {
                this.isarFlowInformationExists = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public loadSlaInformation(): void {
        if (this.result?.mergedHost && this.result.mergedHost.sla_id) {
            this.subscriptions.add(this.HostsService.loadSlaInformation(this.result.mergedHost.id, this.result.mergedHost.sla_id).subscribe((result) => {
                this.SlaOverview = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public loadSoftwareInformation(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadSoftwareInformation(this.result.mergedHost.id).subscribe((result) => {
                this.softwareInformation = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public changeTab(newTab: HostBrowserTabs): void {
        this.selectedTab = newTab;
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadHost();
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

    public onToggleRescheduling(event: boolean) {
        // Host browser menu wants to toggle a rescheduling
        if (this.result) {
            this.resetChecktime(this.result.mergedHost);
        }
    }

    protected readonly HostBrowserTabs = HostBrowserTabs;
    protected readonly Number = Number;
    protected readonly String = String;
    protected readonly Boolean = Boolean;
}
