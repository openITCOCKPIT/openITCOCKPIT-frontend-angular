import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ServiceescalationContainerResult,
    ServiceescalationEditApiResult,
    ServiceescalationElements,
    ServiceescalationExcludedServicegroups,
    ServiceescalationExcludedServices,
    ServiceescalationIndexRoot,
    ServiceescalationPost,
    ServiceescalationServices, ServiceescalationServiceValue, ServiceescalationServiceValues,
    ServiceescalationsIndexParams
} from './serviceescalations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';


@Injectable({
    providedIn: 'root'
})
export class ServiceescalationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: ServiceescalationsIndexParams): Observable<ServiceescalationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationIndexRoot>(`${proxyPath}/serviceescalations/index.json`, {
            params: params as {} // cast ServiceescalationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/serviceescalations/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<ServiceescalationContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationContainerResult>(`${proxyPath}/serviceescalations/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<ServiceescalationElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationElements>(`${proxyPath}/serviceescalations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadServices(containerId: number, searchString: string, servicesIds: number []): Observable<ServiceescalationServices> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationServices>(`${proxyPath}/services/loadServicesByStringCake4.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Services.name]': searchString,
                'selected[]': servicesIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadExcludedServices(containerId: number, searchString: string, excludedServicesIds: number [], servicegroupIds: number []): Observable<ServiceescalationExcludedServices> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationExcludedServices>(`${proxyPath}/serviceescalations/loadExcludedServicesByContainerIdAndServicegroupIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Services.name]': searchString,
                'selected[]': excludedServicesIds,
                'servicegroupIds[]': servicegroupIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadExcludedServicegroups(containerId: number, searchString: string, servicesIds: number [], excludedServicegroupIds: number []): Observable<ServiceescalationExcludedServicegroups> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationExcludedServicegroups>(`${proxyPath}/serviceescalations/loadExcludedServicegroupsByContainerIdAndServiceIds.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Containers.name]': searchString,
                'selected[]': excludedServicegroupIds,
                'serviceIds[]': servicesIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public add(serviceescalation: ServiceescalationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/serviceescalations/add.json?angular=true`, {
            Serviceescalation: serviceescalation
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
    public edit(serviceescalation: ServiceescalationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/serviceescalations/edit/${serviceescalation.id}.json?angular=true`, {
            Serviceescalation: serviceescalation
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

    public getEdit(id: number): Observable<ServiceescalationEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceescalationEditApiResult>(`${proxyPath}/serviceescalations/edit/${id}.json`, {
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
