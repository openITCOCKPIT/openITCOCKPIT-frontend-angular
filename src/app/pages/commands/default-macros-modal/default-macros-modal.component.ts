import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    InputSignal,
    OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';

import { MacrosService } from '../../macros/macros.service';
import { DefaultMacros } from '../../../components/code-mirror-container/code-mirror-container.interface';

@Component({
    selector: 'oitc-default-macros-modal',
    imports: [
        ModalToggleDirective,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        FaIconComponent,
        XsButtonDirective,
        ButtonCloseDirective,
        TranslocoDirective,
        TableDirective,
        ModalFooterComponent
    ],
    templateUrl: './default-macros-modal.component.html',
    styleUrl: './default-macros-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultMacrosModalComponent implements OnDestroy {

    public defaultMacros: InputSignal<DefaultMacros[]> = input.required<DefaultMacros[]>();

    private subscriptions: Subscription = new Subscription();
    private MacrosService = inject(MacrosService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
