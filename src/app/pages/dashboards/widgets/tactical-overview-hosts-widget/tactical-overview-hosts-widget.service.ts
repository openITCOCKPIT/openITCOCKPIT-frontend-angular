import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { WidgetGetForRender } from '../../dashboards.interface';
import { TacticalOverviewHostsConfig, TacticalOverviewHostsResponse } from './tactical-overview-hosts-widget.interface';
import { GenericResponseWrapper } from '../../../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class TacticalOverviewHostsWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public getTacticalOverviewWidget(widget: WidgetGetForRender, widgetType: string): Observable<TacticalOverviewHostsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<TacticalOverviewHostsResponse>(`${proxyPath}/dashboards/tacticalOverviewWidget.json`, {
            params: {
                angular: true,
                'widgetId': widget.id,
                'type': widgetType
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveWidget(widget: WidgetGetForRender, config: TacticalOverviewHostsConfig): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/tacticalOverviewWidget.json?angular=true&widgetId=${widget.id}`, config
        ).pipe(
            map(data => {
                return data;
            })
        )
    }

}
