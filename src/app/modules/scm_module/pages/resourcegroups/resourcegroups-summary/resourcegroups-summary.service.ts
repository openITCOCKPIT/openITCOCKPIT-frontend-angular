import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ResourcegroupsSummaryResponse } from './resourcegroups-summary.interface';

@Injectable({
    providedIn: 'root'
})
export class ResourcegroupsSummaryService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getSummary(): Observable<ResourcegroupsSummaryResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResourcegroupsSummaryResponse>(`${proxyPath}/scm_module/resourcegroups/summary.json`, {
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
