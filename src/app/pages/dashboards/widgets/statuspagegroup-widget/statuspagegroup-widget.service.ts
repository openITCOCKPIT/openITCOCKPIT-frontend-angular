import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { StatuspagegroupWidgetConfig } from './statuspagegroup-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class StatuspagegroupWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<StatuspagegroupWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: StatuspagegroupWidgetConfig = {
            statuspagegroup_id: null,
            refresh_key: 0
        };

        return this.http.get<{
            config: StatuspagegroupWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/statuspagegroups/statuspagegroupWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: StatuspagegroupWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/statuspagegroupWidget.json?angular=true&widgetId=${widgetId}`, config)
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
