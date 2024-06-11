import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HostTypesEnum } from './hosts.enum';
import { PermissionsService } from '../../permissions/permissions.service';
import { TranslocoService } from '@jsverse/transloco';
import { HostsIndexFilter, HostsIndexParams, HostsIndexRoot } from './hosts.interface';


@Injectable({
    providedIn: 'root'
})
export class HostsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    constructor() {
    }


    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/hosts/delete/${item.id}.json`, {});
    }

    /**********************
     *    Index action    *
     **********************/
    public getHostTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: HostTypesEnum.GENERIC_HOST,
                name: this.TranslocoService.translate('Generic host'),
            }
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: HostTypesEnum.EVK_HOST,
                    name: this.TranslocoService.translate('EVC host'),
                });
            }
        });

        return types;
    }

    public getIndex(params: HostsIndexParams, filter: HostsIndexFilter): Observable<HostsIndexRoot> {
        const proxyPath = this.proxyPath;
        // ITC-2599 Change load function to use POST
        return this.http.post<HostsIndexRoot>(`${proxyPath}/hosts/index.json`, {
            filter: filter as {} // POST data used for filter
        }, {
            params: params as {} // query string parameter
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
