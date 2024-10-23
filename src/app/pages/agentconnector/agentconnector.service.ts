import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { AgentconnectorAgentConfigRoot, AgentconnectorWizardLoadHostsByStringParams } from './agentconnector.interface';

@Injectable({
    providedIn: 'root'
})
export class AgentconnectorService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    // This Service is used by the AgentconnectorWizardComponent
    constructor() {
    }

    public loadHostsByString(params: AgentconnectorWizardLoadHostsByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${proxyPath}/agentconnector/loadHostsByString/1.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.hosts;
            })
        );
    }

    public loadIsConfigured(hostId: number): Observable<boolean> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{ isConfigured: boolean }>(`${proxyPath}/agentconnector/wizard.json`, {
            params: {
                angular: true,
                hostId: hostId
            }
        }).pipe(
            map(data => {
                return data.isConfigured;
            })
        );
    }

    public loadAgentConfig(hostId: number): Observable<AgentconnectorAgentConfigRoot> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<AgentconnectorAgentConfigRoot>(`${proxyPath}/agentconnector/config.json`, {
            params: {
                angular: true,
                hostId: hostId
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
