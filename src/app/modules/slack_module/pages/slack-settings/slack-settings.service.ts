import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { TranslocoService } from "@jsverse/transloco";
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { GetSlackSettings,SlackSettings, SlackSettingsPostResponse } from './slack-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SlackSettingsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);
    private readonly TranslocoService = inject(TranslocoService);

    getSlackSettings(): Observable<SlackSettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<GetSlackSettings>(`${proxyPath}/slack_module/slack_settings/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: GetSlackSettings) => {
                return data.settings;
            })
        );
    }

    setSlackSettings(settings: SlackSettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<SlackSettingsPostResponse>(`${proxyPath}/slack_module/slack_settings/index.json?angular=true`, {
            SlackSettings: settings
        }

        ).pipe(
            map((data: SlackSettingsPostResponse): any => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.settings as SlackSettings
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
