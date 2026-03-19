import { Pipe, PipeTransform } from '@angular/core';
import { EvcModalServiceScore } from '../eventcorrelations.interface';

@Pipe({
    name: 'scoreSum',
    pure: false, // Impure pipes run on every change detection cycle. This could kill the performance we have to see.
    // in case we get any performance issues, we have to consider to call markForCheck when the user change a score in the matrix
})
export class ScoreSumPipe implements PipeTransform {
    transform(value: EvcModalServiceScore[], sumType: string): number {
        if (!Array.isArray(value) || typeof sumType !== 'string') return 0;

        let result = 0;
        switch (sumType) {
            case 'warning':
                for (const service of value) {
                    if (service.score_warning !== null) {
                        result += service.score_warning
                    }
                }

                return result;

            case 'critical':
                for (const service of value) {
                    if (service.score_critical !== null) {
                        result += service.score_critical
                    }
                }

                return result;

            case 'unknown':
                for (const service of value) {
                    if (service.score_unknown !== null) {
                        result += service.score_unknown
                    }
                }

                return result;
        }

        // Default to zero
        return 0;
    }
}
