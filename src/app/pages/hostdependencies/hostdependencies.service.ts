import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    HostdependencyContainerResult,
    HostdependencyEditApiResult,
    HostdependencyElements,
    HostdependencyHosts,
    HostdependencyIndexRoot,
    HostdependencyPost,
    HostdependenciesIndexParams, HostdependencyDependentHosts, HostdependencyDependentHostgroups
} from './hostdependencies.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class HostdependenciesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostdependenciesIndexParams): Observable<HostdependencyIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyIndexRoot>(`${proxyPath}/hostdependencies/index.json`, {
            params: params as {} // cast HostdependenciesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hostdependencies/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<HostdependencyContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyContainerResult>(`${proxyPath}/hostdependencies/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<HostdependencyElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyElements>(`${proxyPath}/hostdependencies/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadHosts(containerId: number, searchString: string, hostsIds: number []): Observable<HostdependencyHosts> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyHosts>(`${proxyPath}/hostdependencies/loadElementsByContainerId/${containerId}.json`, {
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

    public loadDependentHosts(containerId: number, searchString: string, dependentHostsIds: number [], hostgroupIds: number []): Observable<HostdependencyDependentHosts> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyDependentHosts>(`${proxyPath}/hostdependencies/loadDependentHostsByContainerIdAndHostgroupIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Hosts.name]': searchString,
                'selected[]': dependentHostsIds,
                'hostgroupIds[]': hostgroupIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadDependentHostgroups(containerId: number, searchString: string, hostsIds: number [], dependentHostgroupIds: number []): Observable<HostdependencyDependentHostgroups> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyDependentHostgroups>(`${proxyPath}/hostdependencies/loadDependentHostgroupsByContainerIdAndHostIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Containers.name]': searchString,
                'selected[]': dependentHostgroupIds,
                'hostIds[]': hostsIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public add(hostdependency: HostdependencyPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostdependencies/add.json?angular=true`, {
            Hostdependency: hostdependency
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
    public edit(hostdependency: HostdependencyPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostdependencies/edit/${hostdependency.id}.json?angular=true`, {
            Hostdependency: hostdependency
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

    public getEdit(id: number): Observable<HostdependencyEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependencyEditApiResult>(`${proxyPath}/hostdependencies/edit/${id}.json`, {
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
