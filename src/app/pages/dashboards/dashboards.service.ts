import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    CalendarResponse,
    DashboardsIndexResponse,
    ParentOutagesResponse,
    SharedTab,
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
import { WidgetTypes } from './widgets/widgets.enum';

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

    public checkForUpdates(tabId: number): Observable<{ updateAvailable: boolean, _csrfToken: string }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            updateAvailable: boolean,
            _csrfToken: string
        }>(`${proxyPath}/dashboards/checkForUpdates/${tabId}.json`, {
            params: {
                angular: true,
                tabId: tabId.toString()
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public neverPerformUpdates(tabId: number) {

        const post: { DashboardTab: { id: number } } = {
            DashboardTab: {
                id: tabId,
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/neverPerformUpdates.json?angular=true`, post)
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

    public updateSharedTab(tabId: number) {

        const post: { DashboardTab: { id: number } } = {
            DashboardTab: {
                id: tabId,
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/updateSharedTab.json?angular=true`, post)
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

    public lockOrUnlockTab(tabId: number, locked: boolean) {

        const post: { DashboardTab: { id: number, locked: 'true' | 'false' } } = {
            DashboardTab: {
                id: tabId,
                locked: (locked ? 'true' : 'false'),
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/lockOrUnlockTab.json?angular=true`, post)
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

    public saveTabRotateInterval(interval: number) {

        const post: { User: { dashboard_tab_rotation: number } } = {
            User: {
                dashboard_tab_rotation: interval
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/saveTabRotateInterval.json?angular=true`, post)
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

    public getSharedTabs(): Observable<SharedTab[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            tabs: SharedTab[],
            _csrfToken: string
        }>(`${proxyPath}/dashboards/getSharedTabs.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.tabs;
            })
        )
    }

    public addNewTab(name: string) {

        const post: { DashboardTab: { name: string } } = {
            DashboardTab: {
                name: name
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/addNewTab.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.DashboardTab.DashboardTab as GenericResponse
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


    public createFromSharedTab(sharedTabId: number) {

        const post: { DashboardTab: { id: number } } = {
            DashboardTab: {
                id: sharedTabId
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/createFromSharedTab.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.DashboardTab.DashboardTab as GenericResponse
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

    public restoreDefault(tabId: number) {

        const post: { DashboardTab: { id: number } } = {
            DashboardTab: {
                id: tabId
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/restoreDefault.json?angular=true`, post)
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

    public addWidgetToTab(tabId: number, widgetTypeId: WidgetTypes) {

        const post: { Widget: { dashboard_tab_id: number, typeId: WidgetTypes } } = {
            Widget: {
                dashboard_tab_id: tabId,
                typeId: widgetTypeId
            }
        };

        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/dashboards/addWidgetToTab/.json?angular=true`, post)
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

    public getParentOutagesWidget(hostname: string): Observable<ParentOutagesResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ParentOutagesResponse>(`${proxyPath}/dashboards/parentOutagesWidget.json`, {
            params: {
                angular: true,
                'filter[Hosts.name]': hostname
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getCalendarWidget(widget: WidgetGetForRender): Observable<CalendarResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<CalendarResponse>(`${proxyPath}/dashboards/calendarWidget.json`, {
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
