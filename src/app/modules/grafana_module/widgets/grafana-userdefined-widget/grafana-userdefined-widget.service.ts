import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { GrafanaUserdefinedWidgetConfigRootResponse } from './grafana-userdefined-widget.interface';
import { GrafanaUserdashboardsIndexRoot } from '../../pages/GrafanaUserdashboards/grafana-userdashboards.interface';

@Injectable({
    providedIn: 'root'
})
export class GrafanaUserdefinedWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<GrafanaUserdefinedWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;


        return this.http.get<GrafanaUserdefinedWidgetConfigRootResponse>(`${proxyPath}/grafana_module/grafana_userdashboards/grafanaWidget.json`, {
            params: {
                angular: true,
                widgetId: widgetId
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public saveWidgetConfig(widgetId: string, dashboard_id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/grafanaWidget.json?angular=true`, {
            Widget: {
                id: widgetId
            },
            dashboard_id: dashboard_id
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

    public loadGrafanaDashboards(): Observable<GrafanaUserdashboardsIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<GrafanaUserdashboardsIndexRoot>(`${proxyPath}/grafana_module/grafana_userdashboards/index.json`, {
            params: {
                'angular': true,
                'skipUnsyncDashboards': true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
