import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnDestroy, output } from '@angular/core';
import { DashboardWidget } from '../../dashboards.interface';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';

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
        ModalToggleDirective,
        RowComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        FormsModule
    ],
    templateUrl: './dashboard-add-widget-modal.component.html',
    styleUrl: './dashboard-add-widget-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAddWidgetModalComponent implements OnDestroy {

    public availableWidgets = input<DashboardWidget[]>([]);
    public addWidgetEvent = output<number>();

    public searchString: string = '';

    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'dashboardAddWidgetModal' && state.show === true) {
                this.searchString = '';

                this.cdr.markForCheck();
            }
        }));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public addWidget(widgetTypeId: number): void {
        this.addWidgetEvent.emit(widgetTypeId);
    }

}
