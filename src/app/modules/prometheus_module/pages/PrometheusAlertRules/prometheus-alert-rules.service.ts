import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { PrometheusAlertRulesIndexParams, PrometheusAlertRulesIndexRoot } from './prometheus-alert-rules.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusAlertRulesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: PrometheusAlertRulesIndexParams): Observable<PrometheusAlertRulesIndexRoot> {
        return this.http.get<PrometheusAlertRulesIndexRoot>(`${this.proxyPath}/prometheus_module/PrometheusAlertRules/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: PrometheusAlertRulesIndexRoot): PrometheusAlertRulesIndexRoot => {
                return data;
            })
        );
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/services/delete/${item.id}.json?angular=true`, {});
    }
}