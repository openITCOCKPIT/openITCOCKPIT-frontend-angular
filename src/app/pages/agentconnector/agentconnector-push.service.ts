import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { AgentconnectorPushParams, AgentconnectorPushRoot } from './agentconnector.interface';
import { map, Observable } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class AgentconnectorPushService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    // Each action requires its own delete method.
    // Therefor we have to create a new service for each action.
    constructor() {
    }

    public getPush(params: AgentconnectorPushParams): Observable<AgentconnectorPushRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AgentconnectorPushRoot>(`${proxyPath}/agentconnector/push.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/agentconnector/delete_push_agent/${item.id}.json`, {});
    }

}
