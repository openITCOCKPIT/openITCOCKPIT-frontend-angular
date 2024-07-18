import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { HostchecksIndexParams, HostchecksIndexRoot } from './hostchecks.interface';

@Injectable({
    providedIn: 'root'
})
export class HostchecksService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**********************
     *    Index action    *
     **********************/
    public getHostchecksIndex(hostId: number, params: HostchecksIndexParams): Observable<HostchecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostchecksIndexRoot>(`${proxyPath}/hostchecks/index/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
