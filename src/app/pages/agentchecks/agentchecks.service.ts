import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { AgentchecksIndexParams, AgentchecksIndexRoot } from './agentchecks.interface';

@Injectable({
    providedIn: 'root'
})
export class AgentchecksService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: AgentchecksIndexParams): Observable<AgentchecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AgentchecksIndexRoot>(`${proxyPath}/agentchecks/index.json`, {
            params: params as {} // cast TenantsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
