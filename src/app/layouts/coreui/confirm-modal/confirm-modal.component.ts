import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
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


    public message = input<string>('');
    public helpMessage = input<string>('');
    @Output() confirmation = new EventEmitter<boolean>();

    public constructor() {
        effect(() => {
            this.message();
            this.helpMessage();
        });
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
        this.confirmation.emit(true);
        this.hideModal();
    }

    public no(): void {
        this.confirmation.emit(false);
        this.hideModal();
    }

}
