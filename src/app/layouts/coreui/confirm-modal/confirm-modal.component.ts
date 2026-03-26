import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    ViewChild
} from '@angular/core';
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

    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);
    @ViewChild('modal') private modal!: ModalComponent;

    @Input({required: false}) public message: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() confirmation = new EventEmitter<boolean>();


    // Modal functions
    public hideModal(): void {
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: false,
            id: this.modal.id
        });
    }

    public yes(): void {
        this.confirmation.emit(true);
        this.hideModal();
    }

    public no(): void {
        this.confirmation.emit(false);
        this.hideModal();
    }

}
