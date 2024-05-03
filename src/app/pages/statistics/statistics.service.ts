import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { StatisticsIndex } from './statistics.interface';
import { Statistics } from './statistics.enum';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getCurrentStatisticSettings(): Observable<StatisticsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatisticsIndex>(`${proxyPath}/statistics/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveSettings(value: Statistics): Observable<boolean> {
        const proxyPath = this.proxyPath;
        return this.http.post<boolean>(`${proxyPath}/statistics/saveStatisticDecision.json`, {
            statistics: {
                decision: value
            }
        }).pipe(
            map(data => {
                return true;
            })
        )
    }

}
