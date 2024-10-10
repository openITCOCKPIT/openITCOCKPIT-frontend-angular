import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    InstantreportPost,
    InstantreportsIndexParams,
    InstantreportsIndexRoot,
    InstantreportsReportPdfParams
} from './instantreports.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import {
    GenericFilenameResponse,
    GenericIdResponse,
    GenericResponseWrapper,
    GenericValidationError
} from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class InstantreportsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: InstantreportsIndexParams): Observable<InstantreportsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<InstantreportsIndexRoot>(`${proxyPath}/instantreports/index.json`, {
            params: params as {} // cast InstantreportsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/instantreports/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/instantreports/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public add(instantreport: InstantreportPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/instantreports/add.json?angular=true`, {
            Instantreport: instantreport
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.instantreport as GenericIdResponse
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

    public getInstantreportEdit(id: number): Observable<InstantreportPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            instantreport: { Instantreport: InstantreportPost }
        }>(`${proxyPath}/instantreports/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.instantreport.Instantreport;
            })
        );
    }

    public saveInstantreportEdit(instantreport: InstantreportPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/instantreports/edit/${instantreport.id}.json?angular=true`, {
            Instantreport: instantreport
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.instantreport as GenericIdResponse
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

    /**********************
     *   Generate action  *
     **********************/

    public loadInstantreports(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            instantreports: SelectKeyValue[]
        }>(`${proxyPath}/instantreports/loadInstantreports.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.instantreports
            })
        )
    }

    // This API Call will only validate the form data and return a success or a validation error
    // It will not create the report
    public validateReportFormForPdf(data: InstantreportsReportPdfParams): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/instantreports/createPdfReport.json`, {
            params: data as {}
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericFilenameResponse
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

    public generateReportPdf(params: InstantreportsReportPdfParams): Observable<Blob> {
        const proxyPath = this.proxyPath;

        return this.http.get(`${proxyPath}/instantreports/createPdfReport.pdf`, {
            params: params as {},
            responseType: 'blob'
        });
    }

}
