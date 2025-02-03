import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormLabelDirective,
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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from '../grafana-editor.service';
import { SelectKeyValue } from '../../../../../../layouts/primeng/select.interface';
import { GrafanaMetricOptionsService } from './grafana-metric-options.service';
import { GrfanaEditorCurrentMetricPost } from '../grafana-editor.interface';
import { NgIf } from '@angular/common';
import { ServicesService } from '../../../../../../pages/services/services.service';
import { ROOT_CONTAINER } from '../../../../../../pages/changelogs/object-types.enum';
import { FormErrorDirective } from '../../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../../layouts/primeng/select/select/select.component';
import { GenericValidationError } from '../../../../../../generic-responses';


@Component({
    selector: 'oitc-grafana-metric-options-modal',
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        FormsModule,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        NgIf,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent
    ],
    templateUrl: './grafana-metric-options-modal.component.html',
    styleUrl: './grafana-metric-options-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaMetricOptionsModalComponent implements OnDestroy {

    public services: SelectKeyValue[] = [];
    public metrics: SelectKeyValue[] = [];

    public searchString: string = '';
    public currentMetric?: GrfanaEditorCurrentMetricPost;
    public mode: 'add' | 'edit' = 'add';
    public errors: GenericValidationError | null = null;


    private containerId: number = ROOT_CONTAINER;

    private readonly subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly GrafanaMetricOptionsService = inject(GrafanaMetricOptionsService);
    private readonly ServicesService = inject(ServicesService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.GrafanaMetricOptionsService.metric$.subscribe((event) => {
            // New Event - trigger the modal

            this.services = [];
            this.mode = event.mode; // add or edit
            this.currentMetric = undefined;
            this.containerId = event.containerId;

            // Reset errors
            this.errors = null;

            // Create a new metric
            this.currentMetric = {
                metric: '', // non selected yet
                service_id: 0, // non selected yet
                row: event.row,
                panel_id: event.panel_id,
                userdashboard_id: event.userdashboard_id,
                color: event.color
            };

            if (event.mode === 'edit') {
                // Update extisting metric
                this.currentMetric = {
                    metric: event.metric,
                    service_id: event.service_id,
                    row: event.row,
                    panel_id: event.panel_id,
                    userdashboard_id: event.userdashboard_id,
                    color: event.color
                };
            }

            this.loadServices('');

            this.modalService.toggle({
                show: true,
                id: 'grafanaMetricOptionsModal',
            });

        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe
    }

    public loadServices = (searchString: string) => {
        if (!searchString) {
            searchString = '';
        }


        const selected: number[] = [];

        if (this.currentMetric) {
            if (this.currentMetric.service_id > 0) {
                selected.push(this.currentMetric.service_id);
            }
        }

        this.subscriptions.add(this.ServicesService.loadServicesByContainerId(
            this.containerId,
            searchString,
            selected,
            true
        ).subscribe(response => {
            this.services = [];
            response.forEach(service => {
                this.services.push({
                    key: service.value.Service.id,
                    value: service.value.Host.name + '/' + service.value.Service.servicename,
                });
            });

            this.cdr.markForCheck();

        }));
    }

    /**
     * Callback when the user selects a service to load the metrics of the service
     */
    public onServiceChange(): void {
        console.log('load metrics');
    }

    public saveMetric() {

    }
}
