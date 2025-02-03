import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import {
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GrafanaEditorDashboardRow, GrafanaUnits } from '../grafana-editor.interface';
import { GrafanaPanelComponent, RemovePanelEvent } from '../grafana-panel/grafana-panel.component';
import { NgIf } from '@angular/common';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from '../grafana-editor.service';
import { Subscription } from 'rxjs';

export interface RowPanelsChangedEvent {
    rowIndex: number
    panels: GrafanaEditorDashboardRow[]
}


@Component({
    selector: 'oitc-grafana-row',
    imports: [
        CardComponent,
        BorderDirective,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TranslocoDirective,
        ColComponent,
        RowComponent,
        GrafanaPanelComponent,
        NgIf,
    ],
    templateUrl: './grafana-row.component.html',
    styleUrl: './grafana-row.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaRowComponent {

    public rowIndex = input<number>(0);
    public panels = input<GrafanaEditorDashboardRow[]>([]);
    public grafanaUnits = input<GrafanaUnits>();

    // Emits the new panels to the parent component
    public panelsChangedEvent = output<RowPanelsChangedEvent>();
    public removeRowEvent = output<number>();
    public createPanelEvent = output<number>();

    public panelsLocal: GrafanaEditorDashboardRow[] = [];

    private readonly subscriptions: Subscription = new Subscription();
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);


    constructor() {
        effect(() => {

            this.panelsLocal = [];
            this.panelsLocal = this.panels();

            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public onPanelRemove(event: RemovePanelEvent): void {
        this.subscriptions.add(this.GrafanaEditorService.removePanel(event.panelId).subscribe(response => {
            if (response.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('Panel removed successfully')
                );

                this.panelsLocal.splice(event.panelIndex, 1);

                this.cdr.markForCheck();

                // Notify the parent component that the panels have changed
                this.panelsChangedEvent.emit({
                    rowIndex: this.rowIndex(),
                    panels: this.panelsLocal
                });

            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while removing panel')
                );
            }
        }));
    }

    public removeRow(): void {
        // Notify the parent component that the row should be removed
        this.removeRowEvent.emit(this.rowIndex());
    }

    public createPanel() {
        // Notify the parent component that a new panel should be created
        this.createPanelEvent.emit(this.rowIndex());
    }

}
