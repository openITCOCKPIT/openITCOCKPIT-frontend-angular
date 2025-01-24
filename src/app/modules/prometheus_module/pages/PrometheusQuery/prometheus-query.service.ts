import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    LoadServicetemplates,
    LoadCurrentValueByMetricRoot,
    PrometheusPerformanceDataParams,
    PrometheusPerformanceDataRoot,
    PrometheusQueryApiResult,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot, LoadValueByMetricRoot
} from './prometheus-query.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusQueryService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    /*********************************
     *   PrometheusModule: Query     *
     *********************************/

    public loadHostsByString(filter: string): Observable<SelectKeyValue[]> {
        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadHostsByString.json`, {
            params: {
                "filter['Hosts.name']": filter,
                angular: true,
            }
        }).pipe(
            map(data => {
                return data.hosts;
            })
        );
    }

    // https://master/prometheus_module/PrometheusQuery/index.json?angular=true&filter%5BPrometheusQuery.name%5D=&hostId=87
    public getIndex(params: PrometheusQueryIndexParams): Observable<PrometheusQueryIndexRoot> {
        return this.http.get<PrometheusQueryIndexRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getPerfdata(params: PrometheusPerformanceDataParams): Observable<PrometheusPerformanceDataRoot> {
        return this.http.get<PrometheusPerformanceDataRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/getPerfdataByUuid.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadServiceTemplates(hostId: number): Observable<LoadServicetemplates> {
        return this.http.get<LoadServicetemplates>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadServicetemplates/${hostId}.json?angular=true`, {}).pipe(
            map((data: LoadServicetemplates) => {
                return data;
            })
        )
    }

    public loadCurrentValueByMetric(hostUuid: string, metric: string): Observable<LoadCurrentValueByMetricRoot> {
        return this.http.get<LoadCurrentValueByMetricRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadCurrentValueByMetric.json?angular=true`, {
            params: {
                metric: metric,
                hostUuid: hostUuid
            }
        }).pipe(
            map((data: LoadCurrentValueByMetricRoot) => {
                return data;
            })
        )
    }

    public loadValueByMetric(hostUuid: string, metric: string): Observable<LoadValueByMetricRoot> {
        return this.http.get<LoadValueByMetricRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadValueByMetric.json?angular=true`, {
            params: {
                metric: metric,
                hostUuid: hostUuid
            }
        }).pipe(
            map((data: LoadValueByMetricRoot) => {
                return data;
            })
        )
    }
    /*********************************
     *    Services Browser action    *
     *********************************/

    public loadPrometheusStateOverviewForServicesBrowser(serviceId: number): Observable<PrometheusQueryApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<PrometheusQueryApiResult>(`${proxyPath}/prometheus_module/PrometheusQuery/browser_directive/${serviceId}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
