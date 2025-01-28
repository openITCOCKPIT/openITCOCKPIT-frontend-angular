import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { TrafficlightItemRoot, TrafficlightItemRootParams } from './trafficlight-item.interface';

@Injectable({
    providedIn: 'root'
})
export class TrafficlightItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getTrafficlightItem(params: TrafficlightItemRootParams): Observable<TrafficlightItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TrafficlightItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
