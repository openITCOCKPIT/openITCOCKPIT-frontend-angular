import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SlasConfig, SlasSummaryWidgetResponse } from '../sla-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class SlasSummaryWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public loadWidgetConfig(widgetId: string): Observable<SlasSummaryWidgetResponse> {
        const proxyPath = this.proxyPath;

        return this.http.get<SlasSummaryWidgetResponse>(`${proxyPath}/sla_module/slas/slasSummaryWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: SlasConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/slasSummaryWidget.json?angular=true`, {
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
