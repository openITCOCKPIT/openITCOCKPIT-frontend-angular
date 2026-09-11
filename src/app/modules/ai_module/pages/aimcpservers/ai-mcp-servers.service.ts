import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiMcpServer,
    AiMcpServerPost,
    AiMcpServersIndex,
    AiMcpServerSyncResponse,
    AiMcpServerTestResponse
} from './ai-mcp-servers.interface';
import { AiMcpToolsResponse } from '../aiagents/ai-agents.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AiMcpServersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: {}): Observable<AiMcpServersIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiMcpServersIndex>(`${proxyPath}/ai_module/mcpservers/index.json`, {
            params: params as {}
        }).pipe(map(data => data));
    }

    public getEdit(id: number): Observable<AiMcpServer> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ AiMcpServer: AiMcpServer }>(`${proxyPath}/ai_module/mcpservers/edit/${id}.json`, {
            params: {angular: true}
        }).pipe(map(data => data.AiMcpServer));
    }

    public add(server: AiMcpServerPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/mcpservers/add.json?angular=true`, {
            AiMcpServer: server
        }).pipe(
            map(data => ({success: true, data: data.AiMcpServer as GenericIdResponse})),
            catchError((error: any) => of({success: false, data: error.error.error as GenericValidationError}))
        );
    }

    public edit(server: AiMcpServerPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/mcpservers/edit/${id}.json?angular=true`, {
            AiMcpServer: server
        }).pipe(
            map(data => ({success: true, data: data.AiMcpServer as GenericIdResponse})),
            catchError((error: any) => of({success: false, data: error.error.error as GenericValidationError}))
        );
    }

    public delete(id: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/mcpservers/delete/${id}.json?angular=true`, {});
    }

    /**
     * A tools/list, not a ping: the protocol revision this server speaks has
     * no ping and answers initialize with "method not found".
     */
    public test(id: number): Observable<AiMcpServerTestResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiMcpServerTestResponse>(`${proxyPath}/ai_module/mcpservers/test/${id}.json?angular=true`, {})
            .pipe(catchError((error: any) => of(error.error as AiMcpServerTestResponse)));
    }

    public sync(id: number): Observable<AiMcpServerSyncResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiMcpServerSyncResponse>(`${proxyPath}/ai_module/mcpservers/sync/${id}.json?angular=true`, {})
            .pipe(catchError((error: any) => of(error.error as AiMcpServerSyncResponse)));
    }

    public getTools(id: number): Observable<AiMcpToolsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiMcpToolsResponse>(`${proxyPath}/ai_module/mcpservers/tools/${id}.json`, {
            params: {angular: true}
        }).pipe(map(data => data));
    }

    public toggleTool(toolId: number, fields: { is_enabled?: boolean, requires_confirmation?: boolean }): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/mcpservers/toggleTool/${toolId}.json?angular=true`, fields);
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/ai_module/mcpservers/loadContainers.json`, {
            params: {angular: true}
        }).pipe(map(data => data.containers));
    }
}
