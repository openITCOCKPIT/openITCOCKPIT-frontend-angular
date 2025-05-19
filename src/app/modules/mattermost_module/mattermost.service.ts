import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { MattermostSettings, GetMattermostSettings, MattermostSettingsPostResponse } from './mattermost.interface';

@Injectable({
  providedIn: 'root'
})
export class MattermostService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    getMattermostSettings(): Observable<MattermostSettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<GetMattermostSettings>(`${proxyPath}/mattermost_module/MattermostSettings/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: GetMattermostSettings) => {
                return data.mattermostSettings;
            })
        );
    }

    setSMattermostSettings(settings: MattermostSettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<MattermostSettingsPostResponse>(`${proxyPath}/mattermost_module/MattermostSettings/index.json?angular=true`,
             settings
        ).pipe(
            map((data: MattermostSettingsPostResponse): any => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.mattermostSettings as MattermostSettings
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
