import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { HostDefaultsIndexParams, HostDefaultsIndexRoot } from './hostdefaults.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class HostdefaultsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostDefaultsIndexParams): Observable<HostDefaultsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostDefaultsIndexRoot>(`${proxyPath}/import_module/host_defaults/index.json`, {
            params: params as {} // cast ExternalMonitoringsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/host_defaults/delete/${item.id}.json?angular=true`, {});
    }
}
