import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ExportsBroadcastResult, ExportsIndexResult, LaunchExportPost } from './exports.interface';
import { GenericSuccessResponse } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ExportsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    constructor() {
    }

    /**********************
     *    Index action    *
     **********************/
    public getIndex(): Observable<ExportsIndexResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExportsIndexResult>(`${proxyPath}/exports/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public launchExport(params: LaunchExportPost): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/exports/launchExport.json?angular=true`,
            params as {}
        )
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    public getBroadcastStatus(): Observable<ExportsBroadcastResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExportsBroadcastResult>(`${proxyPath}/exports/broadcast.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
