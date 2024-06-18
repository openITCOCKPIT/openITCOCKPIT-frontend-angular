import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ServicedependenciesIndexParams,
    ServicedependencyContainerResult,
    ServicedependencyDependentServicegroups,
    ServicedependencyEditApiResult,
    ServicedependencyElements,
    ServicedependencyServices,
    ServicedependencyIndexRoot,
    ServicedependencyPost
} from './servicedependencies.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class ServicedependenciesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: ServicedependenciesIndexParams): Observable<ServicedependencyIndexRoot> {
        const proxyPath = this.proxyPath;
        let cleanParams = params as any;
        // Use cleanParams as temp variable to remove empty filter values from the  params['filter[Servicedependencies.inherits_parent]
        if (params['filter[Servicedependencies.inherits_parent][0]'] === '') {
            delete cleanParams['filter[Servicedependencies.inherits_parent][0]'];
        }
        if (params['filter[Servicedependencies.inherits_parent][1]'] === '') {
            delete cleanParams['filter[Servicedependencies.inherits_parent][1]'];
        }
        return this.http.get<ServicedependencyIndexRoot>(`${proxyPath}/servicedependencies/index.json`, {
            params: cleanParams as {} // cast ServicedependenciesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/servicedependencies/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<ServicedependencyContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyContainerResult>(`${proxyPath}/servicedependencies/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<ServicedependencyElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyElements>(`${proxyPath}/servicedependencies/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadServices(containerId: number, searchString: string, servicesIds: number []): Observable<ServicedependencyServices> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyServices>(`${proxyPath}/services/loadServicesByContainerId.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Services.servicename]': searchString,
                'selected[]': servicesIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadDependentServices(containerId: number, searchString: string, dependentServicesIds: number []): Observable<ServicedependencyServices> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyServices>(`${proxyPath}/services/loadServicesByContainerId.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Services.servicename]': searchString,
                'selected[]': dependentServicesIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadDependentServicegroups(containerId: number, searchString: string, servicesIds: number [], dependentServicegroupIds: number []): Observable<ServicedependencyDependentServicegroups> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyDependentServicegroups>(`${proxyPath}/servicedependencies/loadDependentServicegroupsByContainerIdAndServiceIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Containers.name]': searchString,
                'selected[]': dependentServicegroupIds,
                'serviceIds[]': servicesIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public add(servicedependency: ServicedependencyPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicedependencies/add.json?angular=true`, {
            Servicedependency: servicedependency
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
    public edit(servicedependency: ServicedependencyPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicedependencies/edit/${servicedependency.id}.json?angular=true`, {
            Servicedependency: servicedependency
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

    public getEdit(id: number): Observable<ServicedependencyEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicedependencyEditApiResult>(`${proxyPath}/servicedependencies/edit/${id}.json`, {
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
