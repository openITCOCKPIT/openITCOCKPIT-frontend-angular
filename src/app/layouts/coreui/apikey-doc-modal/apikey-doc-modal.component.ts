import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CoreuiComponent } from '../coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-apikey-doc-modal',
    standalone: true,
    imports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        XsButtonDirective,
        ButtonCloseDirective,
        ModalTitleDirective,
        FaIconComponent,
        CoreuiComponent,
        TranslocoDirective,
        ModalToggleDirective,
        RouterLink,
        RowComponent,
        ColComponent,
    ],
    templateUrl: './apikey-doc-modal.component.html',
    styleUrl: './apikey-doc-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApikeyDocModalComponent {

}
