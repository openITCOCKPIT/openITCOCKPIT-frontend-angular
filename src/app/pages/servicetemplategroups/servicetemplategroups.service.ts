import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import {
    AllocateToHostGet,
    AllocateToHostGroupGet,
    AllocateToHostgroupPost,
    AllocateToMatchingHostgroupResponse,
    LoadContainersRoot,
    LoadHostgroupsByString,
    LoadHostsByStringResponse,
    LoadServicetemplategroupsByString,
    LoadServiceTemplatesRoot,
    ServiceTemplateGroupsAddPostRoot,
    ServiceTemplateGroupsAddPostServicetemplategroup,
    ServiceTemplateGroupsGetCopyGetServicetemplategroup,
    ServiceTemplateGroupsGetCopyPostData,
    ServiceTemplateGroupsGetEditRoot,
    ServiceTemplateGroupsIndexParams,
    ServiceTemplateGroupsIndexRoot,
    ServiceTemplateGroupssGetCopyGetRoot,
    ServiceTemplateGroupssGetEditPostServicetemplategroup
} from './servicetemplategroups.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root',
})

export class ServicetemplategroupsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: ServiceTemplateGroupsIndexParams): Observable<ServiceTemplateGroupsIndexRoot> {
        return this.http.get<ServiceTemplateGroupsIndexRoot>(`${this.proxyPath}/servicetemplategroups/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: ServiceTemplateGroupsIndexRoot) => {
                return data;
            })
        )
    }

    public addServicetemplateGroup(data: ServiceTemplateGroupsAddPostServicetemplategroup): Observable<GenericResponseWrapper> {
        const postObject: ServiceTemplateGroupsAddPostRoot = {
            Servicetemplategroup: data
        }
        return this.http.post<any>(`${this.proxyPath}/servicetemplategroups/add.json?angular=true`, postObject)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err: GenericValidationError = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        return this.http.get<LoadContainersRoot>(`${this.proxyPath}/servicetemplategroups/loadContainers.json?angular=true`);
    }

    public loadServicetemplatesByContainerId(containerId: number, servicetemplatesTemplateName: string, selected: number[]): Observable<LoadServiceTemplatesRoot> {
        let selectedString = '';
        for (let i = 0; i < selected.length; i++) {
            selectedString += `&selected[]=${selected[i]}`;
        }
        return this.http.get<LoadServiceTemplatesRoot>(`${this.proxyPath}/servicetemplategroups/loadServicetemplatesByContainerId.json?angular=true&containerId=${containerId}&filter[Servicetemplates.template_name]=${servicetemplatesTemplateName}${selectedString}`);
    }

    public getServicetemplategroupEdit(servicetemplateId: number): Observable<ServiceTemplateGroupsGetEditRoot> {
        return this.http.get<ServiceTemplateGroupsGetEditRoot>(`${this.proxyPath}/servicetemplategroups/edit/${servicetemplateId}.json?angular=true`);
    }

    public updateServicetemplategroup(servicetemplategroup: ServiceTemplateGroupssGetEditPostServicetemplategroup): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/servicetemplategroups/edit/${servicetemplategroup.id}.json?angular=true`, {
            Servicetemplategroup: servicetemplategroup
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

    public getServicetemplategroupsCopy(ids: number[]): Observable<ServiceTemplateGroupsGetCopyGetServicetemplategroup[]> {
        return this
            .http.get<ServiceTemplateGroupssGetCopyGetRoot>(`${this.proxyPath}/servicetemplategroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: ServiceTemplateGroupssGetCopyGetRoot) => {
                    return data.servicetemplategroups;
                })
            )
    }

    public saveServicetemplategroupsCopy(servicetemplategroups: ServiceTemplateGroupsGetCopyPostData[]): Observable<Object> {
        return this.http.post<any>(`${this.proxyPath}/servicetemplategroups/copy/.json?angular=true`, {
            data: servicetemplategroups
        });
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/servicetemplategroups/delete/${item.id}.json?angular=true`, {});
    }

    public loadServicetemplategroupsByString(containerName: string): Observable<LoadServicetemplategroupsByString> {
        return this.http.get<LoadServicetemplategroupsByString>(`${this.proxyPath}/servicetemplategroups/loadServicetemplategroupsByString.json?angular=true&filter[Containers.name]=${containerName}`);
    }

    public loadHostgroupsByString(containerName: string): Observable<LoadHostgroupsByString> {
        return this.http.get<LoadHostgroupsByString>(`${this.proxyPath}/servicetemplategroups/loadHostgroupsByString.json?angular=true&filter[Containers.name]=${containerName}`);
    }

    public allocateToHostgroupGet(servicetemplategroupId: number, hostgroupId: number): Observable<AllocateToHostGroupGet> {
        return this.http.get<AllocateToHostGroupGet>(`${this.proxyPath}/servicetemplategroups/allocateToHostgroup/${servicetemplategroupId}.json?angular=true&hostgroupId=${hostgroupId}`);
    }

    public allocateToHostgroup(servicetemplategroupId: number, item: AllocateToHostgroupPost): Observable<GenericResponseWrapper> {
        return this.http.post<GenericResponseWrapper>(`${this.proxyPath}/servicetemplategroups/allocateToHostgroup/${servicetemplategroupId}.json?angular=true`, item);
    }

    public allocateToMatchingHostgroup(servicetemplategroupId: number): Observable<AllocateToMatchingHostgroupResponse> {
        return this.http.post<AllocateToMatchingHostgroupResponse>(`${this.proxyPath}/servicetemplategroups/allocateToMatchingHostgroup/${servicetemplategroupId}.json?angular=true`, {})
            .pipe(
                catchError((error: any) => {
                    if (error.status === 400) {
                        return of({
                            success: false,
                            message: error.error.message,
                            _csrfToken: ''
                        });
                    } else {
                        // For other errors, re-throw the error
                        return error;
                    }
                })
            ) as Observable<AllocateToMatchingHostgroupResponse>
    }

    public allocateToHostGet(servicetemplategroupId: number, hostId: number): Observable<AllocateToHostGet> {
        return this.http.get<AllocateToHostGet>(`${this.proxyPath}/servicetemplategroups/allocateToHost/${this.proxyPath}.json?angular=true&hostId=${hostId}`);
    }

    public loadHostsByString(containerId: number, hostsName: string): Observable<LoadHostsByStringResponse> {
        return this.http.get<LoadHostsByStringResponse>(`${this.proxyPath}/hosts/loadHostsByString/${containerId}.json?angular=true&filter[Hosts.name]=${hostsName}&includeDisabled=false`);
    }

    public allocateToHost(servicetemplategroupId: number, item: AllocateToHostgroupPost): Observable<GenericResponseWrapper> {
        return this.http.post<GenericResponseWrapper>(`${this.proxyPath}/servicetemplategroups/allocateToHost/${servicetemplategroupId}.json?angular=true`, item);
    }
}
