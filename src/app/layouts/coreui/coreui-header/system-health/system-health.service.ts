import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DOCUMENT } from '@angular/common';
import { map, Observable } from 'rxjs';
import { MenuStatsRoot } from '../header-stats/header-stats.service';

@Injectable({
  providedIn: 'root'
})
export class SystemHealthService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

  constructor() { }

    public getSystemHealth(): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/angular/system_health.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true,
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
