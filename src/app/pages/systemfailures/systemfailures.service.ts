import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SystemfailureIndexParams, SystemfailureIndexRoot } from './systemfailures.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemfailuresService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: SystemfailureIndexParams): Observable<SystemfailureIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemfailureIndexRoot>(`${proxyPath}/systemfailures/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/systemfailures/delete/${item.id}.json?angular=true`, {});
    }
}
