import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MetricsInfoResponse } from './metrics.interface';

@Injectable({
    providedIn: 'root'
})
export class MetricsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getInfo(): Observable<MetricsInfoResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<MetricsInfoResponse>(`${proxyPath}/metrics/info.json`, {
            params: {
                angular: 'true',
            }
        }).pipe(
            map((data: MetricsInfoResponse) => {
                return data;
            })
        )
    }
}