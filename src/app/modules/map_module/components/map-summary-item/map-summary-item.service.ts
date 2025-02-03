import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MapSummaryItemRoot, MapSummaryItemRootParams } from './map-summary-item.interface';

@Injectable({
    providedIn: 'root'
})
export class MapSummaryItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMapSummaryItem(params: MapSummaryItemRootParams): Observable<MapSummaryItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapSummaryItemRoot>(`${proxyPath}/map_module/mapeditors/mapsummaryitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
