import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    PrometheusExporterAddRoot,
    PrometheusExporterEditPost,
    PrometheusExporterEditRoot,
    PrometheusExportersIndex,
    PrometheusExportersIndexParams
} from './prometheus-exporters.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusExportersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: PrometheusExportersIndexParams): Observable<PrometheusExportersIndex> {
        return this.http.get<PrometheusExportersIndex>(`${this.proxyPath}/prometheus_module/PrometheusExporters/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getEdit(id: number): Observable<PrometheusExporterEditRoot> {
        return this.http.get<PrometheusExporterEditRoot>(`${this.proxyPath}/prometheus_module/PrometheusExporters/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/prometheus_module/PrometheusExporters/delete/${item.id}.json?angular=true`, {});
    }

    public add(prometheusExporter: PrometheusExporterAddRoot): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/prometheus_module/PrometheusExporters/add.json?angular=true`, prometheusExporter)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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

    public update(prometheusExporter: PrometheusExporterEditPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/prometheus_module/PrometheusExporters/edit/${prometheusExporter.PrometheusExporter.id}.json?angular=true`, prometheusExporter)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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

    public loadContainers(): Observable<SelectKeyValue[]> {
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${this.proxyPath}/prometheus_module/PrometheusExporters/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        );
    }


}
