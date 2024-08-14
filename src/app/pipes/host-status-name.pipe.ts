import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
    name: 'hostStatusName',
    standalone: true
})
export class HostStatusNamePipe implements PipeTransform {

    constructor(private translocoService: TranslocoService) {
    }

    transform(stateId: number | string | undefined): string {
        switch (stateId) {
            case 0:
            case '0':
                return this.translocoService.translate('Up');
            case 1:
            case '1':
                return this.translocoService.translate('Down');
            case 2:
            case '2':
                return this.translocoService.translate('Unreachable');
            default:
                return this.translocoService.translate('Not in monitoring');
        }
    }

}
