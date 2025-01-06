import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { ColComponent, RowComponent, TableDirective, TooltipDirective } from '@coreui/angular';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { EvcSummaryService } from '../../eventcorrelations.interface';
import {
    ServicestatusSimpleIconComponent
} from '../../../../../../pages/services/servicestatus-simple-icon/servicestatus-simple-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { AcknowledgementTypes } from '../../../../../../pages/acknowledgements/acknowledgement-types.enum';
import {
    EvcServicestatusToasterComponent
} from '../evc-tree/evc-servicestatus-toaster/evc-servicestatus-toaster.component';
import {
    EvcServicestatusToasterService
} from '../evc-tree/evc-servicestatus-toaster/evc-servicestatus-toaster.service';

@Component({
    selector: 'oitc-evc-table',
    imports: [
        ColComponent,
        NgIf,
        RowComponent,
        TableDirective,
        NgClass,
        NgForOf,
        ServicestatusSimpleIconComponent,
        FaIconComponent,
        TooltipDirective,
        PermissionDirective,
        EvcServicestatusToasterComponent
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

    private readonly TranslocoService = inject(TranslocoService);
    private readonly EvcServicestatusToasterService = inject(EvcServicestatusToasterService);
    private cdr = inject(ChangeDetectorRef);

    private toasterTimeout: any = null;

    constructor() {
        this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
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
}
