import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { TenantsIndexParams, TenantsIndexRoot } from './tenant.interface';

@Injectable({
    providedIn: 'root'
})
export class TenantsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: TenantsIndexParams): Observable<TenantsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TenantsIndexRoot>(`${proxyPath}/tenants/index.json`, {
            params: params as {} // cast TenantsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/tenants/delete/${item.id}.json`, {});
    }
}
