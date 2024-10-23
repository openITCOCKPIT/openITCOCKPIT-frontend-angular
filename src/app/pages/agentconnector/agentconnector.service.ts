import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import {
    AgentconnectorAgentConfigRoot,
    AgentconnectorWizardInstallRoot,
    AgentconnectorWizardLoadHostsByStringParams
} from './agentconnector.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { AgentConfig } from './agentconfig.interface';

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

    public saveAgentConfig(config: AgentConfig, hostId: number, pushAgentId: number | null): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/agentconnector/config.json`, {
            config: config,
            hostId: hostId,
            pushAgentId: pushAgentId
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public loadAgentConfigForInstall(hostId: number): Observable<AgentconnectorWizardInstallRoot> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<AgentconnectorWizardInstallRoot>(`${proxyPath}/agentconnector/install.json`, {
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
