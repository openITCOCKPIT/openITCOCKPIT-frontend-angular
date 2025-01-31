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
import { NgIf } from '@angular/common';
import { LabelLinkComponent } from '../../../../../../layouts/coreui/label-link/label-link.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from '../grafana-editor.service';


export interface RemovePanelEvent {
    panelIndex: number
    panelId: number
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
        NgIf,
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
    public grafanaUnits = input<GrafanaUnits>();

    // Emit the panel when it changes to the parent component
    public panelChangedEvent = output<{ index: number, panel: GrafanaEditorDashboardRow }>();
    public removePanelEvent = output<RemovePanelEvent>();

    public panelLocal?: GrafanaEditorDashboardRow;
    public humanUnit: string = '';

    private subscriptions: Subscription = new Subscription();
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
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

    public editMetric(metric: DashboardRowMetric) {

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

}
