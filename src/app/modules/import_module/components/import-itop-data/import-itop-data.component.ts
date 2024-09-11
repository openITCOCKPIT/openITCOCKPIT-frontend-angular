import { Component, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ProgressComponent, RowComponent
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
  selector: 'oitc-import-itop-data',
  standalone: true,
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        TranslocoPipe
    ],
  templateUrl: './import-itop-data.component.html',
  styleUrl: './import-itop-data.component.css'
})
export class ImportITopDataComponent {
    @ViewChild('modal') private modal!: ModalComponent;


    public loadDataFromITopp(){
        console.log('loadDataFromITopp');
    }

    public hideModal() {

    }
}
