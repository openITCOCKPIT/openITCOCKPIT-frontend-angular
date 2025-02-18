import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { HostDowntimeWidgetParams, HostsDowntimeWidgetConfig } from './hosts-downtime-widget.interface';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { DowntimeHostIndexRoot } from '../../../downtimes/downtimes.interface';

@Injectable({
    providedIn: 'root'
})
export class HostsDowntimeWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<HostsDowntimeWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: HostsDowntimeWidgetConfig = {
            DowntimeHost: {
                comment_data: '',
                was_cancelled: false,
                was_not_cancelled: false
            },
            Host: {
                name: ''
            },
            isRunning: true,
            hideExpired: true,
            sort: 'DowntimeHosts.scheduled_start_time',
            direction: 'desc',
            useScroll: true,
            scroll_interval: 30000
        };

        return this.http.get<{
            config: HostsDowntimeWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/hostsDowntimeWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: HostsDowntimeWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/hostsDowntimeWidget.json?angular=true&widgetId=${widgetId}`, config)
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


    public loadDowntimes(filter: HostDowntimeWidgetParams): Observable<DowntimeHostIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<DowntimeHostIndexRoot>(`${proxyPath}/downtimes/host.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
