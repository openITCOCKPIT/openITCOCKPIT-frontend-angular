import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { TachometerWidgetConfigRootResponse } from './tachometer-widget.interface';
import { SelectKeyValueString } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class TachometerWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<TachometerWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;


        return this.http.get<TachometerWidgetConfigRootResponse>(`${proxyPath}/dashboards/tachoWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, service_id: number, show_label: boolean, metric: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/tachoWidget.json?angular=true`, {
            Widget: {
                id: widgetId,
                service_id: service_id
            },
            show_label: show_label,
            metric: metric
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

    public loadMetrics(serviceId: number | string): Observable<SelectKeyValueString[]> {
        const proxyPath = this.proxyPath;


        return this.http.get<{
            perfdata: { [key: string]: { metric: string } }
        }>(`${proxyPath}/dashboards/getPerformanceDataMetrics/${serviceId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Only return an array of metrics because we don't need the rest of the data for the config select box
                const metrics: SelectKeyValueString[] = [];
                if (data) {
                    for (const k in data.perfdata) {
                        metrics.push({
                            key: data.perfdata[k].metric,
                            value: data.perfdata[k].metric
                        });
                    }
                }
                return metrics;
            })
        )
    }

}
