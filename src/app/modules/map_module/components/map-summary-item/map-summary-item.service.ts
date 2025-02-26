import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MapItemRoot, MapItemRootParams } from '../map-item-base/map-item-base.interface';

@Injectable({
    providedIn: 'root'
})
export class MapSummaryItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMapSummaryItem(params: MapItemRootParams): Observable<MapItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapItemRoot>(`${proxyPath}/map_module/mapeditors/mapsummaryitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
