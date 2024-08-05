import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { MsteamssettingsGetResponse, TeamsSettings } from './msteamssettings.interface';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { GenericResponseWrapper, GenericSuccessResponse, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class MsteamssettingsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMsteamsSettings(): Observable<TeamsSettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<MsteamssettingsGetResponse>(`${proxyPath}/msteams_module/MSTeamsSettings/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: MsteamssettingsGetResponse) => {
                return data.teamsSettings
            })
        )
    }

    public saveMsteamsSettings(data: TeamsSettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/msteams_module/MSTeamsSettings/index.json?angular=true`, data).pipe(
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
