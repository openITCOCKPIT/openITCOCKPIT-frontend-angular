import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable } from 'rxjs';
import { MapItemRoot, MapItemRootParams } from './map-item-base.interface';
import { handleError, SKIP_ERROR_REDIRECT } from '../../../../tokens/skip-error-redirect.token';

@Injectable({
    providedIn: 'root'
})
export class MapItemBaseService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMapItem(params: MapItemRootParams): Observable<MapItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {},
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true)
        }).pipe(
            //catchError(handleError),
            map(data => {
                return data;
            })
        )
    }
}
