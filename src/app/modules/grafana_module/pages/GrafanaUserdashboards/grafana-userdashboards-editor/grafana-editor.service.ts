import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    CreatePanelPost,
    DashboardRowMetric,
    GrafanaEditorDashboardRow,
    GrafanaEditorGetResponse,
    GrfanaEditorCurrentMetricPost
} from './grafana-editor.interface';
import {
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../../../../generic-responses';
import {
    GrafanaChartTypesEnum,
    GrafanaStackingModesEnum
} from './grafana-panel/chart-type-icon/GrafanaChartTypes.enum';
import { ServiceBrowserPerfdata } from '../../../../../pages/services/services.interface';

@Injectable({
    providedIn: 'root'
})
export class GrafanaEditorService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getGrafanaUserdashboardForEditor(id: number): Observable<GrafanaEditorGetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<GrafanaEditorGetResponse>(`${proxyPath}/grafana_module/grafana_userdashboards/editor/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public addRow(dashboardId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/addRow.json?angular=true`, {
            id: dashboardId
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

    /**
     * Rows do not exist in the Database, becasue a "row" is saved per panel.
     */
    public removePanels(userdashboardId: number, rowIndex: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/removeRow.json?angular=true`, {
            userdashboard_id: userdashboardId,
            rowIndex: rowIndex,
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

    public createPanel(data: CreatePanelPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/addPanel.json?angular=true`, data)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    const response = data as { panel: GrafanaEditorDashboardRow, _csrfToken: string | null };

                    return {
                        success: true,
                        data: response.panel
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

    public removePanel(panelId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/removePanel.json?angular=true`, {
            id: panelId
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

    public removeMetric(metricId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/removeMetricFromPanel.json?angular=true`, {
            id: metricId
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

    public savePanelUnit(id: number, unit: string, title: string, visualization_type: GrafanaChartTypesEnum, stacking_mode: GrafanaStackingModesEnum | ''): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/savePanelUnit.json?angular=true`, {
            id,
            unit,
            title,
            visualization_type,
            stacking_mode
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

    public getPerformanceDataMetricsByServiceId(serviceId: number): Observable<{
        [key: string]: ServiceBrowserPerfdata
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            perfdata: { [key: string]: ServiceBrowserPerfdata }
            _csrfToken: string | null
        }>(`${proxyPath}/grafana_module/grafana_userdashboards/getPerformanceDataMetrics/${serviceId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.perfdata;
            })
        )
    }

    public addMetricToPanel(metric: GrfanaEditorCurrentMetricPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/addMetricToPanel.json?angular=true`, {
            GrafanaUserdashboardMetric: metric
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.metric as DashboardRowMetric
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

    public editMetricFromPanel(metric: GrfanaEditorCurrentMetricPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_userdashboards/editMetricFromPanel/${metric.metric_id}.json?angular=true`, {
            GrafanaUserdashboardMetric: metric
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: data.success,
                        data: data.metric as DashboardRowMetric
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
