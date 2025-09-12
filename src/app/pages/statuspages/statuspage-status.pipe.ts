import { inject, Pipe, PipeTransform } from '@angular/core';
import { CumulatedStatuspagegroupStatus } from '../statuspagegroups/cumulated-statuspagegroup-status.enum';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
    name: 'statuspageStatus'
})
export class StatuspageStatusPipe implements PipeTransform {

    private readonly TranslocoService: TranslocoService = inject(TranslocoService)


    transform(value: CumulatedStatuspagegroupStatus | number, ...args: unknown[]): string {
        switch (value) {
            case CumulatedStatuspagegroupStatus.OPERATIONAL:
                return this.TranslocoService.translate('Operational');

            case CumulatedStatuspagegroupStatus.PERFORMANCE_ISSUES:
                return this.TranslocoService.translate('Performance issues');

            case CumulatedStatuspagegroupStatus.MAJOR_OUTAGE:
                return this.TranslocoService.translate('Major outage');

            case CumulatedStatuspagegroupStatus.UNKNOWN:
                return this.TranslocoService.translate('Unknown');

            default:
                return this.TranslocoService.translate('Not in monitoring');
        }
    }

}
