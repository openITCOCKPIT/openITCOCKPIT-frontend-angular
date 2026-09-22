import { inject, Injectable } from "@angular/core";
import { WidgetGetForRender } from '../../dashboards.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { HostOperationsSummaryConfig, HostOperationsSummaryResponse } from './host-operations-summary-widget.interface';
import { GenericResponseWrapper } from '../../../../generic-responses';

@Injectable({
    providedIn: "root",
})
export class HostOperationsSummaryWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getHostOperationsSummaryWidget(widget: WidgetGetForRender, widgetType: string): Observable<HostOperationsSummaryResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostOperationsSummaryResponse>(`${proxyPath}/dashboards/operationsSummaryWidget.json`, {
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

    public saveWidget(widget: WidgetGetForRender, config: HostOperationsSummaryConfig): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/operationsSummaryWidget.json?angular=true&widgetId=${widget.id}`, config
        ).pipe(
            map(data => {
                return data;
            })
        )
    }
}