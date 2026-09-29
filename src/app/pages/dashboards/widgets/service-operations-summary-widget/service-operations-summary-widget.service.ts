import { inject, Injectable } from "@angular/core";
import { WidgetGetForRender } from '../../dashboards.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    ServiceOperationsSummaryConfig,
    ServiceOperationsSummaryResponse
} from './service-operations-summary-widget.interface';
import { GenericResponseWrapper } from '../../../../generic-responses';

@Injectable({
    providedIn: "root",
})
export class ServiceOperationsSummaryWidgetService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getServiceOperationsSummaryWidget(widget: WidgetGetForRender, widgetType: string): Observable<ServiceOperationsSummaryResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceOperationsSummaryResponse>(`${proxyPath}/dashboards/operationsSummaryWidget.json`, {
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

    public saveWidget(widget: WidgetGetForRender, config: ServiceOperationsSummaryConfig): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/dashboards/operationsSummaryWidget.json?angular=true&widgetId=${widget.id}`, config
        ).pipe(
            map(data => {
                return data;
            })
        )
    }
}