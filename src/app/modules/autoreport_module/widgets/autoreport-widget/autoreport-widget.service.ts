import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { AutoreportWidgetConfig, AutoreportWidgetConfigRootResponse } from './autoreport-widget.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AutoreportWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<AutoreportWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;

        let defaultConfig: AutoreportWidgetConfig = {
            id: 0,
            in_percent: true,
            set_color_dynamically: false,
            show_update_date: true,
            show_bar_chart: true
        };

        return this.http.get<AutoreportWidgetConfigRootResponse>(`${proxyPath}/autoreport_module/autoreports/autoreportWidget.json`, {
            params: {
                angular: true,
                widgetId: widgetId
            }
        }).pipe(
            map(data => {

                // Merge default config with loaded config
                data.config.Autoreport = Object.assign(defaultConfig, data.config.Autoreport);

                return data;
            })
        )
    }

    public saveWidgetConfig(widgetId: string, config: AutoreportWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/autoreportWidget.json?angular=true`, {
            Widget: {
                id: widgetId
            },
            Autoreport: config
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

    public loadAutoreports(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            autoreports: { key: number, value: { id: number, name: string } }[]
            _csrfToken: string | null
        }>(`${proxyPath}/autoreport_module/autoreports/loadAutoreports.json`, {
            params: {
                angular: true,
                availabilityLog: true
            }
        }).pipe(
            map(data => {
                const autoreports: SelectKeyValue[] = [];

                data.autoreports.forEach((autoreport) => {
                    autoreports.push({
                        key: autoreport.value.id,
                        value: autoreport.value.name
                    });
                });

                return autoreports;
            })
        )
    }

}
