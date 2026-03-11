import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { TooltipDirective } from '@coreui/angular';
import { NgClass } from '@angular/common';
import { EvcSummaryService } from '../../eventcorrelations.interface';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { AcknowledgementTypes } from '../../../../../../pages/acknowledgements/acknowledgement-types.enum';
import {
    EvcServicestatusToasterComponent
} from '../evc-tree/evc-servicestatus-toaster/evc-servicestatus-toaster.component';
import {
    EvcServicestatusToasterService
} from '../evc-tree/evc-servicestatus-toaster/evc-servicestatus-toaster.service';
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { LocalNumberPipe } from '../../../../../../pipes/local-number.pipe';

@Component({
    selector: 'oitc-evc-table',
    imports: [
        NgClass,
        FaIconComponent,
        TooltipDirective,
        EvcServicestatusToasterComponent,
        TranslocoPipe,
        NgClass,
        FaIconComponent,
        TooltipDirective,
        EvcServicestatusToasterComponent,
        LocalNumberPipe
    ],
    templateUrl: './evc-table.component.html',
    styleUrl: './evc-table.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTableComponent {

    public evcSummaryTree = input<EvcSummaryService[][]>([]);
    public stateForDowntimedService = input<number>(3);
    public stateForDisabledService = input<number>(3);

    public downtimeStateTitle: string = '';
    public disabledStateTitle: string = '';

    public evcSummaryTreeForView: EvcSummaryService[][] = [];

    private readonly TranslocoService = inject(TranslocoService);
    private readonly EvcServicestatusToasterService = inject(EvcServicestatusToasterService);
    private cdr = inject(ChangeDetectorRef);

    private toasterTimeout: any = null;

    constructor() {
        this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
            // ITC-3587 we need to patch in the currentStateConsiderDowntimeOrDisabled field for the score operator
            const evcTree = this.evcSummaryTree();
            for (let layerNumber in evcTree) {
                for (let parentId in evcTree[layerNumber]) {
                    let vService = evcTree[layerNumber][parentId];
                    if (vService.isUsedInScoringOperator) {
                        vService.scheduledDowntimeDepth
                        // true, if this service is used in a scoring operator in the next level.
                        let currentState: number | null = vService.current_state;
                        if (vService.scheduledDowntimeDepth && vService.scheduledDowntimeDepth > 0) {
                            if (this.stateForDowntimedService() !== -1) {
                                // -1 == actual service state
                                currentState = this.stateForDowntimedService();
                            }

                        }
                        if (vService.disabled) {
                            currentState = this.stateForDisabledService();
                        }
                        evcTree[layerNumber][parentId].currentStateConsiderDowntimeOrDisabled = currentState;
                    }
                }

            }

            switch (this.stateForDowntimedService()) {
                case 0:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered ok');
                    break;

                case 1:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered warning');
                    break;

                case 2:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered critical');
                    break;

                case 3:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
                    break;
            }

            switch (this.stateForDisabledService()) {
                case 0:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered ok');
                    break;

                case 1:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered warning');
                    break;

                case 2:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered critical');
                    break;

                case 3:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');
                    break;
            }

        });
    }

    public toggleToaster(serviceId: number | undefined): void {
        this.cancelToaster();
        if (serviceId) {
            this.toasterTimeout = setTimeout(() => {
                this.EvcServicestatusToasterService.setServiceIdToaster(serviceId);
            }, 500);
        }
    }

    public cancelToaster() {
        if (this.toasterTimeout) {
            clearTimeout(this.toasterTimeout);
        }

        this.toasterTimeout = null;
    }

    protected readonly Number = Number;
    protected readonly AcknowledgementTypes = AcknowledgementTypes;
    protected readonly EventcorrelationOperators = EventcorrelationOperators;
}
