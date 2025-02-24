import { inject, Injectable } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    HostStatusOverviewExtendedWidgetConfig,
    HostStatusOverviewExtendedWidgetResponse
} from './host-status-overview-extended-widget.interface';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class HostStatusOverviewExtendedWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getHostStatusOverviewExtendedWidget(widget: WidgetGetForRender): Observable<HostStatusOverviewExtendedWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostStatusOverviewExtendedWidgetResponse>(`${proxyPath}/dashboards/hostStatusOverviewExtendedWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: HostStatusOverviewExtendedWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/hostStatusOverviewExtendedWidget.json?angular=true`, {
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
