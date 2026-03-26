import { ChangeDetectionStrategy, Component, inject, input, OnDestroy } from '@angular/core';
import { ProxmoxStatus } from '../proxmox-status.enum';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ModalService
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ConfirmModalComponent } from '../../../../../layouts/coreui/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { ProxmoxService } from '../proxmox.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-proxmox-actions',
    imports: [
        DropdownComponent,
        XsButtonDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        FaIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        ConfirmModalComponent
    ],
    templateUrl: './proxmox-actions.component.html',
    styleUrl: './proxmox-actions.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxActionsComponent implements OnDestroy {

    public hostId = input<number>(0);
    public vmid = input<string>('');
    public nodeName = input<string>('');
    public status = input<ProxmoxStatus>(ProxmoxStatus.Stopped);

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private readonly ProxmoxService: ProxmoxService = inject(ProxmoxService);
    private readonly notyService = inject(NotyService);


    private currentAction?: string;
    private upid: false | string = false;

    // see https://github.com/proxmox/pve-manager/blob/e855296b69c40dd62f929c26da3ea2be00cfffde/www/manager6/qemu/CmdMenu.js#L59-L120
    protected readonly ProxmoxStatus = ProxmoxStatus;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onConfirmation(decision: boolean) {
        if (decision === true && this.currentAction && this.hostId() > 0) {
            this.subscriptions.add(this.ProxmoxService.sendProxmoxCommand(this.hostId(), this.nodeName(), this.vmid(), this.currentAction, 'qemu').subscribe((result) => {
                console.log(result);
                this.upid = result.upid;
                if (result.upid) {
                    this.notyService.genericSuccess('Successfully sent command to Proxmox', 'Command');
                }
            }));
        }
    }

    /**
     * Run commands that do not require confirmation (e.g. start a vm)
     * @param command
     */
    public runCommand(command: string) {
        console.log(this.status());
        if (this.hostId() > 0) {
            this.subscriptions.add(this.ProxmoxService.sendProxmoxCommand(this.hostId(), this.nodeName(), this.vmid(), command, 'qemu').subscribe((result) => {
                console.log(result);
                this.upid = result.upid;
                if (result.upid) {
                    this.notyService.genericSuccess('Successfully sent command to Proxmox', 'Command');
                }
            }));
        }
    }

    public getConfirmation(action: string) {
        this.currentAction = action;
        this.modalService.toggle({
            show: true,
            id: 'confirmModal'
        });
    }
}
