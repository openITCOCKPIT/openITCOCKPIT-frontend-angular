import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericFilenameResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import {
    CurrentStateReportHtmlResponse,
    CurrentStateReportResponseWrapper,
    CurrentStateReportsHtmlParams,
    CurrentStateReportsPdfParams
} from './currentstatereports.interface';

@Injectable({
    providedIn: 'root'
})
export class CurrentstatereportsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public createReportHtml(data: CurrentStateReportsHtmlParams): Observable<CurrentStateReportResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/currentstatereports/index.json`, data)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as CurrentStateReportHtmlResponse
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

    // This API Call will only validate the form data and return a success or a validation error
    // It will not create the report
    public validateReportFormForPdf(data: CurrentStateReportsPdfParams): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/currentstatereports/createPdfReport.json`, {
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

    public generateReportPdf(params: CurrentStateReportsPdfParams): Observable<Blob> {
        const proxyPath = this.proxyPath;

        return this.http.get(`${proxyPath}/currentstatereports/createPdfReport.pdf`, {
            params: params as {},
            responseType: 'blob'
        });
    }
}
