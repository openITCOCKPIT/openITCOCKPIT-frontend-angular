import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ExportSatelliteSelectionPost,
    ExportsBroadcastResult,
    ExportsIndexResult,
    ExportValidationResult,
    LaunchExportPost
} from './exports.interface';
import { GenericResponseWrapper, GenericSuccessResponse } from '../../generic-responses';

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

    public launchExport(params: LaunchExportPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/exports/launchExport.json?angular=true`,
            params as {}
        )
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {}
                    };
                }),
                catchError((error: any) => {
                    return of({
                        success: false,
                        data: error.message
                    });
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

    public verifyConfig(): Observable<ExportValidationResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<ExportValidationResult>(`${proxyPath}/exports/verifyConfig.json?angular=true`, {
            empty: true
        })
            .pipe(
                map(data => {
                    return data
                })
            );
    }

    public saveSatelliteSelection(data: ExportSatelliteSelectionPost[]): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/exports/saveInstanceConfigSyncSelection.json?angular=true`, {
            satellites: data
        })
            .pipe(
                map(data => {
                    return data
                })
            );

    }
}
