import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiLlmProvider,
    AiLlmProviderPost,
    AiLlmProvidersIndex,
    AiLlmProviderModelsResponse,
    AiLlmProviderTestResponse
} from './ai-llm-providers.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AiLlmProvidersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: {}): Observable<AiLlmProvidersIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiLlmProvidersIndex>(`${proxyPath}/ai_module/llmproviders/index.json`, {
            params: params as {}
        }).pipe(map(data => data));
    }

    public getEdit(id: number): Observable<AiLlmProvider> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ AiLlmProvider: AiLlmProvider }>(`${proxyPath}/ai_module/llmproviders/edit/${id}.json`, {
            params: {angular: true}
        }).pipe(map(data => data.AiLlmProvider));
    }

    public add(provider: AiLlmProviderPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/llmproviders/add.json?angular=true`, {
            AiLlmProvider: provider
        }).pipe(
            map(data => ({success: true, data: data.AiLlmProvider as GenericIdResponse})),
            catchError((error: any) => of({success: false, data: error.error.error as GenericValidationError}))
        );
    }

    public edit(provider: AiLlmProviderPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/llmproviders/edit/${id}.json?angular=true`, {
            AiLlmProvider: provider
        }).pipe(
            map(data => ({success: true, data: data.AiLlmProvider as GenericIdResponse})),
            catchError((error: any) => of({success: false, data: error.error.error as GenericValidationError}))
        );
    }

    public delete(id: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/llmproviders/delete/${id}.json?angular=true`, {});
    }

    /** Sends one trivial completion so a wrong key or model shows up here. */
    public test(id: number): Observable<AiLlmProviderTestResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiLlmProviderTestResponse>(`${proxyPath}/ai_module/llmproviders/test/${id}.json?angular=true`, {})
            .pipe(catchError((error: any) => of(error.error as AiLlmProviderTestResponse)));
    }

    /**
     * Asks the endpoint which models it serves, from what is typed in the form
     * rather than from a saved row - the moment this helps is while a provider
     * is being created. An empty key on an existing one means the stored key.
     */
    public loadModels(post: AiLlmProviderPost, id: number = 0): Observable<AiLlmProviderModelsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiLlmProviderModelsResponse>(
            `${proxyPath}/ai_module/llmproviders/loadModels.json?angular=true`,
            {
                AiLlmProvider: {
                    id: id,
                    base_url: post.base_url,
                    api_key: post.api_key,
                    ignore_ssl_certificate: post.ignore_ssl_certificate
                }
            }
        ).pipe(catchError((error: any) => of(error.error as AiLlmProviderModelsResponse)));
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/ai_module/llmproviders/loadContainers.json`, {
            params: {angular: true}
        }).pipe(map(data => data.containers));
    }
}
