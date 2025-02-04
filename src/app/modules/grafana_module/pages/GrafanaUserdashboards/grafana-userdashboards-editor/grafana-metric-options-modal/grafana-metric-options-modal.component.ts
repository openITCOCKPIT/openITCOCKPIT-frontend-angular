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
import { SelectKeyValue, SelectKeyValueString } from '../../../../../../layouts/primeng/select.interface';
import { GrafanaMetricOptionsService } from './grafana-metric-options.service';
import { DashboardRowMetric, GrfanaEditorCurrentMetricPost } from '../grafana-editor.interface';
import { NgClass, NgIf } from '@angular/common';
import { ServicesService } from '../../../../../../pages/services/services.service';
import { ROOT_CONTAINER } from '../../../../../../pages/changelogs/object-types.enum';
import { FormErrorDirective } from '../../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../../layouts/primeng/select/select/select.component';
import { GenericValidationError } from '../../../../../../generic-responses';
import { GrafanaColor, GrafanaColors } from './GrafanaColors.class';


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
        SelectComponent,
        NgClass
    ],
    templateUrl: './grafana-metric-options-modal.component.html',
    styleUrl: './grafana-metric-options-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaMetricOptionsModalComponent implements OnDestroy {

    public services: SelectKeyValue[] = [];
    public metrics: SelectKeyValueString[] = [];
    public unitOfSelectedMetric: string = '';
    public metricUnits: { [key: string]: string } = {};
    public grafanaColors: GrafanaColor[] = [];

    public searchString: string = '';
    public currentMetric?: GrfanaEditorCurrentMetricPost;
    public mode: 'add' | 'edit' = 'add';
    public errors: GenericValidationError | null = null;


    private containerId: number = ROOT_CONTAINER;
    private currentPanelIndex: number = 0;

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
            this.currentPanelIndex = event.panelIndex;

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
                // Update existing metric
                this.currentMetric = {
                    metric: event.metric,
                    metric_id: event.metric_id,
                    service_id: event.service_id,
                    row: event.row,
                    panel_id: event.panel_id,
                    userdashboard_id: event.userdashboard_id,
                    color: event.color
                };

                // Load metrics of the selected service
                this.onServiceChange();
            }

            const gfColors = new GrafanaColors(this.TranslocoService);
            this.grafanaColors = gfColors.getColors();

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
        // Load the metrics of the selected service
        if (!this.currentMetric) {
            return;
        }

        // Reset selected metric as the service has changed
        this.unitOfSelectedMetric = '';
        this.metricUnits = {};

        this.cdr.markForCheck();

        this.subscriptions.add(this.GrafanaEditorService.getPerformanceDataMetricsByServiceId(this.currentMetric.service_id).subscribe(response => {
            this.metrics = [];


            Object.keys(response).forEach(key => {
                this.metrics.push({
                    key: response[key].metric,
                    value: response[key].metric
                });

                this.metricUnits[response[key].metric] = response[key].unit;
            });

            this.cdr.markForCheck();
        }));
    }

    public onMetricChange(): void {
        // Update the selected metric
        if (!this.currentMetric) {
            return;
        }

        this.unitOfSelectedMetric = '';
        if (this.metricUnits && this.metricUnits[this.currentMetric.metric]) {
            this.unitOfSelectedMetric = this.metricUnits[this.currentMetric.metric];
        }
        this.cdr.markForCheck();
    }

    public saveMetric() {
        if (!this.currentMetric) {
            return;
        }

        if (this.mode === 'add') {
            this.subscriptions.add(this.GrafanaEditorService.addMetricToPanel(this.currentMetric)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        const response = result.data as DashboardRowMetric;

                        this.errors = null;

                        // All done - tell the panel that we have a new metric
                        if (this.currentMetric) {
                            this.GrafanaMetricOptionsService.sendUpdatedMetricToPanelComponent({
                                panelIndex: this.currentPanelIndex,
                                panel_id: this.currentMetric.panel_id,
                                metric: response,
                                mode: this.mode
                            });

                            this.notyService.genericSuccess(
                                this.TranslocoService.translate('Metric added successfully')
                            );

                            // Close the modal
                            this.modalService.toggle({
                                show: false,
                                id: 'grafanaMetricOptionsModal',
                            });
                        }

                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.errors = errorResponse;
                        console.log(this.errors);
                    }
                }));

        } else {
            // Edit existing metric
            this.subscriptions.add(this.GrafanaEditorService.editMetricFromPanel(this.currentMetric)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        const response = result.data as DashboardRowMetric;

                        this.errors = null;

                        // All done - tell the panel that we have updated a metric
                        if (this.currentMetric) {
                            this.GrafanaMetricOptionsService.sendUpdatedMetricToPanelComponent({
                                panelIndex: this.currentPanelIndex,
                                panel_id: this.currentMetric.panel_id,
                                metric: response,
                                mode: this.mode
                            });

                            this.notyService.genericSuccess(
                                this.TranslocoService.translate('Metric updated successfully')
                            );

                            // Close the modal
                            this.modalService.toggle({
                                show: false,
                                id: 'grafanaMetricOptionsModal',
                            });
                        }

                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.errors = errorResponse;
                        console.log(this.errors);
                    }
                }));
        }
    }
}
