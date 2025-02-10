import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardWidget } from '../../dashboards.interface';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-dashboard-add-widget-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective
    ],
    templateUrl: './dashboard-add-widget-modal.component.html',
    styleUrl: './dashboard-add-widget-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAddWidgetModalComponent {


    public availableWidgets = input<DashboardWidget[]>([]);

    public searchString: string = '';

}
