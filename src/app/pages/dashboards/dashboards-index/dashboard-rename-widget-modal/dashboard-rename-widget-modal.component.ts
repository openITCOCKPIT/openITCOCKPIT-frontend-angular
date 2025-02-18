import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, output } from '@angular/core';
import {
    ButtonCloseDirective,
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
    ModalToggleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { DashboardsService } from '../../dashboards.service';
import { Subscription } from 'rxjs';
import { DashboardRenameWidgetService } from './dashboard-rename-widget.service';

@Component({
    selector: 'oitc-dashboard-rename-widget-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        FormControlDirective,
        FormLabelDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        RequiredIconComponent,
        TranslocoPipe
    ],
    templateUrl: './dashboard-rename-widget-modal.component.html',
    styleUrl: './dashboard-rename-widget-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardRenameWidgetModalComponent implements OnDestroy {

    public widgetTitle: string = '';
    private id: string = '0';

    public titleChangedEvent = output<{ id: string, title: string }>();

    private readonly DashboardsService = inject(DashboardsService);
    private readonly DashboardRenameWidgetService = inject(DashboardRenameWidgetService);

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.DashboardRenameWidgetService.event$.subscribe((event) => {
            // New Event - trigger the modal

            this.id = event.id;
            this.widgetTitle = event.title;

            this.modalService.toggle({
                show: true,
                id: 'dashboardRenameWidgetModal',
            });

        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        if (this.id && this.id !== '0') {
            this.subscriptions.add(this.DashboardsService.renameWidget(Number(this.id), this.widgetTitle).subscribe((response) => {
                if (response.success) {
                    this.notyService.genericSuccess();
                    this.titleChangedEvent.emit({
                        id: this.id,
                        title: this.widgetTitle
                    });

                    // Close the modal
                    this.modalService.toggle({
                        show: false,
                        id: 'dashboardRenameWidgetModal',
                    });

                    this.cdr.markForCheck();
                } else {
                    this.notyService.genericError();
                }
            }));
        }
    }

}
