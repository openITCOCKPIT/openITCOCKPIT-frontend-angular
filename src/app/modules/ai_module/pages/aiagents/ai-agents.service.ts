import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiAgent,
    AiAgentPost,
    AiAgentPromptResponse,
    AiAgentsIndex,
    AiAgentsIndexParams,
    AiMcpServersOptionResponse,
    AiMcpToolsResponse
} from './ai-agents.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AiAgentsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: AiAgentsIndexParams): Observable<AiAgentsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiAgentsIndex>(`${proxyPath}/ai_module/agents/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getEdit(id: number): Observable<AiAgent> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ AiAgent: AiAgent }>(`${proxyPath}/ai_module/agents/edit/${id}.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data.AiAgent;
            })
        );
    }

    /**********************
     *    Add action      *
     **********************/
    public add(agent: AiAgentPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/agents/add.json?angular=true`, {
            AiAgent: agent
        }).pipe(
            map(data => {
                return {success: true, data: data.AiAgent as GenericIdResponse};
            }),
            catchError((error: any) => {
                return of({success: false, data: error.error.error as GenericValidationError});
            })
        );
    }

    /**********************
     *    Edit action     *
     **********************/
    public edit(agent: AiAgentPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/agents/edit/${id}.json?angular=true`, {
            AiAgent: agent
        }).pipe(
            map(data => {
                return {success: true, data: data.AiAgent as GenericIdResponse};
            }),
            catchError((error: any) => {
                return of({success: false, data: error.error.error as GenericValidationError});
            })
        );
    }

    public delete(id: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/agents/delete/${id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/ai_module/agents/loadContainers.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data.containers;
            })
        );
    }

    public loadProviders(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ providers: SelectKeyValue[] }>(`${proxyPath}/ai_module/agents/loadProviders.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data.providers;
            })
        );
    }

    /**
     * The MCP instances, with what each one is for and whose rights it uses.
     */
    public loadMcpServers(): Observable<AiMcpServersOptionResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiMcpServersOptionResponse>(`${proxyPath}/ai_module/agents/loadMcpServers.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**
     * What the selected instance can actually do.
     *
     * Read from the instance rather than from a list kept in the frontend: the
     * toolsets file is replaceable and customers are meant to invent their own
     * sets, so a hardcoded list would be wrong the day somebody does.
     */
    public loadTools(mcpServerId: number): Observable<AiMcpToolsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiMcpToolsResponse>(`${proxyPath}/ai_module/mcpservers/tools/${mcpServerId}.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public toggleTool(toolId: number, fields: { is_enabled?: boolean, requires_confirmation?: boolean }): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/mcpservers/toggleTool/${toolId}.json?angular=true`, fields);
    }

    /** Reads the agent's assembled system prompt, optionally refreshing it. */
    public getPrompt(id: number, refresh: boolean): Observable<AiAgentPromptResponse> {
        const proxyPath = this.proxyPath;
        if (refresh) {
            return this.http.post<AiAgentPromptResponse>(`${proxyPath}/ai_module/agents/prompt/${id}.json?angular=true`, {});
        }
        return this.http.get<AiAgentPromptResponse>(`${proxyPath}/ai_module/agents/prompt/${id}.json`, {
            params: {angular: true}
        });
    }

    public seedRecommended(providerId: number, containerId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/agents/seedRecommended.json?angular=true`, {
            ai_llm_provider_id: providerId,
            container_id: containerId
        }).pipe(
            map(data => {
                return {success: true, data: data};
            }),
            catchError((error: any) => {
                return of({success: false, data: error.error as GenericValidationError});
            })
        );
    }
}
