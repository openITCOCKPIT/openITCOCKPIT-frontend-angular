import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { ColComponent, ModalService, RowComponent, TooltipDirective } from '@coreui/angular';
import { catchError, EMPTY, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxStatus } from '../proxmox-status.enum';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    ProxmoxGetSnapshotsParams,
    ProxmoxGetTaskStatusParams,
    ProxmoxRollbackSnapshotData,
    ProxmoxSnapshotNested
} from '../proxmox-api.interface';
import { ContainerTypesEnum } from '../../../../../pages/changelogs/object-types.enum';
import { ProxmoxSnapshotNestComponent } from './proxmox-snapshot-nest/proxmox-snapshot-nest.component';
import { ConfirmModalService } from '../../../../../layouts/coreui/confirm-modal/confirm-modal.service';
import {
    ProxmoxCreateSnapshotModalComponent
} from '../proxmox-create-snapshot-modal/proxmox-create-snapshot-modal.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-proxmox-snapshots',
    imports: [
        ProxmoxSnapshotNestComponent,
        RowComponent,
        ColComponent,
        TranslocoDirective,
        TranslocoPipe,
        TooltipDirective,
        ProxmoxCreateSnapshotModalComponent,
        XsButtonDirective
    ],
    templateUrl: './proxmox-snapshots.component.html',
    styleUrl: './proxmox-snapshots.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxSnapshotsComponent implements OnDestroy {

    public hostId = input<number>(0);
    public vmid = input<string>('');
    public nodeName = input<string>('');
    public status = input<ProxmoxStatus>(ProxmoxStatus.Stopped);

    public nestedSnapshots: ProxmoxSnapshotNested[] = [];

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();
    private pollingSub: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);
    private readonly ProxmoxService: ProxmoxService = inject(ProxmoxService);
    private readonly ConfirmModalService = inject(ConfirmModalService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);

    public constructor() {
        effect(() => {
            // initialize the inputs to trigger the effect when they change
            this.hostId();
            this.nodeName();
            this.vmid();
            this.status();

            this.loadSnapshots();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.pollingSub.unsubscribe();
    }

    public loadSnapshots() {
        if (this.hostId() == 0 || this.vmid() == '') {
            return;
        }

        const params: ProxmoxGetSnapshotsParams = {
            node: this.nodeName(),
            vmid: this.vmid(),
            type: 'qemu'
        };
        this.subscriptions.add(
            this.ProxmoxService.getSnapshots(this.hostId(), params).subscribe((result) => {
                this.nestedSnapshots = result.snapshots_nested;
                this.cdr.markForCheck();
            })
        );
    }

    public rollbackSnapshot(snapshotName: string) {
        const msg = this.TranslocoService.translate('Are you sure you want to rollback the system?') + ' - ' + snapshotName;
        const help = this.TranslocoService.translate('Current state will be lost.', {0: snapshotName});

        this.ConfirmModalService.ask(msg, help, snapshotName).subscribe(confirmation => {
            if (confirmation.decision === true) {
                // YES - Rollback Snapshot
                // Show loading modal
                const data: ProxmoxRollbackSnapshotData = {
                    node: this.nodeName(),
                    vmid: this.vmid(),
                    snapshotName: snapshotName,
                    type: 'qemu'
                };
                this.subscriptions.add(this.ProxmoxService.rollbackSnapshot(this.hostId(), data).subscribe(response => {
                    if (response.result.upid === false) {
                        this.notyService.genericError(response.result.message);
                        return;
                    }

                    // Success - wait for task to be finished
                    this.lockUntilTaskHasFinished(response.result.upid);
                }));
            }
        });
    }

    public deleteSnapshot(snapshotName: string) {
        const msg = this.TranslocoService.translate('Are you sure you want to delete the snapshot?') + ' - ' + snapshotName;
        this.ConfirmModalService.ask(msg, '', snapshotName).subscribe(confirmation => {
            if (confirmation.decision === true) {
                // YES - Delete Snapshot
                const data: ProxmoxRollbackSnapshotData = {
                    node: this.nodeName(),
                    vmid: this.vmid(),
                    snapshotName: snapshotName,
                    type: 'qemu'
                };
                this.subscriptions.add(this.ProxmoxService.deleteSnapshot(this.hostId(), data).subscribe(response => {
                    if (response.result.upid === false) {
                        this.notyService.genericError(response.result.message);
                        return;
                    }

                    // Success - wait for task to be finished
                    this.lockUntilTaskHasFinished(response.result.upid);
                }));
            }
        });
    }

    public toggleCreateSnapshotModal() {
        this.modalService.toggle({
            show: true,
            id: 'proxmoxCreateSnapshotModal'
        });
    }

    private lockUntilTaskHasFinished(upid: string) {
        // Show loading modal
        setTimeout(() => {
            this.modalService.toggle({
                show: true,
                id: 'proxmoxLoadingModal',
            });
        }, 50);

        // Auto refresh every second
        const params: ProxmoxGetTaskStatusParams = {
            node: this.nodeName(),
            upid: upid
        };
        this.pollingSub = timer(500, 2000).pipe(
            switchMap(() => this.ProxmoxService.getTaskStatus(this.hostId(), params)),
            // Stop polling if task status is stopped and return the last value
            takeWhile(res => {
                return res.status.status !== 'stopped';
            }, true),
            catchError(err => {
                console.error('Critical error, stop polling:', err);
                return EMPTY;
            })
        ).subscribe({
            next: (res) => {
                if (res.status.status === 'stopped') {
                    if (res.status.exitstatus === 'OK') {
                        const message = this.TranslocoService.translate('Task finished successfully');
                        this.notyService.genericSuccess(message, 'Snapshot');

                        return;
                    } else {
                        // Stopped but with error
                        this.notyService.genericError(res.status.exitstatus, 'Snapshot');
                    }
                }
            },
            complete: () => {
                // Polling completed
                // Unlock the frontend
                this.modalService.toggle({
                    show: false,
                    id: 'proxmoxLoadingModal',
                });

                // Reload
                this.loadSnapshots();
            }
        });

    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
