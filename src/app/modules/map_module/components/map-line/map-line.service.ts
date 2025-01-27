import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MapLineRoot, MapLineRootParams } from './map-line.interface';

@Injectable({
    providedIn: 'root'
})
export class MapLineService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMapLine(params: MapLineRootParams): Observable<MapLineRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapLineRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
