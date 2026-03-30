import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxStatus } from '../proxmox-status.enum';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ProxmoxGetSnapshotsParams, ProxmoxSnapshotNested } from '../proxmox-api.interface';
import { ContainerTypesEnum } from '../../../../../pages/changelogs/object-types.enum';
import { ProxmoxSnapshotNestComponent } from './proxmox-snapshot-nest/proxmox-snapshot-nest.component';
import { ConfirmModalService } from '../../../../../layouts/coreui/confirm-modal/confirm-modal.service';

@Component({
    selector: 'oitc-proxmox-snapshots',
    imports: [
        ProxmoxSnapshotNestComponent,
        RowComponent,
        ColComponent,
        TranslocoDirective,
        TranslocoPipe,
        TooltipDirective
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
    private cdr = inject(ChangeDetectorRef);
    private readonly ProxmoxService: ProxmoxService = inject(ProxmoxService);
    private readonly ConfirmModalService = inject(ConfirmModalService);
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
        let msg = this.TranslocoService.translate('Rollback \'{0}\'? Current state will be lost.', {0: snapshotName});
        this.ConfirmModalService.ask(msg, '', snapshotName).subscribe(confirmation => {
            console.log(confirmation)
        });
    }

    public deleteSnapshot(snapshotName: string) {
        let msg = this.TranslocoService.translate('Are you sure you want to delete the snapshot \'{0}\'?', {0: snapshotName});
        this.ConfirmModalService.ask(msg, '', snapshotName).subscribe(confirmation => {
            console.log(confirmation)
        });
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
