import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    SlaEditGet,
    SlaPost,
    SlasGenerateDownloadParams,
    SlasGeneratePost,
    SlasGenerateRoot,
    SlasHostsParams,
    SlasHostsRoot,
    SlasIndexParams,
    SlasIndexRoot,
    SlasViewDetailsParams,
    SlasViewDetailsRoot
} from './slas.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class SlasService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: SlasIndexParams): Observable<SlasIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasIndexRoot>(`${proxyPath}/sla_module/slas/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/sla_module/slas/delete/${item.id}.json?angular=true`, {});
    }


    public add(sla: SlaPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/add.json?angular=true`, sla)
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

    public getEdit(id: number): Observable<SlaEditGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlaEditGet>(`${proxyPath}/sla_module/slas/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateSla(sla: SlaPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/edit/${sla.id}.json?angular=true`, sla)
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

    public getSlaHosts(id: number, params: SlasHostsParams): Observable<SlasHostsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasHostsRoot>(`${proxyPath}/sla_module/slas/hosts/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public generateReportPost(sla: SlasGeneratePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/generate.json`, sla)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public generateReportPdf(params: SlasGenerateDownloadParams): Observable<Blob> {
        const proxyPath = this.proxyPath;
        return this.http.get<Blob>(`${proxyPath}/sla_module/slas/generate.pdf`, params as {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public generateReportZip(params: SlasGenerateDownloadParams): Observable<Blob> {
        const proxyPath = this.proxyPath;
        return this.http.get<Blob>(`${proxyPath}/sla_module/slas/generate.zip`, params as {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadGenerateReport(): Observable<SlasGenerateRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<SlasGenerateRoot>(`${proxyPath}/sla_module/slas/generate.json`, {
            params: {
                'angular': true
            }
        }).pipe(
            map((data: SlasGenerateRoot) => {
                return data;
            })
        )
    }

    public getViewDetails(id: number, params: SlasViewDetailsParams): Observable<SlasViewDetailsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasViewDetailsRoot>(`${proxyPath}/sla_module/slas/viewDetails/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadSlas(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            slas: SelectKeyValue[]
        }>(`${proxyPath}/sla_module/slas/loadSlas.json`, {
            params: {
                'angular': true
            }
        }).pipe(
            map(data => {
                return data.slas;
            })
        );
    }

}
