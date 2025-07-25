import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadCurrentValueByMetricRoot,
    LoadServicetemplates,
    PrometheusCreateService,
    PrometheusEditService,
    PrometheusEditServiceRoot,
    PrometheusPerformanceDataParams,
    PrometheusPerformanceDataRoot,
    PrometheusQueryApiResult,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot,
    ValidateService
} from './prometheus-query.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { ProfileUser } from '../../../../pages/profile/profile.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusQueryService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    /*********************************
     *   PrometheusModule: Query     *
     *********************************/

    public loadHostsByString(filter: string): Observable<SelectKeyValue[]> {
        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadHostsByString.json`, {
            params: {
                "filter['Hosts.name']": filter,
                angular: true,
            }
        }).pipe(
            map(data => {
                return data.hosts;
            })
        );
    }

    // https://master/prometheus_module/PrometheusQuery/index.json?angular=true&filter%5BPrometheusQuery.name%5D=&hostId=87
    public getIndex(params: PrometheusQueryIndexParams): Observable<PrometheusQueryIndexRoot> {
        return this.http.get<PrometheusQueryIndexRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getPerfdata(params: PrometheusPerformanceDataParams): Observable<PrometheusPerformanceDataRoot> {
        return this.http.get<PrometheusPerformanceDataRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/getPerfdataByUuid.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadServiceTemplates(hostId: number): Observable<LoadServicetemplates> {
        return this.http.get<LoadServicetemplates>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadServicetemplates/${hostId}.json?angular=true`, {}).pipe(
            map((data: LoadServicetemplates) => {
                return data;
            })
        )
    }

    public loadCurrentValueByMetric(hostUuid: string, metric: string): Observable<LoadCurrentValueByMetricRoot> {
        return this.http.get<LoadCurrentValueByMetricRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadCurrentValueByMetric.json?angular=true`, {
            params: {
                metric: metric,
                hostUuid: hostUuid
            }
        }).pipe(
            map((data: LoadCurrentValueByMetricRoot) => {
                return data;
            })
        )
    }

    public validateService(ValidateService: ValidateService): Observable<GenericResponseWrapper> {
        return this.http.post<{
            user: ProfileUser
        }>(`${this.proxyPath}/prometheus_module/PrometheusQuery/validateService.json?angular=true`, {
            Service: ValidateService
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {}
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

    public createServices(PrometheusCreateService: PrometheusCreateService) : Observable<GenericResponseWrapper>{
        return this.http.post<GenericResponseWrapper>(`${this.proxyPath}/prometheus_module/PrometheusQuery/createService.json?angular=true`, {
            Service: PrometheusCreateService
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {}
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

    public loadValueByMetric(hostUuid: string, metric: string): Observable<GenericResponseWrapper> {

        const proxyPath: string = this.proxyPath;
        return this.http.get<any>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadValueByMetric.json?angular=true`, {
            params: {
                metric: metric,
                hostUuid: hostUuid
            }
        })
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as {}
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

    public getEditService(serviceId: number): Observable<PrometheusEditServiceRoot> {
        return this.http.get<PrometheusEditServiceRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/editService/${serviceId}.json?angular=true`, {}).pipe(
            map((data: PrometheusEditServiceRoot) => {
                return data;
            })
        );
    }

    public updateService(PrometheusEditService: PrometheusEditService): Observable<GenericResponseWrapper> {
        return this.http.post<GenericResponseWrapper>(`${this.proxyPath}/prometheus_module/PrometheusQuery/editService/${PrometheusEditService.Service.id}.json?angular=true`, {
            Service : PrometheusEditService.Service as {},
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {}
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
    /*********************************
     *    Services Browser action    *
     *********************************/

    public loadPrometheusStateOverviewForServicesBrowser(serviceId: number): Observable<PrometheusQueryApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<PrometheusQueryApiResult>(`${proxyPath}/prometheus_module/PrometheusQuery/browser_directive/${serviceId}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
