import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    EventcorrelationWidgetConfig,
    EventcorrelationWidgetConfigRootResponse
} from './eventcorrelation-widget.interface';
import {
    EventcorrelationsIndexParams,
    EventcorrelationsIndexRoot
} from '../../pages/eventcorrelations/eventcorrelations.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class EventcorrelationWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<EventcorrelationWidgetConfigRootResponse> {
        const proxyPath = this.proxyPath;


        return this.http.get<EventcorrelationWidgetConfigRootResponse>(`${proxyPath}/eventcorrelation_module/eventcorrelations/evcWidget.json`, {
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

    public saveWidgetConfig(widgetId: string, host_id: number, config: EventcorrelationWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelations/evcWidget.json?angular=true`, {
            ...config,
            Widget: {
                id: widgetId
            },
            host_id: host_id
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

    public loadEventCorrelations(hostname: string = ''): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        const params: EventcorrelationsIndexParams = {
            angular: true,
            sort: 'Hosts.name',
            direction: 'asc',
            page: 1,
            scroll: true,
            'filter[Hosts.name]': hostname,
            'filter[Hosts.description]': ''
        };

        return this.http.get<EventcorrelationsIndexRoot>(`${proxyPath}/eventcorrelation_module/eventcorrelations/index.json`, {
            params: params as {} // cast EventcorrelationsIndexParams into object
        }).pipe(
            map(data => {
                const eventCorrelations: SelectKeyValue[] = [];

                data.all_evc_hosts.forEach((evcHost) => {
                    eventCorrelations.push({
                        key: evcHost.Host.id,
                        value: evcHost.Host.name
                    });
                });

                return eventCorrelations;
            })
        )
    }
}
