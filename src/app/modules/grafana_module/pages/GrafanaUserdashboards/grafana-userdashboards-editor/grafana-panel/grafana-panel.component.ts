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
import {
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    ButtonGroupComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ChartTypeIconComponent } from './chart-type-icon/chart-type-icon.component';
import { DashboardRowMetric, GrafanaEditorDashboardRow, GrafanaUnits } from '../grafana-editor.interface';

import { LabelLinkComponent } from '../../../../../../layouts/coreui/label-link/label-link.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from '../grafana-editor.service';
import { GrafanaPanelOptionsService } from '../grafana-panel-options-modal/grafana-panel-options.service';
import { GrafanaMetricOptionsService } from '../grafana-metric-options-modal/grafana-metric-options.service';
import { ROOT_CONTAINER } from '../../../../../../pages/changelogs/object-types.enum';


export interface RemovePanelEvent {
    panelIndex: number
    panelId: number
}

export interface OpenPanelOptionsEvent {
    panelIndex: number
    panel_id: number
    panel: GrafanaEditorDashboardRow,
    GrafanaUnits?: GrafanaUnits
}

export interface OpenMetricOptionsEvent {
    panelIndex: number
    row: number,
    panel_id: number,
    service_id: number,
    metric: string,
    metric_id?: number,
    color: string,
    userdashboard_id: number
    containerId: number,
    mode: 'add' | 'edit'
}

export interface MetricUpdatedEvent {
    panelIndex: number,
    panel_id: number,
    metric: DashboardRowMetric
    mode: 'add' | 'edit'
}

@Component({
    selector: 'oitc-grafana-panel',
    imports: [
    RowComponent,
    ColComponent,
    TranslocoDirective,
    ButtonGroupComponent,
    XsButtonDirective,
    FaIconComponent,
    TranslocoPipe,
    ChartTypeIconComponent,
    LabelLinkComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent
],
    templateUrl: './grafana-panel.component.html',
    styleUrl: './grafana-panel.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaPanelComponent implements OnDestroy {

    public panelIndex = input<number>(0);
    public panel = input<GrafanaEditorDashboardRow>();
    public containerId = input<number>(ROOT_CONTAINER);
    public grafanaUnits = input<GrafanaUnits>();

    // Emit the panel when it changes to the parent component
    public panelChangedEvent = output<{ index: number, panel: GrafanaEditorDashboardRow }>();
    public removePanelEvent = output<RemovePanelEvent>();

    public panelLocal?: GrafanaEditorDashboardRow;
    public humanUnit: string = '';

    private subscriptions: Subscription = new Subscription();
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly GrafanaPanelOptionsService = inject(GrafanaPanelOptionsService);
    private readonly GrafanaMetricOptionsService = inject(GrafanaMetricOptionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.GrafanaPanelOptionsService.panelUpdated$.subscribe((event) => {
            // Panel got modified by the Panel Options Modal
            if (!this.panelLocal) {
                return;
            }

            if (event.panelIndex === this.panelIndex() && event.panel_id === this.panelLocal.id) {
                this.panelLocal = event.panel;
                this.setHumanUnit();


                // Notify the parent component that the panel has changed
                this.panelChangedEvent.emit({
                    index: this.panelIndex(),
                    panel: this.panelLocal
                });
            }
        }));

        this.subscriptions.add(this.GrafanaMetricOptionsService.metricUpdated$.subscribe((event) => {
            // Metric got modified by the Metric Options Modal
            if (!this.panelLocal) {
                return;
            }

            if (event.panelIndex === this.panelIndex() && event.panel_id === this.panelLocal.id) {

                if (event.mode === 'add') {
                    this.panelLocal.metrics.push(event.metric);
                } else {
                    // Find the metric and replace it
                    this.panelLocal.metrics = this.panelLocal.metrics.map(m => {
                        if (m.id === event.metric.id) {
                            return event.metric;
                        }

                        return m;
                    });
                }

                this.cdr.markForCheck();

                // Notify the parent component that the panel has changed
                this.panelChangedEvent.emit({
                    index: this.panelIndex(),
                    panel: this.panelLocal
                });
            }
        }));


        effect(() => {
            this.panelLocal = this.panel();
            this.setHumanUnit();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setHumanUnit(): void {
        const grafanaUnits = this.grafanaUnits();

        if (!this.panelLocal || !grafanaUnits) {
            return;
        }

        const selectedUnit = this.panelLocal.unit as keyof GrafanaUnits;

        for (let key in grafanaUnits) {
            const unitKey = key as keyof GrafanaUnits;
            const unitValues = grafanaUnits[unitKey];

            if (unitValues.hasOwnProperty(selectedUnit)) {
                // @ts-ignore
                this.humanUnit = unitValues[selectedUnit];
            }

        }

        if (this.humanUnit === 'None') {
            //Dont show none
            this.humanUnit = '';
        }

        this.cdr.markForCheck();
    }

    public removePanel() {
        if (this.panelLocal) {
            // Notify the parent component that the panel should be removed
            this.removePanelEvent.emit({
                panelIndex: this.panelIndex(),
                panelId: this.panelLocal.id
            });
        }
    }

    public openAddMetric() {
        if (!this.panelLocal) {
            return;
        }

        this.GrafanaMetricOptionsService.toggleMetricOptionsModal({
            panelIndex: this.panelIndex(),
            containerId: this.containerId(),
            row: this.panelLocal.row,
            panel_id: this.panelLocal.id,
            color: '',
            userdashboard_id: this.panelLocal.userdashboard_id,

            service_id: 0, // Default to 0
            metric: '', // Default to empty string
            mode: 'add'
        });
    }

    public openEditMetric(metric: DashboardRowMetric) {
        if (!this.panelLocal) {
            return;
        }

        let color = '';
        if (metric.color) {
            // String(undefined) === 'undefined' in JS -.-
            color = String(metric.color);
        }

        this.GrafanaMetricOptionsService.toggleMetricOptionsModal({
            panelIndex: this.panelIndex(),
            containerId: this.containerId(),
            row: this.panelLocal.row,
            panel_id: this.panelLocal.id,
            userdashboard_id: this.panelLocal.userdashboard_id,

            color: color,
            service_id: metric.service_id,
            metric: metric.metric,
            metric_id: metric.id,
            mode: 'edit'
        });
    }

    public removeMetric(metric: DashboardRowMetric): void {
        if (!this.panelLocal) {
            return;
        }

        this.subscriptions.add(this.GrafanaEditorService.removeMetric(metric.id).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Metric removed successfully')
                );

                if (this.panelLocal) {
                    // Remove the metric from the local panel
                    this.panelLocal.metrics = this.panelLocal.metrics.filter(m => m !== metric);

                    this.cdr.markForCheck();

                    // Notify the parent component that the panel has changed
                    this.panelChangedEvent.emit({
                        index: this.panelIndex(),
                        panel: this.panelLocal
                    });
                }

            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while removing metric')
                );
            }
        }));
    }

    public openPanelOptions() {
        if (!this.panelLocal) {
            return;
        }

        this.GrafanaPanelOptionsService.togglePanelOptionsModal({
            panelIndex: this.panelIndex(),
            panel_id: this.panelLocal.id,
            panel: this.panelLocal,
            GrafanaUnits: this.grafanaUnits()
        });
    }

}
