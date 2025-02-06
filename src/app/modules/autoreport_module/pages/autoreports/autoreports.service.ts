import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DOCUMENT } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

import {
    AutoreportsIndexRoot,
    AutoreportsIndexParams

} from './autoreports.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AutoreportsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getAutoreportsIndex(params: AutoreportsIndexParams): Observable<AutoreportsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportsIndexRoot>(`${proxyPath}/autoreport_module/autoreports/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/autoreport_module/autoreports/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/containers/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

}
