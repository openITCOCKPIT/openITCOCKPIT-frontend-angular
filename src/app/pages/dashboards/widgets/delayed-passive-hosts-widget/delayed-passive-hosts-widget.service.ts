import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    DelayedPassiveHostsWidgetConfig,
    DelayedPassiveHostsWidgetParams
} from './delayed-passive-hosts-widget.interface';
import { HostsIndexRoot } from '../../../hosts/hosts.interface';

@Injectable({
    providedIn: 'root'
})
export class DelayedPassiveHostsWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<DelayedPassiveHostsWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: DelayedPassiveHostsWidgetConfig = {
            Hoststatus: {
                current_state: {
                    up: false,
                    down: false,
                    unreachable: false,
                },
                acknowledged: false,
                not_acknowledged: false,
                in_downtime: false,
                not_in_downtime: false,
                output: '',
                state_older_than: null,
                state_older_than_unit: 'MINUTE',
                delayed_greater_than: null,
                delayed_greater_than_unit: 'MINUTE',
            },
            Host: {
                name: '',
                name_regex: false,
                keywords: '',
                not_keywords: '',
            },
            sort: 'Hoststatus.current_state',
            direction: 'desc',
            useScroll: true,
            scroll_interval: 30000
        };

        return this.http.get<{
            config: DelayedPassiveHostsWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/delayedPassiveHostsWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: DelayedPassiveHostsWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/delayedPassiveHostsWidget.json?angular=true&widgetId=${widgetId}`, config)
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


    public loadHosts(filter: DelayedPassiveHostsWidgetParams): Observable<HostsIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<HostsIndexRoot>(`${proxyPath}/hosts/passiveList.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
