import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { EventcorrelationSettingsPost } from './eventcorrelation-settings.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class EventcorrelationSettingsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getEventcorrelationSettings(): Observable<EventcorrelationSettingsPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            currentEventcorrelationSettings: EventcorrelationSettingsPost
        }>(`${proxyPath}/eventcorrelation_module/eventcorrelation_settings/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.currentEventcorrelationSettings
            })
        )
    }

    public save(eventcorrelationSettings: EventcorrelationSettingsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelation_settings/index.json?angular=true`, {
            EventcorrelationSetting: eventcorrelationSettings
        })
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
