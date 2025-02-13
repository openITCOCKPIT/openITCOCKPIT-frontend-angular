import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-dashboard-update-available-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        FormsModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        RowComponent,
        ColComponent
    ],
    templateUrl: './dashboard-update-available-modal.component.html',
    styleUrl: './dashboard-update-available-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardUpdateAvailableModalComponent {

    public decisionEvent = output<'PerformUpdate' | 'NeverPerformUpdate'>();

    private readonly modalService = inject(ModalService);

    public neverPerformUpdates() {
        this.decisionEvent.emit('NeverPerformUpdate');

        this.modalService.toggle({
            show: false,
            id: 'dashboardUpdateAvailableModal',
        });
    }

    public performUpdate() {
        this.decisionEvent.emit('PerformUpdate');

        this.modalService.toggle({
            show: false,
            id: 'dashboardUpdateAvailableModal',
        });
    }

}
