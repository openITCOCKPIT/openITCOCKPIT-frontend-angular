import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    DashboardsIndexResponse,
    WidgetGetForRender,
    WidgetSaveGrid,
    WidgetsForTabResponse
} from './dashboards.interface';
import { GenericMessageResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class DashboardsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public getIndex(): Observable<DashboardsIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<DashboardsIndexResponse>(`${proxyPath}/dashboards/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getWidgetsForTab(tabId: number): Observable<WidgetsForTabResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<WidgetsForTabResponse>(`${proxyPath}/dashboards/getWidgetsForTab/${tabId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveGrid(data: WidgetGetForRender[]): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        const post: WidgetSaveGrid[] = [];

        data.forEach((widget) => {
            post.push({
                Widget: {
                    id: Number(widget.id),
                    dashboard_tab_id: widget.dashboard_tab_id,
                    col: widget.col,
                    row: widget.row,
                    title: widget.title,
                    width: widget.width,
                    height: widget.height,
                    color: widget.color,
                }
            });
        });

        return this.http.post<any>(`${proxyPath}/dashboards/saveGrid/.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericMessageResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }
}
