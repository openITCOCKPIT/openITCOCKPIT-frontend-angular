import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    output
} from '@angular/core';
import { DashboardWidget } from '../../dashboards.interface';
import {
    ButtonCloseDirective,
    ColComponent,
    FormCheckInputDirective,
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
    FormsModule,
    FormCheckInputDirective
],
    templateUrl: './dashboard-add-widget-modal.component.html',
    styleUrl: './dashboard-add-widget-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAddWidgetModalComponent implements OnDestroy {

    public availableWidgets = input<DashboardWidget[]>([]);
    public availableWidgetsFiltered: DashboardWidget[] = [];

    public addWidgetEvent = output<number>();
    public restoreDefault = output<boolean>();

    public searchString: string = '';

    public createAnother: boolean = false;

    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.availableWidgetsFiltered = this.availableWidgets();
        });

        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'dashboardAddWidgetModal' && state.show === true) {

                // Reset filter
                this.searchString = '';
                this.filterWidgets();

                this.cdr.markForCheck();
            }
        }));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public filterWidgets(): void {
        if (this.searchString === '') {
            this.availableWidgetsFiltered = this.availableWidgets();
            return;
        }

        this.availableWidgetsFiltered = this.availableWidgets().filter((widget) => {
            return widget.title.toLowerCase().includes(this.searchString.toLowerCase());
        });
    }

    public addWidget(widgetTypeId: number): void {
        this.addWidgetEvent.emit(widgetTypeId);

        if (!this.createAnother) {
            this.modalService.toggle({
                id: 'dashboardAddWidgetModal',
                show: false
            });
        }
    }

    public restoreDefaultWidgets(): void {
        this.restoreDefault.emit(true);
        this.modalService.toggle({
            id: 'dashboardAddWidgetModal',
            show: false
        });
    }

}
