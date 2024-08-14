import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { HostBrowserMenuConfig, HostsBrowserMenuComponent } from '../hosts-browser-menu/hosts-browser-menu.component';
import { NgClass, NgIf } from '@angular/common';
import { BrowserLoaderComponent } from '../../../layouts/primeng/loading/browser-loader/browser-loader.component';
import { HostBrowserResult, HostBrowserSlaOverview, MergedHost } from '../hosts.interface';
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

@Component({
    selector: 'oitc-hosts-browser',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        QueryHandlerCheckerComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        HostsBrowserMenuComponent,
        NgIf,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        CardFooterComponent,
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
        HostStatusNamePipe
    ],
    templateUrl: './hosts-browser.component.html',
    styleUrl: './hosts-browser.component.css'
})
export class HostsBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public hostBrowserConfig?: HostBrowserMenuConfig;

    public result?: HostBrowserResult;
    public selectedTab: HostBrowserTabs = HostBrowserTabs.StatusInformation;
    public selectedItems: any[] = [];

    public GrafanaIframe?: GrafanaIframeUrlForDatepicker;

    public selectedGrafanaTimerange: string = 'now-3h';
    public selectedGrafanaAutorefresh: string = '60s';

    public AdditionalInformationExists: boolean = false;

    public SlaOverview: false | HostBrowserSlaOverview = false;

    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public readonly PermissionsService = inject(PermissionsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);


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
            this.result = result;

            this.loadGrafanaIframeUrl();
            this.loadAdditionalInformation();
            this.loadSlaInformation();
        }));
    }

    public loadGrafanaIframeUrl(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadHostGrafanaIframeUrl(String(this.result.mergedHost.uuid), this.selectedGrafanaTimerange, this.selectedGrafanaAutorefresh).subscribe((result) => {
                this.GrafanaIframe = result;
            }));
        }
    }

    public loadAdditionalInformation(): void {
        if (this.result?.mergedHost) {
            this.subscriptions.add(this.HostsService.loadAdditionalInformation(this.result.mergedHost.id).subscribe((result) => {
                this.AdditionalInformationExists = result;
            }));
        }
    }

    public loadSlaInformation(): void {
        if (this.result?.mergedHost && this.result.mergedHost.sla_id) {
            this.subscriptions.add(this.HostsService.loadSlaInformation(this.result.mergedHost.id, this.result.mergedHost.sla_id).subscribe((result) => {
                this.SlaOverview = result;
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

    protected readonly HostBrowserTabs = HostBrowserTabs;
    protected readonly Number = Number;
}
