import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    OrganizationalchartsByStringParams,
    OrganizationalchartWidgetConfig
} from './organizationalchart-widget.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class OrganizationalchartWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public loadWidgetConfig(widgetId: string): Observable<OrganizationalchartWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: OrganizationalchartWidgetConfig = {
            organizationalchart_id: null,
            refresh_key: 0
        };

        return this.http.get<{
            config: OrganizationalchartWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/organizationalCharts/organizationalchartWidget.json`, {
            params: {
                angular: true,
                widgetId: widgetId
            }
        }).pipe(
            map(data => {

                // Merge default config with loaded config
                data.config = Object.assign(defaultConfig, data.config);
                return data.config
            })
        )
    }

    public saveWidgetConfig(widgetId: string, config: OrganizationalchartWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/organizationalCharts/organizationalchartWidget.json?angular=true&widgetId=${widgetId}`, config)
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

    public loadOrganizationalchartsByString(params: OrganizationalchartsByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/organizationalCharts/loadOrganizationalChartsByString.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.organizationalCharts;
            })
        )
    }
}
