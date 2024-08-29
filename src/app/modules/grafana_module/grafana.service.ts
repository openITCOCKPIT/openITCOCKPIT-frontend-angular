import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
    providedIn: 'root'
})
export class GrafanaService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private TranslocoService = inject(TranslocoService);

    constructor() {
    }

    public getGrafanaTimepicker(): Observable<any> {
        // This is now hardcoded in the Angular frontend - see grafana-timepicker.component.ts
        console.log('THIS IS DEPRECATED - DO NOT USE');

        const proxyPath = this.proxyPath;
        return this.http.get<{
            timeranges: any
        }>(`${proxyPath}/grafana_module/grafana_userdashboards/grafanaTimepicker.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.timeranges
            })
        )
    }
}
