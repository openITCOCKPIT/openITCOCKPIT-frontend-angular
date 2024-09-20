import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { PrometheusQueryApiResult } from './prometheus-query.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusQueryService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
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
