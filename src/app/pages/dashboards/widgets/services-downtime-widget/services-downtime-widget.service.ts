import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { DowntimeServiceIndexRoot } from '../../../downtimes/downtimes.interface';
import { ServiceDowntimeWidgetParams, ServicesDowntimeWidgetConfig } from './services-downtime-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class ServicesDowntimeWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<ServicesDowntimeWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: ServicesDowntimeWidgetConfig = {
            DowntimeService: {
                comment_data: '',
                was_cancelled: false,
                was_not_cancelled: false
            },
            Host: {
                name: ''
            },
            Service: {
                name: ''
            },
            isRunning: true,
            hideExpired: true,
            sort: 'DowntimeServices.scheduled_start_time',
            direction: 'desc',
            useScroll: true,
            scroll_interval: 30000
        };

        return this.http.get<{
            config: ServicesDowntimeWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/servicesDowntimeWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: ServicesDowntimeWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/servicesDowntimeWidget.json?angular=true&widgetId=${widgetId}`, config)
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


    public loadDowntimes(filter: ServiceDowntimeWidgetParams): Observable<DowntimeServiceIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<DowntimeServiceIndexRoot>(`${proxyPath}/downtimes/service.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
