import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ScansCreateCheckmkServicesPost,
    ScansHealthRecoveryResult,
    ScansPost,
    ScansProcessListResult,
    ScansRootResponse,
    ScansSatelliteHealthRecoveryResult,
    ScansSatelliteProcessListResult
} from './scans.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ScansService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getScansConfiguration(hostId: number): Observable<ScansRootResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ScansRootResponse>(`${proxyPath}/checkmk_module/scans/index/${hostId}.json`, {
            params: {
                angular: 'true'
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public runAjaxHealthList(hostId: number, data: ScansPost): Observable<ScansHealthRecoveryResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<ScansHealthRecoveryResult>(`${proxyPath}/checkmk_module/scans/ajaxHealthList/${hostId}.json?angular=true`, {
            data: data,
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public runAjaxProcessList(hostId: number): Observable<ScansProcessListResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<ScansProcessListResult>(`${proxyPath}/checkmk_module/scans/ajaxProcessList/${hostId}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getSatelliteHealthDiscoveryStatus(taskId: number): Observable<ScansSatelliteHealthRecoveryResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<ScansSatelliteHealthRecoveryResult>(`${proxyPath}/checkmk_module/scans/checkSatHealthListTaskState/${taskId}.json`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getSatelliteProcessDiscoveryStatus(taskId: number): Observable<ScansSatelliteProcessListResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<ScansSatelliteProcessListResult>(`${proxyPath}/checkmk_module/scans/checkSatProcessListTaskState/${taskId}.json`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveCheckmkServices(hostId: number, data: ScansCreateCheckmkServicesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/checkmk_module/scans/index/${hostId}.json?angular=true`, data)
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
}
