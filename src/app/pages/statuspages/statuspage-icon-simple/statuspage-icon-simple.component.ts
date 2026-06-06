import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { CumulatedStatuspagegroupStatus } from '../../statuspagegroups/cumulated-statuspagegroup-status.enum';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-statuspage-icon-simple',
    imports: [
        NgClass,
        TooltipDirective
    ],
    templateUrl: './statuspage-icon-simple.component.html',
    styleUrl: './statuspage-icon-simple.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspageIconSimpleComponent {

    private readonly TranslocoService: TranslocoService = inject(TranslocoService)


    public cumulatedState = input<CumulatedStatuspagegroupStatus | number>(CumulatedStatuspagegroupStatus.NOT_IN_MONITORING)
    public humanState: string = this.TranslocoService.translate('Not in monitoring');
    public btnColor: string = 'btn-primary';

    public constructor() {
        effect(() => {
            switch (this.cumulatedState()) {
                case CumulatedStatuspagegroupStatus.OPERATIONAL:
                    this.humanState = this.TranslocoService.translate('Operational');
                    this.btnColor = 'btn-success';
                    break;

                case CumulatedStatuspagegroupStatus.PERFORMANCE_ISSUES:
                    this.humanState = this.TranslocoService.translate('Performance issues');
                    this.btnColor = 'btn-warning';
                    break;

                case CumulatedStatuspagegroupStatus.MAJOR_OUTAGE:
                    this.humanState = this.TranslocoService.translate('Major outage');
                    this.btnColor = 'btn-danger';
                    break;

                case CumulatedStatuspagegroupStatus.UNKNOWN:
                    this.humanState = this.TranslocoService.translate('Unknown');
                    this.btnColor = 'btn-secondary';
                    break;

                default:
                    this.humanState = this.TranslocoService.translate('Not in monitoring');
                    this.btnColor = 'btn-primary';
                    break;
            }
        });
    }

}
