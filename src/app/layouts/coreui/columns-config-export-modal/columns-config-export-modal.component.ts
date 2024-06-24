import { Component, inject, Input, Output, ViewChild } from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {
    ButtonCloseDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalService,
    ButtonDirective,
    ModalFooterComponent,
    ModalBodyComponent,
    RowComponent,
    InputGroupComponent,
    InputGroupTextDirective, FormControlDirective
} from '@coreui/angular';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import { CopyToClipboardComponent } from '../copy-to-clipboard/copy-to-clipboard.component';

@Component({
  selector: 'oitc-columns-config-export-modal',
  standalone: true,
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonDirective,
        FaIconComponent,
        ModalFooterComponent,
        ModalBodyComponent,
        RowComponent,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        CopyToClipboardComponent,
        FormControlDirective
    ],
  templateUrl: './columns-config-export-modal.component.html',
  styleUrl: './columns-config-export-modal.component.css'
})
export class ColumnsConfigExportModalComponent {

    @Input({required: true}) public configString :string = '';
    private readonly modalService = inject(ModalService);
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal(){
        this.modalService.toggle({
            show: false,
            id: 'columnsConfigExportModal'
        });
    }

}
