import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { PushrelayRegisterAndTestResult, RelayPost } from './pushnotificationsrelay.interface';
import { GenericResponseWrapper, GenericSuccessResponse, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root',
})
export class PushnotificationsrelayService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getRelaySettings(): Observable<{ relay: RelayPost, systemId: string }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ relay: RelayPost, systemId: string }>(`${proxyPath}/notificationsrelay/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public saveRelaySettings(data: RelayPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/notificationsrelay/index.json?angular=true`, {
            Relay: data
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

    public registerAndTestToRelay(data: { address: string, port: number }): Observable<PushrelayRegisterAndTestResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<PushrelayRegisterAndTestResult>(`${proxyPath}/notificationsrelay/testAndRegisterRelay.json`, data);
    }

}
