import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrafanaPanelOptionsService } from './grafana-panel-options.service';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
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
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { OpenPanelOptionsEvent } from '../grafana-panel/grafana-panel.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import {
    GrafanaChartTypesEnum,
    GrafanaStackingModesEnum
} from '../grafana-panel/chart-type-icon/GrafanaChartTypes.enum';
import { UiBlockerComponent } from '../../../../../../components/ui-blocker/ui-blocker.component';
import { SelectKeyValueOptGroup, SelectKeyValueString } from '../../../../../../layouts/primeng/select.interface';
import { GrafanaUnits } from '../grafana-editor.interface';
import {
    SelectOptgroupComponent
} from '../../../../../../layouts/primeng/select/select-optgroup/select-optgroup.component';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { GrafanaEditorService } from '../grafana-editor.service';

@Component({
    selector: 'oitc-grafana-panel-options-modal',
    imports: [
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        XsButtonDirective,
        TranslocoDirective,
        FaIconComponent,
        ModalToggleDirective,
        ColComponent,
        RowComponent,
        FormControlDirective,
        FormLabelDirective,
        FormsModule,
        NgIf,
        NgClass,
        UiBlockerComponent,
        SelectOptgroupComponent
    ],
    templateUrl: './grafana-panel-options-modal.component.html',
    styleUrl: './grafana-panel-options-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaPanelOptionsModalComponent implements OnDestroy {


    public currentEvent?: OpenPanelOptionsEvent;
    public grafanaUnitsSelect: SelectKeyValueOptGroup[] = [];

    public grafanaUnits = input<GrafanaUnits>();

    private readonly subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly GrafanaEditorService = inject(GrafanaEditorService);
    private readonly GrafanaPanelOptionsService = inject(GrafanaPanelOptionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.GrafanaPanelOptionsService.panel$.subscribe((event) => {
            // New Event - trigger the modal

            this.currentEvent = event;

            this.modalService.toggle({
                show: true,
                id: 'grafanaPanelOptionsModal',
            });

        }));

        effect(() => {
            this.grafanaUnitsSelect = [];

            const grafanaUnits = this.grafanaUnits();
            for (const groupNameTs in grafanaUnits) {
                const groupName = groupNameTs as keyof GrafanaUnits;

                const group: SelectKeyValueOptGroup = {
                    value: groupName,
                    items: []
                }

                for (const key in grafanaUnits[groupName]) {
                    // @ts-ignore
                    const value = grafanaUnits[groupName][key]

                    const item: SelectKeyValueString = {
                        key: key,
                        value: value
                    }
                    group.items.push(item);
                }

                this.grafanaUnitsSelect.push(group);
            }
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeVisualizationType(visualization_type: GrafanaChartTypesEnum) {
        if (!this.currentEvent) {
            return;
        }

        this.currentEvent.panel.visualization_type = visualization_type;

        if (visualization_type !== GrafanaChartTypesEnum.timeseries && visualization_type !== GrafanaChartTypesEnum.barchart) {
            this.currentEvent.panel.stacking_mode = null;
        }

    }

    public changeStackingMode(mode: GrafanaStackingModesEnum) {
        if (!this.currentEvent) {
            return;
        }

        this.currentEvent.panel.stacking_mode = mode;

    }

    public saveOptions() {
        if (!this.currentEvent) {
            return;
        }

        let stacking_mode: GrafanaStackingModesEnum | '' | null = this.currentEvent.panel.stacking_mode;
        if (stacking_mode === null) {
            stacking_mode = '';
        }

        this.subscriptions.add(this.GrafanaEditorService.savePanelUnit(
            this.currentEvent.panel.id,
            this.currentEvent.panel.unit,
            this.currentEvent.panel.title,
            this.currentEvent.panel.visualization_type,
            stacking_mode
        ).subscribe(response => {
            if (response.success) {

                // All done send panel back tp the panel component
                if (this.currentEvent) {
                    this.GrafanaPanelOptionsService.sendUpdatedPanelToPanelComponent({
                        panel: this.currentEvent.panel,
                        panelIndex: this.currentEvent.panelIndex
                    });

                    this.notyService.genericSuccess(
                        this.TranslocoService.translate('Panel options saved successfully')
                    );
                }
            } else {
                this.notyService.genericError(
                    this.TranslocoService.translate('Error while saving panel options')
                );
            }
        }));
    }

    protected readonly GrafanaChartTypesEnum = GrafanaChartTypesEnum;
    protected readonly GrafanaStackingModesEnum = GrafanaStackingModesEnum;
}
