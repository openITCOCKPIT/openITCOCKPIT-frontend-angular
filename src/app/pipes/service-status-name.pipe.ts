import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
    name: 'serviceStatusName',
    standalone: true
})
export class ServiceStatusNamePipe implements PipeTransform {

    constructor(private translocoService: TranslocoService) {
    }

    transform(stateId: number | string | undefined): string {
        switch (stateId) {
            case 0:
            case '0':
                return this.translocoService.translate('Ok');
            case 1:
            case '1':
                return this.translocoService.translate('Warning');
            case 2:
            case '2':
                return this.translocoService.translate('Critical');
            case 3:
            case '3':
                return this.translocoService.translate('Unknown');
            default:
                return this.translocoService.translate('Not in monitoring');
        }
    }

}
