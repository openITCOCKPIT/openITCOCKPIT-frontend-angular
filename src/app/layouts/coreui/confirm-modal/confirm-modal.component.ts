import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { ConfirmModalService } from './confirm-modal.service';

@Component({
    selector: 'oitc-confirm-modal',
    imports: [
        ModalComponent,
        TranslocoDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ModalBodyComponent,
        XsButtonDirective,
        ModalFooterComponent,
        ColComponent,
        RowComponent
    ],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {

    /*
     Use the ConfirmModalService Service to trigger this modal! Like so
        this.ConfirmModalService.ask(confirmModalMessage, confirmModalHelpMessage, data).subscribe(confirmation => {
            console.log(confirmation)
        });
     */

    public readonly ConfirmModalService = inject(ConfirmModalService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);
    @ViewChild('modal') private modal!: ModalComponent;

    public constructor() {
    }

    // Modal functions
    public hideModal(): void {
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: false,
            id: this.modal.id
        });
    }

    public yes(): void {
        this.ConfirmModalService.confirm(true);
        this.hideModal();
    }

    public no(): void {
        this.ConfirmModalService.confirm(false);
        this.hideModal();
    }

}
