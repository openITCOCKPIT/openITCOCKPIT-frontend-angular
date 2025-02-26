import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { ChangeCalendarWidgetPost, ChangecalendarWidgetResponse } from '../changecalendar-widget.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ChangecalendarWidgetService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public loadWidgetConfig(widgetId: string): Observable<ChangecalendarWidgetResponse> {
        return this.http.get<ChangecalendarWidgetResponse>(`${this.proxyPath}/changecalendar_module/changecalendars/widget.json`, {
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

    public saveWidgetConfig(widgetId: string, data: ChangeCalendarWidgetPost): Observable<Object> {
        console.warn(data);
        return this.http.post<any>(`${this.proxyPath}/changecalendar_module/changecalendars/widget.json`, data)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            )
            ;
    }
}
