import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ButtonCloseDirective, ModalBodyComponent,
    ModalComponent, ModalFooterComponent,
    ModalHeaderComponent,
    ModalService, ModalTitleDirective,
    ModalToggleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-prometheus-help',
    imports: [
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        FaIconComponent,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        ModalFooterComponent
    ],
    templateUrl: './prometheus-help.component.html',
    styleUrl: './prometheus-help.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusHelpComponent {
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    @Input({required: true}) public uuid: string = '';

    protected showModal(): void {
        this.modalService.toggle({
            show: true,
            id: 'promQLHelpModal'
        });
        this.cdr.markForCheck();
    }
}
