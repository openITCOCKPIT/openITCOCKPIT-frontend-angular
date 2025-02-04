import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';
import {
    DefaultAutoreportSettings,
    AllAutoreportSettings,
    AutoreportSettingsRoot,
    AutoreportSettingsPostResponse
} from './autoreport-settings.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { OpenstreetmapSettingsPostResponse } from '../../../openstreetmap_module/pages/openstreetmap.interface';

@Injectable({
    providedIn: 'root'
})
export class AutoreportSettingsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getSettingsIndex(): Observable<AutoreportSettingsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportSettingsRoot>(`${proxyPath}/autoreport_module/autoreport_settings/indexAngular.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public setSettingsIndex(post: AllAutoreportSettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<AutoreportSettingsPostResponse>(`${proxyPath}/autoreport_module/autoreport_settings/index.json?angular=true`,
            post
        ).pipe(
            map((data: AutoreportSettingsPostResponse) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
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
