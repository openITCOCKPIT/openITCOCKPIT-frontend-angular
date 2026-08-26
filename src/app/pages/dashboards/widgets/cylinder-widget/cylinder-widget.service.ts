import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValueString } from '../../../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { CylinderWidgetConfigRootResponse } from './cylinder-widget.interface';

@Injectable({
    providedIn: 'root',
})
export class CylinderWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

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

    public saveWidgetConfig(widgetId: string, service_id: number, show_label: boolean, metric: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/cylinderWidget.json?angular=true`, {
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

    public loadWidgetConfig(widgetId: string): Observable<CylinderWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;


        return this.http.get<CylinderWidgetConfigRootResponse>(`${proxyPath}/dashboards/cylinderWidget.json`, {
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
}
