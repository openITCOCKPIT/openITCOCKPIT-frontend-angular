import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    ServicesStatusListWidgetConfig,
    ServicesStatusListWidgetParams
} from './services-status-list-widget.interface';
import { ServicesIndexRoot } from '../../../services/services.interface';

@Injectable({
    providedIn: 'root'
})
export class ServicesStatusListWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<ServicesStatusListWidgetConfig> {
        const proxyPath = this.proxyPath;

        let defaultConfig: ServicesStatusListWidgetConfig = {
            Servicestatus: {
                current_state: {
                    ok: false,
                    warning: false,
                    critical: false,
                    unknown: false,
                },
                acknowledged: false,
                not_acknowledged: false,
                in_downtime: false,
                not_in_downtime: false,
                output: '',
                state_older_than: null,
                state_older_than_unit: 'MINUTE',
            },

            Host: {
                name: '',
                name_regex: false,
                keywords: '',
                not_keywords: '',
            },
            Service: {
                name: '',
                name_regex: false,
                keywords: '',
                not_keywords: '',
            },
            sort: 'Servicestatus.current_state',
            direction: 'desc',
            useScroll: true,
            scroll_interval: 30000
        };

        return this.http.get<{
            config: ServicesStatusListWidgetConfig,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/servicesStatusListWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, config: ServicesStatusListWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/servicesStatusListWidget.json?angular=true&widgetId=${widgetId}`, config)
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


    public loadServices(filter: ServicesStatusListWidgetParams): Observable<ServicesIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<ServicesIndexRoot>(`${proxyPath}/services/index.json`, {
            params: filter as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
