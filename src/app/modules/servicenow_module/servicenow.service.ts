import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { PermissionsService } from '../../permissions/permissions.service';
import {
    ServicenowHostBrowserResult,
    ServicenowHostspecificSettings,
    ServicenowServiceBrowserResult,
    ServicenowServicespecificSettings
} from './servicenow.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ServicenowService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private PermissionsService = inject(PermissionsService);

    constructor() {
    }

    public getHostspecificSettings(hostUuid: string): Observable<ServicenowHostBrowserResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicenowHostBrowserResult>(`${proxyPath}/servicenow_module/servicenow_settings/hostspecific/${hostUuid}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public saveHostspecificSettings(data: ServicenowHostspecificSettings): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicenow_module/servicenow_settings/hostspecific.json?angular=true`, {
            ServicenowHostspecificSettings: data
        })
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

    public getServicespecificSettings(serviceUuid: string): Observable<ServicenowServiceBrowserResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicenowServiceBrowserResult>(`${proxyPath}/servicenow_module/servicenow_settings/servicespecific/${serviceUuid}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public saveServicespecificSettings(data: ServicenowServicespecificSettings): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicenow_module/servicenow_settings/servicespecific.json?angular=true`, {
            ServicenowServicespecificSettings: data
        })
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
