import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import {
    ButtonCloseDirective, ModalBodyComponent,
    ModalComponent, ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        FaIconComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        XsButtonDirective,
        TrustAsHtmlPipe
    ],
    selector: "oitc-long-output-modal",
    styleUrl: "./long-output-modal.component.css",
    templateUrl: "./long-output-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LongOutputModalComponent {
    @Input({required: true}) public outputHtmlString: string = '';
    private readonly modalService = inject(ModalService);


    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'longOutputModal'
        });
    }
}
