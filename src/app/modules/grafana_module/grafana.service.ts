import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    GrafanaConfigurationGetResponse,
    GrafanaConfigurationPost,
    GrafanaConnectionSaveResult,
    GrafanaConnectionTestResult
} from './grafana.interface';
import { SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class GrafanaService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    constructor() {
    }

    /************************************
     *    Configuration index action    *
     ***********************************/

    public loadGrafanaConfiguration(): Observable<GrafanaConfigurationGetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<GrafanaConfigurationGetResponse>(`${proxyPath}/grafana_module/grafana_configuration/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadHostgroups(): Observable<SelectKeyValueWithDisabled[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hostgroups: SelectKeyValueWithDisabled[]
        }>(`${proxyPath}/grafana_module/grafana_configuration/loadHostgroups.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.hostgroups;
            })
        )
    }

    public testGrafanaConnection(data: GrafanaConfigurationPost): Observable<GrafanaConnectionTestResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<GrafanaConnectionTestResult>(`${proxyPath}/grafana_module/grafana_configuration/testGrafanaConnection.json?angular=true`, data);
    }

    public saveGrafanaSettings(configuration: GrafanaConfigurationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/grafana_module/grafana_configuration/index.json?angular=true`, configuration)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GrafanaConnectionSaveResult
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
