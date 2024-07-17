import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    SystemdowntimesGet,
    SystemdowntimesPost,
    HostSystemdowntimesParams,
    SystemdowntimeHostIndexRoot,
    ServiceSystemdowntimesParams,
    SystemdowntimeServiceIndexRoot,
    SystemdowntimeHostgroupIndexRoot, ContainerSystemdowntimesParams, SystemdowntimeNodeIndexRoot,
} from './systemdowntimes.interface';

import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemdowntimesService implements DeleteAllModalService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadDefaults(): Observable<SystemdowntimesGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemdowntimesGet>(`${proxyPath}/angular/getDowntimeData.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public createHostdowntime(hostdowntime: SystemdowntimesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemdowntimes/addHostdowntime.json?angular=true`, {
            Systemdowntime: hostdowntime
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

    public createServicedowntime(servicedowntime: SystemdowntimesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemdowntimes/addServicedowntime.json?angular=true`, {
            Systemdowntime: servicedowntime
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

    public createHostgroupdowntime(hostgroupdowntime: SystemdowntimesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemdowntimes/addHostgroupdowntime.json?angular=true`, {
            Systemdowntime: hostgroupdowntime
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

    public createContainerdowntime(containerdowntime: SystemdowntimesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemdowntimes/addContainerdowntime.json?angular=true`, {
            Systemdowntime: containerdowntime
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

    public getHostSystemdowntimes(params: HostSystemdowntimesParams): Observable<SystemdowntimeHostIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<SystemdowntimeHostIndexRoot>(`${proxyPath}/systemdowntimes/host.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getServiceSystemdowntimes(params: ServiceSystemdowntimesParams): Observable<SystemdowntimeServiceIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<SystemdowntimeServiceIndexRoot>(`${proxyPath}/systemdowntimes/service.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getHostgroupSystemdowntimes(params: ContainerSystemdowntimesParams): Observable<SystemdowntimeHostgroupIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<SystemdowntimeHostgroupIndexRoot>(`${proxyPath}/systemdowntimes/hostgroup.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getNodeSystemdowntimes(params: ContainerSystemdowntimesParams): Observable<SystemdowntimeNodeIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<SystemdowntimeNodeIndexRoot>(`${proxyPath}/systemdowntimes/node.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/systemdowntimes/delete/${item.id}.json?angular=true`, {});
    }
}
