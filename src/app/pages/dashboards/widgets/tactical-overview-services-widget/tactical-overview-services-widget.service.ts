import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { WidgetGetForRender } from '../../dashboards.interface';
import { TacticalOverviewServicesConfig, TacticalOverviewServicesResponse } from './tactical-overview-services-widget.interface';
import { GenericResponseWrapper } from '../../../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class TacticalOverviewServicesWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public getTacticalOverviewWidget(widget: WidgetGetForRender, widgetType: string): Observable<TacticalOverviewServicesResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<TacticalOverviewServicesResponse>(`${proxyPath}/dashboards/tacticalOverviewWidget.json`, {
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

    public saveWidget(widget: WidgetGetForRender, config: TacticalOverviewServicesConfig): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/tacticalOverviewWidget.json?angular=true&widgetId=${widget.id}`, config
        ).pipe(
            map(data => {
                return data;
            })
        )
    }

}
