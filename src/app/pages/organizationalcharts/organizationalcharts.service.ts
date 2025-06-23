import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { OrganizationalChartsIndexParams, OrganizationalChartsIndexRoot } from './organizationalcharts.interface';

@Injectable({
    providedIn: 'root'
})
export class OrganizationalChartsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: OrganizationalChartsIndexParams): Observable<OrganizationalChartsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OrganizationalChartsIndexRoot>(`${proxyPath}/organizationalCharts/index.json`, {
            params: params as {} // cast LocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/organizationalCharts/delete/${item.id}.json`, {});
    }
}
