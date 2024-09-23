import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrowserLoaderComponent } from '../../../layouts/primeng/loading/browser-loader/browser-loader.component';
import {
    AlertComponent,
    BadgeComponent,
    BorderDirective,
    ButtonGroupComponent,
    ButtonToolbarComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { HostsBrowserMenuComponent } from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UUID } from '../../../classes/UUID';
import { HostsService } from '../../hosts/hosts.service';
import { ServicesService } from '../services.service';
import { HistoryService } from '../../../history.service';
import {
    ServiceBrowserMenuConfig,
    ServicesBrowserMenuComponent
} from '../services-browser-menu/services-browser-menu.component';
import { ServicesBrowserChartComponent } from './services-browser-chart/services-browser-chart.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../services/timezone.service';
import { MergedService, ServiceBrowserResult, ServiceBrowserSlaOverview } from '../services.interface';
import { SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ServiceBrowserTabs, ServiceTypesEnum } from '../services.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostStatusNamePipe } from '../../../pipes/host-status-name.pipe';
import { ServiceStatusNamePipe } from '../../../pipes/service-status-name.pipe';
import { HostObjectCake2 } from '../../hosts/hosts.interface';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import {
    ExternalCommandsService,
    ServiceNotifcationItem,
    ServiceProcessCheckResultItem,
    ServiceResetItem
} from '../../../services/external-commands.service';
import { CancelAllItem } from '../../downtimes/cancel-hostdowntime-modal/cancel-hostdowntime.interface';
import { DeleteAcknowledgementItem } from '../../acknowledgements/acknowledgement.interface';
import { DowntimeObject } from '../../downtimes/downtimes.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN } from '../../../tokens/delete-acknowledgement-injection.token';
import { DowntimesService } from '../../downtimes/downtimes.service';
import { AcknowledgementsService } from '../../acknowledgements/acknowledgements.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { EnableModalComponent } from '../../../layouts/coreui/enable-modal/enable-modal.component';
import {
    ServiceAcknowledgeModalComponent
} from '../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import {
    HostsDisableFlapdetectionModalComponent
} from '../../../components/hosts/hosts-disable-flapdetection-modal/hosts-disable-flapdetection-modal.component';
import {
    HostsEnableFlapdetectionModalComponent
} from '../../../components/hosts/hosts-enable-flapdetection-modal/hosts-enable-flapdetection-modal.component';
import {
    HostsSendCustomNotificationModalComponent
} from '../../../components/hosts/hosts-send-custom-notification-modal/hosts-send-custom-notification-modal.component';
import {
    DeleteAcknowledgementsModalComponent
} from '../../../layouts/coreui/delete-acknowledgements-modal/delete-acknowledgements-modal.component';
import {
    ServicesProcessCheckresultModalComponent
} from '../../../components/services/services-process-checkresult-modal/services-process-checkresult-modal.component';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import {
    PrometheusServiceBrowserComponent
} from '../../../modules/prometheus_module/components/prometheus-service-browser/prometheus-service-browser.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { HostBrowserTabs } from '../../hosts/hosts.enum';
import { BrowserTimelineComponent } from '../../../components/timeline/browser-timeline/browser-timeline.component';
import {
    HostTimelineLegendComponent
} from '../../../components/timeline/host-timeline-legend/host-timeline-legend.component';
import {
    ServicenowHostBrowserTabComponent
} from '../../../modules/servicenow_module/components/servicenow-host-browser-tab/servicenow-host-browser-tab.component';
import {
    ServiceTimelineLegendComponent
} from '../../../components/timeline/service-timeline-legend/service-timeline-legend.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { GenericUnixtimerange } from '../../../generic.interfaces';

