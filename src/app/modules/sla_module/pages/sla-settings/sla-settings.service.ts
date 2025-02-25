import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { SlaSettingsIndexRoot, SlaSettingsPost } from './sla-settings.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class SlaSettingsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public loadSlaSettings(): Observable<SlaSettingsIndexRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<SlaSettingsIndexRoot>(`${proxyPath}/sla_module/sla_settings/index.json`, {
            params: {
                'angular': true,
            }
        }).pipe(
            map((data: SlaSettingsIndexRoot) => {
                return data;
            })
        )
    }

    public submit(slaSettings: SlaSettingsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/sla_settings/index.json?angular=true`, slaSettings)
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
