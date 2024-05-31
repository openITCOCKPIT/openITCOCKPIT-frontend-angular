import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { HostescalationIndexRoot, HostescalationsIndexParams } from './hostescalations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';


@Injectable({
    providedIn: 'root'
})
export class HostescalationsService {

    private TranslocoService = inject(TranslocoService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostescalationsIndexParams): Observable<HostescalationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationIndexRoot>(`${proxyPath}/hostescalations/index.json`, {
            params: params as {} // cast HostescalationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hostescalations/delete/${item.id}.json?angular=true`, {});
    }
}
