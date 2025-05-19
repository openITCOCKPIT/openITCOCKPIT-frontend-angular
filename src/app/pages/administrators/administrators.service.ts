import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { AdministratorsDebugRootResponse } from './administrators.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class AdministratorsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getDebug(): Observable<AdministratorsDebugRootResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AdministratorsDebugRootResponse>(`${proxyPath}/Administrators/debug.json`, {
            params: {
                angular: true,
                isoTimestamp: 1
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public sendTestMail(): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            success: boolean,
            message: string
        }>(`${proxyPath}/Administrators/testMail.json?angular=true`, {})
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: data.success,
                        data: data.message,
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
     * Loads the phpinfo() from the server as HTML
     */
    public getPhpinfo(): Observable<string> {
        const proxyPath = this.proxyPath;
        return this.http.get(`${proxyPath}/Administrators/php_info.html`, {
            responseType: 'text'
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
