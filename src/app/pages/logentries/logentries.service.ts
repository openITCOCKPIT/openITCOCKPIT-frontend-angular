import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LogentriesRoot, LogentryIndexParams } from './logentries.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class LogentriesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: LogentryIndexParams): Observable<LogentriesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LogentriesRoot>(`${proxyPath}/logentries/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
