import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericValidationError } from '../../generic-responses';
import {
    CurrentStateReportHtmlResponse,
    CurrentStateReportResponseWrapper,
    CurrentStateReportsHtmlParams
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
}
