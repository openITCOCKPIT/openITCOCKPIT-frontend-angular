import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GrafanaEditorGetResponse } from './grafana-editor.interface';
import {
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../../../../generic-responses';

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

}
