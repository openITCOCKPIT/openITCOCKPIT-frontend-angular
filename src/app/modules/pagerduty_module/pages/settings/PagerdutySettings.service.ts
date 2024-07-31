import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { PagerdutySettings, PagerdutySettingsGet, PagerdutySettingsPostResponse } from './PagerdutySettings.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class PagerdutySettingsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    getPagerdutySettings(): Observable<PagerdutySettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<PagerdutySettingsGet>(`${proxyPath}/pagerduty_module/settings/edit.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: PagerdutySettingsGet) => {
                return data.settings.PagerdutySettings;
            })
        );
    }

    setPagerdutySettings(settings: PagerdutySettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<PagerdutySettingsPostResponse>(`${proxyPath}/pagerduty_module/settings/edit.json?angular=true`, {
            PagerdutySettings: settings
        }).pipe(
            map((data: PagerdutySettingsPostResponse): any => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.settings  as PagerdutySettings
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