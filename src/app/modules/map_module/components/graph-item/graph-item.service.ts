import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { GraphItemParams, GraphItemRoot, UserTimezoneParams, UserTimezoneRoot } from './graph-item.interface';

@Injectable({
    providedIn: 'root'
})
export class GraphItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getGraphItem(params: GraphItemParams): Observable<GraphItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<GraphItemRoot>(`${proxyPath}/map_module/mapeditors/graph/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getUserTimezone(params: UserTimezoneParams): Observable<UserTimezoneRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<UserTimezoneRoot>(`${proxyPath}/angular/user_timezone.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
