import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { ScmSettingsIndex, ScmSettingsPost } from './scmsettings.interface';

@Injectable({
  providedIn: 'root'
})
export class ScmsettingsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public loadScmSettings(): Observable<ScmSettingsIndex> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<ScmSettingsIndex>(`${proxyPath}/scm_module/scm_settings/index.json`, {
            params: {
                'angular': true,
            }
        }).pipe(
            map((data: ScmSettingsIndex) => {
                return data;
            })
        )
    }

    public submit(scmSettings: ScmSettingsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/scm_settings/index.json?angular=true`, scmSettings)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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
