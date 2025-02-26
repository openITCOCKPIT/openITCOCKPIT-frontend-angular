import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { MapWidgetConfig } from './map-widget.interface';
import { MapsByStringParams } from '../../pages/mapeditors/mapeditors.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class MapWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadWidgetConfig(widgetId: string): Observable<MapWidgetConfig> {
        const proxyPath = this.proxyPath;


        return this.http.get<{
            config: MapWidgetConfig,
            _csrfToken: string | null
        }>(`${proxyPath}/map_module/mapeditors/mapWidget.json`, {
            params: {
                angular: true,
                widgetId: widgetId
            }
        }).pipe(
            map(data => {
                return data.config
            })
        )
    }

    public saveWidgetConfig(widgetId: string, config: MapWidgetConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/mapeditors/mapWidget.json?angular=true`, {
            Widget: {
                id: widgetId
            },
            map_id: config.map_id
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

    public loadMapsByString(params: MapsByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ maps: SelectKeyValue[] }>(`${proxyPath}/map_module/mapeditors/loadMapsByString.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.maps;
            })
        )
    }
}
