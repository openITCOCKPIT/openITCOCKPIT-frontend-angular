import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
export class ProxmoxActionsComponent {

    public vmid = input<string>('');
    public nodeName = input<string>('');
    public status = input<ProxmoxStatus>(ProxmoxStatus.Stopped);

    private readonly modalService = inject(ModalService);

    // see https://github.com/proxmox/pve-manager/blob/e855296b69c40dd62f929c26da3ea2be00cfffde/www/manager6/qemu/CmdMenu.js#L59-L120
    protected readonly ProxmoxStatus = ProxmoxStatus;

    public onConfirmation(decision: boolean) {
        console.log(decision);
    }

    public getConfirmation(action: string) {
        this.modalService.toggle({
            show: true,
            id: 'confirmModal'
        });
    }
}