@Component({
    selector: 'oitc-services-browser',
    standalone: true,
    imports: [
        BrowserLoaderComponent,
        BorderDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        HostsBrowserMenuComponent,
        NgIf,
        QueryHandlerCheckerComponent,
        TranslocoDirective,
        ServicesBrowserMenuComponent,
        ServicesBrowserChartComponent,
        BackButtonDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        PermissionDirective,
        NgClass,
        ButtonGroupComponent,
        ButtonToolbarComponent,
        ColComponent,
        HostStatusNamePipe,
        RowComponent,
        TranslocoPipe,
        ServiceStatusNamePipe,
        TooltipDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
        EnableModalComponent,
        ServiceAcknowledgeModalComponent,
        ServiceMaintenanceModalComponent,
        ServiceResetChecktimeModalComponent,
        HostsDisableFlapdetectionModalComponent,
        HostsEnableFlapdetectionModalComponent,
        HostsSendCustomNotificationModalComponent,
        DeleteAcknowledgementsModalComponent,
        ServicesProcessCheckresultModalComponent,
        CardTextDirective,
        TrustAsHtmlPipe,
        AlertComponent,
        RouterLink,
        BadgeComponent,
        CopyToClipboardComponent,
        LabelLinkComponent,
        TableDirective,
        PrometheusServiceBrowserComponent,
        HoststatusSimpleIconComponent,
        NgForOf,
        BrowserTimelineComponent,
        HostTimelineLegendComponent,
        ServicenowHostBrowserTabComponent,
        ServiceTimelineLegendComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule
    ],
    templateUrl: './services-browser.component.html',
    styleUrl: './services-browser.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: DowntimesService}, // Inject the DowntimesService into the CancelAllModalComponent
        {provide: DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN, useClass: AcknowledgementsService} // Inject the DowntimesService into the DeleteAllModalComponent
    ]
})
export class ServicesBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public serviceBrowserConfig?: ServiceBrowserMenuConfig;
    public timezone!: TimezoneObject;

    public result?: ServiceBrowserResult;
    public lastUpdated: Date = new Date(); // Used to tell child components to reload data
    public availableDataSources: SelectKeyValueString[] = []; // The API result is not as good

    public selectedTab: ServiceBrowserTabs = ServiceBrowserTabs.StatusInformation;
    public selectedItems: any[] = [];

    private readonly timerange$$ = new BehaviorSubject<GenericUnixtimerange>({start: 0, end: 0});
    public readonly timerange$ = this.timerange$$.asObservable();
    public syncTimelineAndGraphTimestamps: boolean = false;
    private timelineTimerange: GenericUnixtimerange = {start: 0, end: 0};
    private graphTimerange: GenericUnixtimerange = {start: 0, end: 0};

    public priorityClasses: string[] = ['ok-soft', 'ok', 'warning', 'critical-soft', 'critical'];
    public priorities: string[] = [];
    public tags: string[] = [];

    public CustomalertsExists: boolean = false;

    public SlaOverview: false | ServiceBrowserSlaOverview = false;

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

    constructor() {
    }

    public ngOnInit(): void {
        this.getUserTimezone();

        const idOrUuid = String(this.route.snapshot.paramMap.get('idOrUuid'));

        const uuid = new UUID();
        if (uuid.isUuid(idOrUuid)) {
            // UUID was passed via URL
            this.subscriptions.add(this.ServicesService.getServiceByUuid(idOrUuid).subscribe((service) => {
                this.id = Number(service.id);
                this.loadService();
            }));
        } else {
            // ID was passed via URL
            this.id = Number(idOrUuid);
            this.loadService();
        }

        this.route.queryParams.subscribe(params => {
            let selectedTab = params['selectedTab'] || undefined;
            if (selectedTab) {
                this.changeTab(selectedTab);
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
        }));
    }

    public loadService() {
        // Define the configuration for the ServiceBrowserMenuComponent because we know the serviceId now
        this.serviceBrowserConfig = {
            serviceId: this.id,
            showReschedulingButton: true,
            rescheduleCallback: () => {
                console.log('implement callback')
            },
            showBackButton: false
        };

        this.subscriptions.add(this.ServicesService.getServiceBrowser(this.id).subscribe((result) => {
            this.result = result;

            let priority = Number(result.mergedService.priority);
            // Sift priority into array index
            if (priority > 0) {
                priority = priority - 1;
            }
            this.priorities = ['text-muted', 'text-muted', 'text-muted', 'text-muted', 'text-muted']; // make all icons gray
            for (let i = 0; i <= priority; i++) {
                this.priorities[i] = this.priorityClasses[priority]; // set color depending on priority level
            }

            this.tags = String(result.mergedService.tags).split(',');

            for (let key in result.mergedService.Perfdata) {
                const gauge = result.mergedService.Perfdata[key];
                this.availableDataSources.push({
                    key: key, // load this datasource - this is important for Prometheus metrics which have no __name__ like rate() or sum(). We can than load metric 0, 1 or 2...
                    value: gauge.metric // Name of the metric to display in select
                });
            }

            this.loadCustomalerts();
            this.loadSlaInformation();

            this.lastUpdated = new Date();
        }));
    }

    public loadCustomalerts() {
        if (this.result?.mergedService && this.result.mergedService.id) {
            this.subscriptions.add(this.ServicesService.loadCustomAlertExists(this.result.mergedService.id).subscribe((result) => {
                this.CustomalertsExists = result;
            }));
        }
    }

    public loadSlaInformation() {
        if (this.result?.mergedService && this.result.mergedService.id) {
            this.subscriptions.add(this.ServicesService.loadSlaInformation(this.result.mergedService.id).subscribe((result) => {
                this.SlaOverview = result;
            }));
        }
    }

    public changeTab(newTab: ServiceBrowserTabs): void {
        this.selectedTab = newTab;
    }

    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadService();
        }
    }

    public onSyncTimelineAndGraphTimestampsChange(ev: Event) {
        // Gets called when the user toggles the sync checkbox
        if (this.syncTimelineAndGraphTimestamps) {
            // When the checkbox get checked, sync the timeline with the graph
            this.timerange$$.next(this.timelineTimerange);
        }
    }

    public onTimelineTimerangeChange(timerange: GenericUnixtimerange) {
        this.timelineTimerange = timerange;
        console.log("onTimelineTimerangeChange", timerange);
        if (this.syncTimelineAndGraphTimestamps) {
            // Timeline has moved - sync chart with timeline
            this.timerange$$.next(timerange);
        }
    }

    public onGraphTimerangeChange(timerange: GenericUnixtimerange) {
        this.graphTimerange = timerange;
        console.log("onGraphTimerangeChange", timerange);
        if (this.syncTimelineAndGraphTimestamps) {
            // Graph has moved - sync timeline with chart
            this.timerange$$.next(timerange);
        }
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

    public toggleCancelDowntimeModal(serviceDowntime: DowntimeObject) {
        this.selectedItems = [];

        const item: CancelAllItem[] = [{
            id: serviceDowntime.internalDowntimeId
        }];

        // Pass selection to the modal
        this.selectedItems = item;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'cancelAllModal',
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

    protected readonly String = String;
    protected readonly Number = Number;
    protected readonly ServiceBrowserTabs = ServiceBrowserTabs;
    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly HostBrowserTabs = HostBrowserTabs;
    protected readonly Boolean = Boolean;
}
