import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    GrafanaUserdashboardCopyGet,
    GrafanaUserdashboardCopyPost,
    GrafanaUserDashboardsIndexParams,
    GrafanaUserdashboardsIndexRoot,
    GrafanaUserdashboardViewIframeUrlResponse,
    GrafanaUserdashboardViewResponse
} from './grafana-userdashboards.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SynchronizeGrafanaResponse } from '../../components/synchronize-grafana-modal/synchronize.interface';

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

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/grafana_module/grafana_userdashboards/delete/${item.id}.json`, {});
    }

    public synchronizeWithGrafana(id: number): Observable<SynchronizeGrafanaResponse> {
        const proxyPath = this.proxyPath;

        return this.http.post<SynchronizeGrafanaResponse>(`${proxyPath}/grafana_module/grafana_userdashboards/synchronizeWithGrafana.json?angular=true`, {
            id: id
        });
    }

    /*********************
     *    view action    *
     *********************/

    public getView(id: number): Observable<GrafanaUserdashboardViewResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<GrafanaUserdashboardViewResponse>(`${proxyPath}/grafana_module/grafana_userdashboards/view/${id}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getViewIframeUrl(id: number, from: string, refresh: string): Observable<GrafanaUserdashboardViewIframeUrlResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<GrafanaUserdashboardViewIframeUrlResponse>(`${proxyPath}/grafana_module/grafana_userdashboards/getViewIframeUrl/${id}.json`, {
            params: {
                angular: true,
                from: from,
                refresh: refresh
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /*********************
     *    copy action    *
     *********************/
    public getUserDashboardsCopy(ids: number[]): Observable<GrafanaUserdashboardCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{
                dashboards: GrafanaUserdashboardCopyGet[]
            }>(`${proxyPath}/grafana_module/grafana_userdashboards/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.dashboards;
                })
            )
    }

    public saveUserDashboardsCopy(dashboards: GrafanaUserdashboardCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/copy/.json?angular=true`, {
            data: dashboards
        });
    }
}
