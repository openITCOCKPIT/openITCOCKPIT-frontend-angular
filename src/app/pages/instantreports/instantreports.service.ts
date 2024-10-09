import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { InstantreportsIndexParams, InstantreportsIndexRoot } from './instantreports.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class InstantreportsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: InstantreportsIndexParams): Observable<InstantreportsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<InstantreportsIndexRoot>(`${proxyPath}/instantreports/index.json`, {
            params: params as {} // cast InstantreportsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/instantreports/delete/${item.id}.json?angular=true`, {});
    }

}
