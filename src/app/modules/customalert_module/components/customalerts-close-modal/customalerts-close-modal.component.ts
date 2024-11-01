import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    AlertComponent,
    BadgeComponent,
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-customalerts-close-modal',
    standalone: true,
    imports: [
        ModalComponent,
        TranslocoDirective,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        FaIconComponent,
        ModalBodyComponent,
        AlertComponent,
        NgIf,
        ColComponent,
        NgForOf,
        RowComponent,
        FormControlDirective,
        BadgeComponent,
        FormsModule,
        ModalFooterComponent,
        XsButtonDirective
    ],
    templateUrl: './customalerts-close-modal.component.html',
    styleUrl: './customalerts-close-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsCloseModalComponent {
    private readonly modalService = inject(ModalService);

    protected comment: string = '';
    protected isProcessing: boolean = false;

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Output() completed = new EventEmitter<boolean>();

    protected closeManually(): void {

    }

    protected hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: 'customalertsCloseModal'
        });
    }
}
