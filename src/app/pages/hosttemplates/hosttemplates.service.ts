import { inject, Injectable } from '@angular/core';
import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { HosttemplateIndexRoot, HosttemplatesIndexParams } from './hosttemplates.interface';


@Injectable({
    providedIn: 'root'
})
export class HosttemplatesService {

    private TranslocoService = inject(TranslocoService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

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

    public getIndex(params: HosttemplatesIndexParams): Observable<HosttemplateIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateIndexRoot>(`${proxyPath}/hosttemplates/index.json`, {
            params: params as {} // cast HosttemplatesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
