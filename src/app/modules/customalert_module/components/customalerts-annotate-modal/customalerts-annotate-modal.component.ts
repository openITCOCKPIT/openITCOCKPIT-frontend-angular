import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    AlertComponent,
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent, TextColorDirective
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../directives/debounce.directive';

@Component({
    selector: 'oitc-customalerts-annotate-modal',
    standalone: true,
    imports: [
        ModalComponent,
        TranslocoDirective,
        ButtonCloseDirective,
        FaIconComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        AlertComponent,
        ColComponent,
        FormControlDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        NgForOf,
        ReactiveFormsModule,
        RowComponent,
        XsButtonDirective,
        FormsModule,
        FormCheckComponent,
        FormCheckInputDirective,
        TextColorDirective,
        DebounceDirective
    ],
    templateUrl: './customalerts-annotate-modal.component.html',
    styleUrl: './customalerts-annotate-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsAnnotateModalComponent {
    private readonly modalService = inject(ModalService);

    protected comment: string = '';
    protected acknolage: boolean = true;
    protected isProcessing: boolean = false;

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Output() completed = new EventEmitter<boolean>();

    protected annotate(): void {

    }

    protected hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: 'customalertsAnnotateModal'
        });
    }
}
