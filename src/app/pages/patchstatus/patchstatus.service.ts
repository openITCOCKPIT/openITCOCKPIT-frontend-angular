import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { PatchstatusIndexParams, PatchstatusIndexRoot } from './patchstatus.interface';

@Injectable({
    providedIn: 'root',
})
export class PatchstatusService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    /**********************
     *    Index action    *
     **********************/

    public getIndex(params: PatchstatusIndexParams): Observable<PatchstatusIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PatchstatusIndexRoot>(`${proxyPath}/patchstatus/index.json`, {
            params: params as {} // cast PatchstatusIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
