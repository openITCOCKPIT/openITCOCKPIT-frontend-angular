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
import {
    GenericMessageResponse,
    GenericResponse,
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../generic-responses';

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

    public removeWidget(widgetId: number, dashboardTabId: number) {

        const post: { Widget: { id: number, dashboard_tab_id: number } } = {
            Widget: {
                id: widgetId,
                dashboard_tab_id: dashboardTabId
            }
        };

        const proxyPath = this.proxyPath;


        return this.http.post<any>(`${proxyPath}/dashboards/removeWidgetFromTab/.json?angular=true`, post)
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

    public renameWidget(widgetId: number, name: string) {

        const post: { Widget: { id: number, name: string } } = {
            Widget: {
                id: widgetId,
                name: name
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/renameWidget/.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public saveTabOrder(widgetIds: number[]) {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/saveTabOrder/.json?angular=true`, {
            order: widgetIds
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public deleteDashboardTab(tabId: number) {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/deleteDashboardTab.json?angular=true`, {
            DashboardTab: {
                id: tabId
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public startSharing(tabId: number) {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/startSharing.json?angular=true`, {
            DashboardTab: {
                id: tabId
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public stopSharing(tabId: number) {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/stopSharing.json?angular=true`, {
            DashboardTab: {
                id: tabId
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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

    public renameDashboardTab(tabId: number, name: string) {

        const post: { DashboardTab: { id: number, name: string } } = {
            DashboardTab: {
                id: tabId,
                name: name
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/renameDashboardTab.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok

                    return {
                        success: true,
                        data: data as GenericResponse
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
