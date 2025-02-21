import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { SlaCalendarWidgetResponse, SlaWidgetResponse } from '../sla-widget.interface';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
  providedIn: 'root'
})
export class SlaCalendarWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

  constructor() { }

    public loadWidgetConfig(widgetId: string): Observable<SlaCalendarWidgetResponse> {
        const proxyPath = this.proxyPath;

        return this.http.get<SlaCalendarWidgetResponse>(`${proxyPath}/sla_module/slas/slaCalendarWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, slaId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/slaCalendarWidget.json?angular=true`, {
            Widget: {
                id: widgetId
            },
            Sla: {
                id: slaId
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
