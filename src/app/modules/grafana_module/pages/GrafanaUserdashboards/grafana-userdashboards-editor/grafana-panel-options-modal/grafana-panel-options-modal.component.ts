import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy } from '@angular/core';
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
import { TranslocoDirective } from '@jsverse/transloco';
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


    private readonly GrafanaPanelOptionsService = inject(GrafanaPanelOptionsService);
    private readonly modalService = inject(ModalService);
    private readonly subscriptions = new Subscription();

    public currentEvent?: OpenPanelOptionsEvent;
    public grafanaUnitsSelect: SelectKeyValueOptGroup[] = [];

    public grafanaUnits = input<GrafanaUnits>();

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

                console.log(this.grafanaUnitsSelect);
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
        // Save the options
    }

    protected readonly GrafanaChartTypesEnum = GrafanaChartTypesEnum;
    protected readonly GrafanaStackingModesEnum = GrafanaStackingModesEnum;
}
