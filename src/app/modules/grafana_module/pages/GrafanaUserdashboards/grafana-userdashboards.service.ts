import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { GrafanaUserDashboardsIndexParams, GrafanaUserdashboardsIndexRoot } from './grafana-userdashboards.interface';

@Injectable({
    providedIn: 'root'
})
export class GrafanaUserdashboardsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: GrafanaUserDashboardsIndexParams): Observable<GrafanaUserdashboardsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<GrafanaUserdashboardsIndexRoot>(`${proxyPath}/grafana_module/grafana_userdashboards/index.json`, {
            params: params as {} // cast GrafanaUserDashboardsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
