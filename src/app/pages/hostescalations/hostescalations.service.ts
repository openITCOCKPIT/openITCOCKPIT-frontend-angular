import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    HostescalationContainerResult,
    HostescalationEditApiResult,
    HostescalationElements,
    HostescalationExcludedHostgroups,
    HostescalationExcludedHosts,
    HostescalationHosts,
    HostescalationIndexRoot,
    HostescalationPost,
    HostescalationsIndexParams
} from './hostescalations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class HostescalationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostescalationsIndexParams): Observable<HostescalationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationIndexRoot>(`${proxyPath}/hostescalations/index.json`, {
            params: params as {} // cast HostescalationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hostescalations/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<HostescalationContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationContainerResult>(`${proxyPath}/hostescalations/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<HostescalationElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationElements>(`${proxyPath}/hostescalations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadHosts(containerId: number, searchString: string, hostsIds: number []): Observable<HostescalationHosts> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationHosts>(`${proxyPath}/hostescalations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true,
                'filter[Hosts.name]': searchString,
                'selected[]': hostsIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadExcludedHosts(containerId: number, searchString: string, excludedHostsIds: number [], hostgroupIds: number []): Observable<HostescalationExcludedHosts> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationExcludedHosts>(`${proxyPath}/hostescalations/loadExcludedHostsByContainerIdAndHostgroupIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Hosts.name]': searchString,
                'selected[]': excludedHostsIds,
                'hostgroupIds[]': hostgroupIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadExcludedHostgroups(containerId: number, searchString: string, hostsIds: number [], excludedHostgroupIds: number []): Observable<HostescalationExcludedHostgroups> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationExcludedHostgroups>(`${proxyPath}/hostescalations/loadExcludedHostgroupsByContainerIdAndHostIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Containers.name]': searchString,
                'selected[]': excludedHostgroupIds,
                'hostIds[]': hostsIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public add(hostescalation: HostescalationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostescalations/add.json?angular=true`, {
            Hostescalation: hostescalation
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

    /**********************
     *    Edit action    *
     **********************/
    public edit(hostescalation: HostescalationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostescalations/edit/${hostescalation.id}.json?angular=true`, {
            Hostescalation: hostescalation
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

    public getEdit(id: number): Observable<HostescalationEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationEditApiResult>(`${proxyPath}/hostescalations/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
