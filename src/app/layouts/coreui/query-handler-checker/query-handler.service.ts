import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { QueryHandler } from './query-handler.interfaces';

@Injectable({
    providedIn: 'root'
})
export class QueryHandlerService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public load(): Observable<QueryHandler> {
        const proxyPath = this.proxyPath;
        // ITC-2599 Change load function to use POST
        return this.http.get<{ QueryHandler: QueryHandler }>(`${proxyPath}/angular/queryhandler.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.QueryHandler;
            })
        );
    }
}
