import { inject, Injectable } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { HostStatusOverviewWidgetResponse } from './host-status-overview-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class HostStatusOverviewWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getHostStatusOverviewWidget(widget: WidgetGetForRender): Observable<HostStatusOverviewWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostStatusOverviewWidgetResponse>(`${proxyPath}/dashboards/tacticalOverviewWidget.json`, {
            params: {
                angular: true,
                'widgetId': widget.id
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
