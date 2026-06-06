import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import {
    AddServicegroupsPost,
    LoadContainersRoot,
    LoadServicesForServices,
    LoadServicesRequest,
    LoadServicesResponse,
    LoadServicetemplates,
    Servicegroup,
    ServicegroupAppend,
    ServiceGroupExtendedRoot,
    ServicegroupsCopyGet,
    ServicegroupsCopyGetServicegroup,
    ServicegroupsCopyPostResult,
    ServicegroupsEditGet,
    ServicegroupsExtendedParams,
    ServicegroupsExtendedServiceListParams,
    ServicegroupsIndexFilter,
    ServicegroupsIndexParams,
    ServicegroupsIndexRoot,
    ServicegroupsLoadServicegroupsByStringParams
} from "./servicegroups.interface";
import { HttpClient } from "@angular/common/http";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import {
    GenericActionErrorResponse,
    GenericIdResponse,
    GenericResponseWrapper,
    GenericValidationError
} from "../../generic-responses";
import { DeleteAllItem } from "../../layouts/coreui/delete-all-modal/delete-all.interface";
import { SelectKeyValue } from '../../layouts/primeng/select.interface';


@Injectable({
    providedIn: 'root'
})
export class ServicegroupsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: ServicegroupsIndexParams, filter: ServicegroupsIndexFilter): Observable<ServicegroupsIndexRoot> {
        const proxyPath = this.proxyPath;
        // ITC-2599 Change load function to use POST
        return this.http.post<ServicegroupsIndexRoot>(`${proxyPath}/servicegroups/index.json`, {
            filter: filter as {} // POST data used for filter
        }, {
            params: params as {} // query string parameter
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/servicegroups/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public loadServices(containerId: number, search: string, selected: number[]): Observable<LoadServicesResponse> {
        const proxyPath: string = this.proxyPath;
        let postObject: LoadServicesRequest = {
            containerId: containerId,
            filter: {
                'servicename': search
            },
            selected: selected
        }
        return this.http.post<LoadServicesResponse>(`${proxyPath}/servicegroups/loadServicesByStringForOptionGroup.json?angular=true`, postObject).pipe(
            map((data: LoadServicesResponse) => {
                return data;
            })
        )
    }

    public loadServicetemplates(containerId: number, search: string, selected: number[]): Observable<LoadServicetemplates> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadServicetemplates>(`${proxyPath}/servicegroups/loadServicetemplates.json`, {
            params: {
                angular: true,
                'containerId': containerId,
                'filter[Servicetemplates.template_name]': search,
                'selected[]': selected
            }
        }).pipe(
            map((data: LoadServicetemplates) => {
                return data;
            })
        )
    }

    public addServicegroup(servicegroup: Servicegroup): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        const postObject: AddServicegroupsPost = {Servicegroup: servicegroup}
        return this.http.post<any>(`${proxyPath}/servicegroups/add.json?angular=true`, postObject)
            .pipe(
                map(data => {
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

    public listToPdf(params: ServicegroupsIndexParams) {

    }

    public listToCsv(params: ServicegroupsIndexParams) {

    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath: string = this.proxyPath;

        return this.http.post(`${proxyPath}/servicegroups/delete/${item.id}.json?angular=true`, {});
    }


    public getEdit(id: number): Observable<ServicegroupsEditGet> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<ServicegroupsEditGet>(`${proxyPath}/servicegroups/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateServicegroup(servicegroup: Servicegroup): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicegroups/edit/${servicegroup.id}.json?angular=true`, {
            Servicegroup: servicegroup
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

    public getServicegroupsCopy(ids: number[]): Observable<ServicegroupsCopyGetServicegroup[]> {
        const proxyPath: string = this.proxyPath;
        return this
            .http.get<ServicegroupsCopyGet>(`${proxyPath}/servicegroups/copy/${ids.join('/')}.json?angular=true`, {
                params: {
                    angular: true
                }
            })
            .pipe(
                map((data: ServicegroupsCopyGet) => {
                    return data.servicegroups;
                })
            )
    }

    public saveServicegroupsCopy(items: ServicegroupsCopyPostResult[]) {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicegroups/copy/.json?angular=true`, {
            data: items
        });

    }

    public loadServicegroupsByString(params: ServicegroupsLoadServicegroupsByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            servicegroups: SelectKeyValue[]
        }>(`${proxyPath}/servicegroups/loadServicegroupsByString.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.servicegroups;
            })
        );
    }

    public loadServicegroupWithServicesById(id: number, params: ServicegroupsExtendedParams): Observable<ServiceGroupExtendedRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<ServiceGroupExtendedRoot>(`${proxyPath}/servicegroups/loadServicegroupWithServicesById/${id}.json`, {
            params: params as {}
        }).pipe(
            map((data: ServiceGroupExtendedRoot) => {
                return data;
            })
        )
    }

    public loadServicesByServiceId(serviceId: number, params: ServicegroupsExtendedServiceListParams): Observable<LoadServicesForServices> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadServicesForServices>(`${proxyPath}/services/index.json`, {
            params: params as {}
        }).pipe(
            map((data: LoadServicesForServices) => {
                return data;
            })
        )
    }

    public appendServices(param: ServicegroupAppend): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicegroups/append/.json?angular=true`, param)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.message as GenericActionErrorResponse;
                    return of({
                        success: false,
                        data: {
                            servicegroup_id: {
                                err
                            }
                        }
                    });
                })
            );
    }

    public loadServicegroupsByContainerId(containerId: number, selected: any[], resolveContainerIds: boolean = true): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            servicegroups: SelectKeyValue[]
        }>(`${proxyPath}/servicegroups/loadServicegroupsByContainerId.json`, {
            params: {
                angular: true,
                containerId: containerId,
                'selected[]': selected,
                resolveContainerIds: resolveContainerIds
            }
        }).pipe(
            map(data => {
                return data.servicegroups;
            })
        );
    }
}
