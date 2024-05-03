import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { ProxyPost } from './proxy.interface';
import { GenericResponseWrapper, GenericSuccessResponse, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ProxyService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getProxySettings(): Observable<ProxyPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ proxy: ProxyPost }>(`${proxyPath}/proxy/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.proxy
            })
        )
    }

    public saveProxySettings(data: ProxyPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/proxy/index.json?angular=true`, {
            Proxy: data
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: {success: true} as GenericSuccessResponse
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

}
