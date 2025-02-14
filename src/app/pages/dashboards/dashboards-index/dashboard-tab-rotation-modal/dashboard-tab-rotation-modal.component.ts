import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SliderTimeComponent } from '../../../../components/slider-time/slider-time.component';

@Component({
    selector: 'oitc-dashboard-tab-rotation-modal',
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
        ModalToggleDirective,
        RowComponent,
        ColComponent,
        FormLabelDirective,
        FormsModule,
        SliderTimeComponent
    ],
    templateUrl: './dashboard-tab-rotation-modal.component.html',
    styleUrl: './dashboard-tab-rotation-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTabRotationModalComponent {

    intervalInput = input<number>(0);
    intervalUpdate = output<number>()

    public interval = 0;
    public tabRotationIntervalText: string = '';

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.interval = this.intervalInput();
        });
    }

    public updateTabRotationInterval() {
        this.intervalUpdate.emit(this.interval);
    }

    public logInterval(): void {
        console.log('interval', this.interval);
    }

}
