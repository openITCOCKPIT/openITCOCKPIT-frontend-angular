import { inject, Injectable } from '@angular/core';
import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { TranslocoService } from '@jsverse/transloco';


@Injectable({
    providedIn: 'root'
})
export class HosttemplatesService {

    private TranslocoService = inject(TranslocoService);


    constructor() {
    }

    public getHosttemplateTypes(): { id: number, name: string, group: string }[] {
        return [
            {
                id: HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE,
                name: this.TranslocoService.translate('Generic templates'),
                group: 'group' // For Select All
            },
            {
                id: HosttemplateTypesEnum.EVK_HOSTTEMPLATE,
                name: this.TranslocoService.translate('EVC templates'),
                group: 'group'
            },
        ];
    }
}
