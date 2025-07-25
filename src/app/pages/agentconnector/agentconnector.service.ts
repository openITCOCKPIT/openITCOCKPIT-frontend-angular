import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import {
    AgentconnectorAgentConfigRoot,
    AgentconnectorAutoTlsSatelliteTaskResponse,
    AgentconnectorCreateServiceRoot,
    AgentconnectorSelectAgentRoot,
    AgentconnectorWizardAutoTlsRoot,
    AgentconnectorWizardInstallRoot,
    AgentconnectorWizardLoadHostsByStringParams,
    AgentServiceForCreate,
    CreateAgentServicesPostResponse
} from './agentconnector.interface';
import {
    GenericIdResponse,
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../generic-responses';
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

    public loadAutoTls(hostId: number, reExchangeAutoTLS: boolean = false): Observable<AgentconnectorWizardAutoTlsRoot> {
        const proxyPath: string = this.proxyPath;

        let params: any = {
            angular: true,
            hostId: hostId
        };
        if (reExchangeAutoTLS) {
            params['reExchangeAutoTLS'] = 'true'
        }

        return this.http.get<AgentconnectorWizardAutoTlsRoot>(`${proxyPath}/agentconnector/autotls.json`, {
            params: params
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadSatelliteResponse(satellite_task_id: number): Observable<AgentconnectorAutoTlsSatelliteTaskResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AgentconnectorAutoTlsSatelliteTaskResponse>(`${proxyPath}/agentconnector/satellite_response.json`, {
            params: {
                task_id: satellite_task_id,
                angular: true
            }
        });
    }

    public loadPushAgents(hostId: number): Observable<AgentconnectorSelectAgentRoot> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<AgentconnectorSelectAgentRoot>(`${proxyPath}/agentconnector/select_agent.json`, {
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

    public savePushAgentAssignment(selectedPushAgentId: number, hostId: number, agentUuid: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/agentconnector/select_agent.json?angular=true`, {
            pushagent: {
                id: selectedPushAgentId,
                host_id: hostId,
                agent_uuid: agentUuid
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public loadCreateServices(hostId: number, testConnection: boolean = false): Observable<AgentconnectorCreateServiceRoot> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<AgentconnectorCreateServiceRoot>(`${proxyPath}/agentconnector/create_services.json`, {
            params: {
                angular: true,
                hostId: hostId,
                testConnection: testConnection
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public saveCreateServices(hostId: number, services: AgentServiceForCreate[]): Observable<CreateAgentServicesPostResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<CreateAgentServicesPostResponse>(`${proxyPath}/agentconnector/create_services.json`, {
            services: services
        }, {
            params: {
                angular: true,
                hostId: hostId
            }
        });
    }
}
