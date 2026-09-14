import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiLlmProvider,
    AiLlmProviderPost,
    AiLlmProvidersIndex,
    AiLlmProviderModelsResponse,
    AiLlmProviderRequestPreview,
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
                    // /models is authenticated like any other call, so a
                    // header changed on the form has to travel with it.
                    auth_header: post.auth_header,
                    auth_prefix: post.auth_prefix,
                    ignore_ssl_certificate: post.ignore_ssl_certificate
                }
            }
        ).pipe(catchError((error: any) => of(error.error as AiLlmProviderModelsResponse)));
    }

    /**
     * Asks the endpoint one question with the values on the form.
     *
     * test() checks a saved row; this one answers the question somebody has
     * while typing, before there is a row to save.
     */
    public testForm(post: AiLlmProviderPost, id: number = 0): Observable<AiLlmProviderTestResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiLlmProviderTestResponse>(
            `${proxyPath}/ai_module/llmproviders/testForm.json?angular=true`,
            {
                AiLlmProvider: {
                    id: id,
                    base_url: post.base_url,
                    api_key: post.api_key,
                    auth_header: post.auth_header,
                    auth_prefix: post.auth_prefix,
                    model: post.model,
                    temperature: post.temperature,
                    max_tokens: post.max_tokens,
                    extra_headers: post.extra_headers,
                    extra_body: post.extra_body,
                    ignore_ssl_certificate: post.ignore_ssl_certificate
                }
            }
        ).pipe(catchError((error: any) => of(error.error as AiLlmProviderTestResponse)));
    }

    /**
     * Renders the request the current form values would produce.
     *
     * Nothing is sent anywhere: the server assembles it with the same code
     * that would send it and hands it back with the key masked.
     */
    public preview(post: AiLlmProviderPost, id: number = 0): Observable<{ request: AiLlmProviderRequestPreview }> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ request: AiLlmProviderRequestPreview }>(
            `${proxyPath}/ai_module/llmproviders/preview.json?angular=true`,
            {
                AiLlmProvider: {
                    id: id,
                    base_url: post.base_url,
                    api_key: post.api_key,
                    auth_header: post.auth_header,
                    auth_prefix: post.auth_prefix,
                    model: post.model,
                    temperature: post.temperature,
                    max_tokens: post.max_tokens,
                    extra_headers: post.extra_headers,
                    extra_body: post.extra_body
                }
            }
        );
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/ai_module/llmproviders/loadContainers.json`, {
            params: {angular: true}
        }).pipe(map(data => data.containers));
    }
}
