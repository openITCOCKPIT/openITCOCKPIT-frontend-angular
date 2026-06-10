import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import {
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-proxmox-loading-modal',
    imports: [
        ColComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        RowComponent,
        TranslocoDirective,
        FaIconComponent
    ],
    templateUrl: './proxmox-loading-modal.component.html',
    styleUrl: './proxmox-loading-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxLoadingModalComponent {

    private readonly modalService = inject(ModalService);
    @ViewChild('modal') private modal!: ModalComponent;

}
