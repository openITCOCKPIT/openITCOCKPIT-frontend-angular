import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { ProxmoxCommands, ProxmoxStatus } from '../proxmox-status.enum';
import {
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ModalService
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ProxmoxService } from '../proxmox.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ConfirmModalService } from '../../../../../layouts/coreui/confirm-modal/confirm-modal.service';
import { ProxmoxVirtType } from '../proxmox-api.interface';

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
        TranslocoPipe
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
    public overruleShutdown = input<boolean>(true);
    public virtType = input<ProxmoxVirtType>(ProxmoxVirtType.Qemu);

    public confirmModalMessage: string = '';
    public confirmModalHelpMessage: string = '';

    private readonly modalService = inject(ModalService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();
    private readonly ProxmoxService: ProxmoxService = inject(ProxmoxService);
    private readonly notyService = inject(NotyService);
    private readonly ConfirmModalService = inject(ConfirmModalService);


    private currentAction?: ProxmoxCommands;
    private upid: false | string = false;

    // see https://github.com/proxmox/pve-manager/blob/e855296b69c40dd62f929c26da3ea2be00cfffde/www/manager6/qemu/CmdMenu.js#L59-L120
    protected readonly ProxmoxStatus = ProxmoxStatus;

    public constructor() {
        effect(() => {
            // initialize the inputs to trigger the effect when they change
            this.hostId();
            this.nodeName();
            this.vmid();
            this.status();
            this.overruleShutdown();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Run commands that do not require confirmation (e.g. start a vm)
     * @param command
     */
    public runCommand(command: ProxmoxCommands) {
        if (this.hostId() > 0) {
            let params = {};
            if (command === ProxmoxCommands.Stop) {
                params = {
                    overruleShutdown: this.overruleShutdown()
                };
            }

            this.subscriptions.add(this.ProxmoxService.sendProxmoxCommand(this.hostId(), this.nodeName(), this.vmid(), command, this.virtType(), params).subscribe((result) => {
                this.upid = result.result.upid;
                if (result.result.upid) {
                    this.notyService.genericSuccess('Successfully sent command to Proxmox', 'Command');
                } else {
                    this.notyService.genericError(result.result.message, 'Command');
                }
            }));
        }
    }

    public getConfirmation(action: ProxmoxCommands) {
        let confirmModalMessage: string = '';
        let confirmModalHelpMessage: string = '';

        switch (action) {
            case ProxmoxCommands.Pause:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to pause the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Will pause the VM, but keep it in the memory.');
                break;

            case ProxmoxCommands.Suspend:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to hibernate the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Will hibernate the VM, which means it will be stopped and the state will be saved to disk.');
                break;

            case ProxmoxCommands.Shutdown:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to shutdown the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Will send a ACPI shutdown signal to the VM, which will trigger a graceful shutdown.');
                if (this.virtType() === ProxmoxVirtType.Lxc) {
                    confirmModalMessage = this.TranslocoService.translate('Are you sure you want to shutdown the Container?') + ' - ' + this.vmid();
                    confirmModalHelpMessage = this.TranslocoService.translate('Will send a ACPI shutdown signal to the Container, which will trigger a graceful shutdown.');
                }
                break;

            case ProxmoxCommands.Stop:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to stop the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Forces the VM to stop immediately, which may lead to data loss. Use this if the VM is not responding to the shutdown command.');
                if (this.virtType() === ProxmoxVirtType.Lxc) {
                    confirmModalMessage = this.TranslocoService.translate('Are you sure you want to stop the Container?') + ' - ' + this.vmid();
                    confirmModalHelpMessage = this.TranslocoService.translate('Forces the Container to stop immediately, which may lead to data loss. Use this if the Container is not responding to the shutdown command.');
                }
                break;

            case ProxmoxCommands.Reboot:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to reboot the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Gracefully reboots the VM by sending a ACPI shutdown signal. This will also apply pending hardware changes.');
                if (this.virtType() === ProxmoxVirtType.Lxc) {
                    confirmModalMessage = this.TranslocoService.translate('Are you sure you want to reboot the Container?') + ' - ' + this.vmid();
                    confirmModalHelpMessage = this.TranslocoService.translate('Gracefully reboots the Container by sending a ACPI shutdown signal. This will also apply pending hardware changes.');
                }
                break;

            case ProxmoxCommands.Reset:
                confirmModalMessage = this.TranslocoService.translate('Are you sure you want to reset the VM?') + ' - ' + this.vmid();
                confirmModalHelpMessage = this.TranslocoService.translate('Forces the VM to reset immediately, which may lead to data loss. Use this if the VM is not responding to the reboot command.');
                break;

            default:
                confirmModalMessage = this.TranslocoService.translate('Please confirm that you want to perform this action');
                confirmModalHelpMessage = '';
                break;
        }

        this.ConfirmModalService.ask(confirmModalMessage, confirmModalHelpMessage, action).subscribe(confirmation => {
            if (confirmation.decision === true && confirmation.data !== '') {
                const command = confirmation.data as ProxmoxCommands;
                this.runCommand(command);
            }
        });

    }

    protected readonly ProxmoxCommands = ProxmoxCommands;
    protected readonly ProxmoxVirtType = ProxmoxVirtType;
}
