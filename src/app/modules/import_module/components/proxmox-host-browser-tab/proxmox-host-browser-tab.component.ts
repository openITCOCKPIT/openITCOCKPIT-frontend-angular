import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { catchError, EMPTY, merge, Subject, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { ExternalSystemsService } from '../../pages/externalsystems/external-systems.service';
import {
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardSubtitleDirective,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    ModalService,
    ProgressComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AdditionalHostInformationProxmoxResult, ProxmoxPendingChange } from './proxmox-api.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProxmoxStatus } from './proxmox-status.enum';
import { ProxmoxActionsComponent } from './proxmox-actions/proxmox-actions.component';
import { PatchstatusIconComponent } from '../../../../pages/patchstatus/patchstatus-icon/patchstatus-icon.component';
import { DecimalPipe, NgClass } from '@angular/common';
import { ByteToHumanPipe } from '../../../../pipes/byte-to-human.pipe';
import {
    ProxmoxBrowserLoaderComponent
} from '../../../../layouts/primeng/loading/proxmox-browser-loader/proxmox-browser-loader.component';
import { ProxmoxGraphsComponent } from './proxmox-graphs/proxmox-graphs.component';
import { ProxmoxSnapshotsComponent } from './proxmox-snapshots/proxmox-snapshots.component';

import { ProxmoxLoadingModalComponent } from './proxmox-loading-modal/proxmox-loading-modal.component';
import { OnlineOfflineComponent } from '../additional-host-information/online-offline/online-offline.component';
import {
    ProxmoxEditHardwareModalComponent
} from './proxmox-edit-hardware-modal/proxmox-edit-hardware-modal.component';

@Component({
    selector: 'oitc-proxmox-host-browser-tab',
    imports: [
        RowComponent,
        ColComponent,
        ProgressComponent,
        CardComponent,
        CardBodyComponent,
        CardTitleDirective,
        CardSubtitleDirective,
        FaIconComponent,
        CardTextDirective,
        TranslocoDirective,
        AlertComponent,
        ProxmoxActionsComponent,
        PatchstatusIconComponent,
        DecimalPipe,
        TextColorDirective,
        NgClass,
        ByteToHumanPipe,
        ProxmoxBrowserLoaderComponent,
        ProxmoxGraphsComponent,
        ProxmoxSnapshotsComponent,
        ProxmoxLoadingModalComponent,
        OnlineOfflineComponent,
        TooltipDirective,
        TableDirective,
        ButtonDirective,
        ProxmoxEditHardwareModalComponent
    ],
    templateUrl: './proxmox-host-browser-tab.component.html',
    styleUrl: './proxmox-host-browser-tab.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxHostBrowserTabComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public hostId: number = 0;
    @Input() public hostname: string = '';
    @Input() public lastUpdated?: Date; // Change the date to trigger an update from an external component
    @Input() public allowEdit: boolean = false;

    public result?: AdditionalHostInformationProxmoxResult;

    public vmid?: string
    public nodeName?: string
    public status: ProxmoxStatus = ProxmoxStatus.Stopped;
    public overruleShutdown: boolean = true;

    // Pending changes indexed by config key (e.g. pendingChanges['memory'], pendingChanges['cores'])
    public pendingChanges: Record<string, ProxmoxPendingChange> = {};
    public pendingChangesList: ProxmoxPendingChange[] = [];
    public hasPendingChanges: boolean = false;

    // Pending memory in bytes (Proxmox returns the memory in MiB) - undefined if no memory change is pending
    public pendingMemoryBytes?: number;

    private loadTrigger$ = new Subject<void>();
    private subscriptions: Subscription = new Subscription();

    protected readonly ProxmoxStatus = ProxmoxStatus;

    private readonly ExternalSystemsService = inject(ExternalSystemsService);
    private readonly modalService = inject(ModalService);

    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        // Auto refresh every 5 seconds
        const autoRefresh$ = timer(10000, 10000);

        this.subscriptions.add(
            // merge combines the manual triggers (.next()) with the timer
            merge(this.loadTrigger$, autoRefresh$).pipe(
                // switchMap will cancel the previous HTTP request
                switchMap(() => {
                    return this.ExternalSystemsService
                        .getAdditionalHostInformationWithType<AdditionalHostInformationProxmoxResult>(this.hostId);
                    /*
                        .pipe(
                            // Important: Catch errors here, otherwise the 5-second timer will stop permanently in case of an error!
                            catchError(err => {
                                console.error('Request failed', err);
                                this.subscriptions.unsubscribe();
                                return EMPTY;
                            })
                        );

                     */
                }),
                takeWhile(response => {
                    return response.response.status === true;
                }, true),
                catchError(err => {
                    //console.error('Critical error, stop requests:', err);
                    this.subscriptions.unsubscribe();
                    return EMPTY;
                })
            ).subscribe(result => {
                this.result = result;
                this.cdr.markForCheck();
                if (!result.response.status) {
                    this.subscriptions.unsubscribe();
                    return;
                }
                this.processLoadedData(result);
            })
        );
    }


    public ngOnInit(): void {
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

    public toggleEditHardwareModal(): void {
        this.modalService.toggle({
            show: true,
            id: ProxmoxEditHardwareModalComponent.MODAL_ID
        });
    }

    public load(): void {
        // Tell the loadTrigger$ to load the data.
        // We use this approach to be able to cancel the previous HTTP requests becasue the Proxmox API
        // sometimes take a long time to respond, and we don't want to have multiple HTTP requests in flight at the same time.
        this.loadTrigger$.next();
    }

    private processLoadedData(result: AdditionalHostInformationProxmoxResult): void {
        // We use the same API endpoint as the other external systems do, but the data we receive is different.

        this.result = result;
        this.nodeName = result.response.info?.node;
        this.vmid = result.response.info?.vmid.toString();

        // Index pending changes by key for easy lookup in the template
        this.pendingChanges = {};
        this.pendingChangesList = result.response.info?.pending_changes ?? [];
        for (const change of this.pendingChangesList) {
            this.pendingChanges[change.key] = change;
        }
        this.hasPendingChanges = this.pendingChangesList.length > 0;

        this.pendingMemoryBytes = undefined;
        const pendingMemory = this.pendingChanges['memory'];
        const pendingMemoryMiB = this.parseNumber(pendingMemory?.pending);
        if (pendingMemory && pendingMemoryMiB !== undefined && !pendingMemory.delete) {
            this.pendingMemoryBytes = pendingMemoryMiB * 1024 * 1024;
        }

        // Disable overrule-shutdown if Ha is enabled
        // https://github.com/proxmox/pve-manager/blob/59f360414e671d43005cea7f4ff4db07a35319ea/www/manager6/window/GuestStop.js#L25-L26
        this.overruleShutdown = true;
        if (result.response.current?.ha && result.response.current.ha.state !== 'unmanaged') {
            this.overruleShutdown = false;
        }

        // Determine the VM status
        this.status = ProxmoxStatus.Stopped;
        if (result.response.info) {
            switch (result.response.info.status) {
                case 'running':
                    this.status = ProxmoxStatus.Running;
                    break;

                case 'paused':
                    this.status = ProxmoxStatus.Paused;
                    break;

                case 'stopped':
                    this.status = ProxmoxStatus.Stopped;
            }
            if (result.response.current && "lock" in result.response.current) {
                switch (result.response.current.lock) {
                    case 'migrate':
                        this.status = ProxmoxStatus.Migrate;
                        break;
                    case 'suspended':
                        this.status = ProxmoxStatus.Suspended; // Hibernation
                        break;
                }
            }
        }

        this.cdr.markForCheck();
    }

    /**
     * Proxmox returns config values sometimes as number (2) and sometimes as string ("4096" or "current=4096").
     * Returns the first number found in the value or undefined.
     */
    private parseNumber(value: string | number | null | undefined): number | undefined {
        if (value === null || value === undefined) {
            return undefined;
        }
        if (typeof value === 'number') {
            return value;
        }
        const match = value.match(/\d+(\.\d+)?/);
        return match ? Number(match[0]) : undefined;
    }
}
