import { inject, Injectable } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    ServiceStatusOverviewWidgetConfig,
    ServiceStatusOverviewWidgetResponse
} from './service-status-overview-widget.interface';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ServiceStatusOverviewWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getServiceStatusOverviewWidget(widget: WidgetGetForRender): Observable<ServiceStatusOverviewWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceStatusOverviewWidgetResponse>(`${proxyPath}/dashboards/serviceStatusOverviewWidget.json`, {
            params: {
                angular: true,
                'widgetId': widget.id
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveWidgetConfig(widgetId: string, config: ServiceStatusOverviewWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/serviceStatusOverviewWidget.json?angular=true`, {
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
}
