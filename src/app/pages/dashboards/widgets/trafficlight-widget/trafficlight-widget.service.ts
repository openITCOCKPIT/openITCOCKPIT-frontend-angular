import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { TrafficlightWidgetConfigRootResponse } from './trafficlight-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class TrafficlightWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<TrafficlightWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;


        return this.http.get<TrafficlightWidgetConfigRootResponse>(`${proxyPath}/dashboards/trafficLightWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, service_id: number, show_label: boolean): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/trafficLightWidget.json?angular=true`, {
            Widget: {
                id: widgetId,
                service_id: service_id
            },
            show_label: show_label
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
