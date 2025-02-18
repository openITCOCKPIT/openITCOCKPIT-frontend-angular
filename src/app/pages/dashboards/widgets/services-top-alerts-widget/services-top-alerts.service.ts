import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    ServicesTopAlertsRootResponse,
    ServicesTopAlertsWidgetConfig,
    ServicesTopAlertsWidgetParams
} from './services-top-alerts-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class ServicesTopAlertsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<ServicesTopAlertsWidgetConfig> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            config: ServicesTopAlertsWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/servicesTopAlertsWidget.json`, {
            params: {
                angular: true,
                widgetId: widgetId
            }
        }).pipe(
            map(data => {
                return data.config
            })
        )
    }

    public saveWidgetConfig(widgetId: string, config: ServicesTopAlertsWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/servicesTopAlertsWidget.json?angular=true`, {
            ...config,
            Widget: {
                id: widgetId
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericResponse
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

    public loadServiceTopAlerts(filter: ServicesTopAlertsWidgetParams): Observable<ServicesTopAlertsRootResponse> {
        const proxyPath = this.proxyPath;

        return this.http.get<ServicesTopAlertsRootResponse>(`${proxyPath}/notifications/serviceTopNotifications.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
