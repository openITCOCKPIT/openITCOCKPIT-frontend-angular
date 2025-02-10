import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DashboardsIndexResponse } from './dashboards.interface';

@Injectable({
    providedIn: 'root'
})
export class DashboardsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public getIndex(): Observable<DashboardsIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<DashboardsIndexResponse>(`${proxyPath}/dashboards/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
