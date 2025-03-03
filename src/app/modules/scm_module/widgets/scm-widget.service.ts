import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { WidgetGetForRender } from '../../../pages/dashboards/dashboards.interface';
import { map, Observable } from 'rxjs';
import { ResourcesWidgetResponse } from './scm-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class ScmWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getMyResourcesSummaryWidget(widget: WidgetGetForRender): Observable<ResourcesWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResourcesWidgetResponse>(`${proxyPath}/scm_module/resources/myResourcesSummaryWidget.json`, {
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
