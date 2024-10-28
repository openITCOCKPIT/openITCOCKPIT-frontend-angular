import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { MkchecksIndexParams, MkchecksIndexRoot } from './mkchecks.interface';

@Injectable({
    providedIn: 'root'
})
export class MkchecksService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: MkchecksIndexParams): Observable<MkchecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkchecksIndexRoot>(`${proxyPath}/checkmk_module/mkchecks/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/checkmk_module/mkchecks/delete/${item.id}.json`, {});
    }
}
