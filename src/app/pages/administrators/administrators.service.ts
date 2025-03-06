import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { AdministratorsDebugRootResponse } from './administrators.interface';

@Injectable({
    providedIn: 'root'
})
export class AdministratorsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getDebug(): Observable<AdministratorsDebugRootResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AdministratorsDebugRootResponse>(`${proxyPath}/Administrators/debug.json`, {
            params: {
                angular: true,
                isoTimestamp: 1
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
