import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    HostsTopAlertsWidgetConfig,
    HostsTopAlertsWidgetParams,
    HostTopAlertsRootResponse
} from './hosts-top-alerts-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class HostsTopAlertsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<HostsTopAlertsWidgetConfig> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            config: HostsTopAlertsWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/hostsTopAlertsWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: HostsTopAlertsWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/hostsTopAlertsWidget.json?angular=true`, {
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

    public loadHostTopAlerts(filter: HostsTopAlertsWidgetParams): Observable<HostTopAlertsRootResponse> {
        const proxyPath = this.proxyPath;

        return this.http.get<HostTopAlertsRootResponse>(`${proxyPath}/notifications/hostTopNotifications.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
