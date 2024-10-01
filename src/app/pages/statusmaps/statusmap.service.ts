import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { StatusmapsIndexParmas, StatusmapsIndexRootResult } from './statusmap.interface';

@Injectable({
    providedIn: 'root'
})
export class StatusmapService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**********************
     *    Index action    *
     **********************/
    public getIndex(params: StatusmapsIndexParmas): Observable<StatusmapsIndexRootResult> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<StatusmapsIndexRootResult>(`${proxyPath}/statusmaps/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
