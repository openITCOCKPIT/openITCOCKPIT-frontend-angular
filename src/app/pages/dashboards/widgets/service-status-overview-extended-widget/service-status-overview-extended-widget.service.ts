import { inject, Injectable } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    ServiceStatusOverviewExtendedWidgetConfig,
    ServiceStatusOverviewExtendedWidgetResponse
} from './service-status-overview-extended-widget.interface';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ServiceStatusOverviewExtendedWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getServiceStatusOverviewExtendedWidget(widget: WidgetGetForRender): Observable<ServiceStatusOverviewExtendedWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceStatusOverviewExtendedWidgetResponse>(`${proxyPath}/dashboards/serviceStatusOverviewExtendedWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: ServiceStatusOverviewExtendedWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/serviceStatusOverviewExtendedWidget.json?angular=true`, {
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
