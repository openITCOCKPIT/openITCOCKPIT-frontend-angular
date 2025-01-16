import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { IsarFlowSettingsPost, LoadIsarFlowSettingsResponse } from './isar-flow-settings.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class IsarFlowSettingsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadIsarFlowSettings(): Observable<LoadIsarFlowSettingsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadIsarFlowSettingsResponse>(`${proxyPath}/isarflow_module/isarflow_settings/index.json`, {
            params: {
                angular: 'true'
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveIsarFlowSettings(isarFlowSettings: IsarFlowSettingsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/isarflow_module/isarflow_settings/index.json?angular=true`, isarFlowSettings)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.isarflowSettings as IsarFlowSettingsPost
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
