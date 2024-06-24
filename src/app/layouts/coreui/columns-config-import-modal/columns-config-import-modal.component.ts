import {Component, inject, EventEmitter, Output, ViewChild, Input} from '@angular/core';
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
    RowComponent, FormControlDirective,
} from '@coreui/angular';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'oitc-columns-config-import-modal',
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
        NgIf,
        FormControlDirective
    ],
  templateUrl: './columns-config-import-modal.component.html',
  styleUrl: './columns-config-import-modal.component.css'
})
export class ColumnsConfigImportModalComponent {
    public configString: string = '';
    public configArray: boolean[] = []
    public error: boolean  = false;
    public errorMessage = 'Column config is not for this table'
    @Input({required: true}) public columnsTableKey :string = '';
    @Output() toImport = new EventEmitter<boolean[]>();
    private readonly modalService = inject(ModalService);
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal(){
        this.error = false;
        this.configString = '';
        this.modalService.toggle({
            show: false,
            id: 'columnsConfigImportModal'
        });
    }

    public sendConfig() {
        try {
            var configObject = JSON.parse(this.configString);
            if (configObject.key == this.columnsTableKey && Array.isArray(configObject.value)) {
                this.toImport.emit(configObject.value);
                this.hideModal();
            } else if (configObject.key != this.columnsTableKey) {
                this.error = true
                this.errorMessage = 'Column config is not for this table';
            } else {
                this.error = true;
                this.errorMessage = 'Unable to import config';
            }
        } catch(e) {
            this.error = true;
            this.errorMessage = 'Unable to import config';
        }

    }

}
