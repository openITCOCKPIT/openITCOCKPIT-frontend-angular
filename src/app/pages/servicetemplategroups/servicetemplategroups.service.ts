import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import {
    ServiceTemplateGroupsIndexRoot,
    ServiceTemplateGroupsIndexParams,
    LoadContainersRoot,
    LoadServiceTemplatesRoot,
    ServiceTemplateGroupsAddPostRoot,
    ServiceTemplateGroupsAddPostServicetemplategroup,
    ServiceTemplateGroupsGetEditRoot,
    ServiceTemplateGroupssGetEditPostServicetemplategroup,
    ServiceTemplateGroupsGetCopyGetServicetemplategroup,
    ServiceTemplateGroupssGetCopyGetRoot,
    ServiceTemplateGroupsGetCopyPostData,
    LoadServicetemplategroupsByString,
    LoadHostgroupsByString,
    AllocateToHostGroupGet,
    AllocateToHostgroupPost,
    AllocateToHostGet,
    AllocateToMatchingHostgroupResponse, LoadHostsByStringResponse
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
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceTemplateGroupsIndexRoot>(`${proxyPath}/servicetemplategroups/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: ServiceTemplateGroupsIndexRoot) => {
                return data;
            })
        )
    }

    public addServicetemplateGroup(data: ServiceTemplateGroupsAddPostServicetemplategroup): Observable<GenericResponseWrapper> {

        const proxyPath: string = this.proxyPath;
        const postObject: ServiceTemplateGroupsAddPostRoot = {
            Servicetemplategroup: data
        }
        return this.http.post<any>(`${proxyPath}/servicetemplategroups/add.json?angular=true`, postObject)
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
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/servicetemplategroups/loadContainers.json?angular=true`);
    }

    public loadServicetemplatesByContainerId(containerId: number, servicetemplatesTemplateName: string, selected: number[]): Observable<LoadServiceTemplatesRoot> {
        const proxyPath: string = this.proxyPath;
        let selectedString = '';
        for (let i = 0; i < selected.length; i++) {
            selectedString += `&selected[]=${selected[i]}`;
        }
        return this.http.get<LoadServiceTemplatesRoot>(`${proxyPath}/servicetemplategroups/loadServicetemplatesByContainerId.json?angular=true&containerId=${containerId}&filter[Servicetemplates.template_name]=${servicetemplatesTemplateName}${selectedString}`);
    }

    public getServicetemplategroupEdit(servicetemplateId: number): Observable<ServiceTemplateGroupsGetEditRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<ServiceTemplateGroupsGetEditRoot>(`${proxyPath}/servicetemplategroups/edit/${servicetemplateId}.json?angular=true`);
    }

    public updateServicetemplategroup(servicetemplategroup: ServiceTemplateGroupssGetEditPostServicetemplategroup): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicetemplategroups/edit/${servicetemplategroup.id}.json?angular=true`, {
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
        const proxyPath: string = this.proxyPath;
        return this
            .http.get<ServiceTemplateGroupssGetCopyGetRoot>(`${proxyPath}/servicetemplategroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: ServiceTemplateGroupssGetCopyGetRoot) => {
                    return data.servicetemplategroups;
                })
            )
    }


    public saveServicetemplategroupsCopy(servicetemplategroups: ServiceTemplateGroupsGetCopyPostData[]): Observable<Object> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicetemplategroups/copy/.json?angular=true`, {
            data: servicetemplategroups
        });
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath: string = this.proxyPath;

        return this.http.post(`${proxyPath}/servicetemplategroups/delete/${item.id}.json?angular=true`, {});
    }

    public loadServicetemplategroupsByString(containerName: string): Observable<LoadServicetemplategroupsByString> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadServicetemplategroupsByString>(`${proxyPath}/servicetemplategroups/loadServicetemplategroupsByString.json?angular=true&filter[Containers.name]=${containerName}`);
    }

    public loadHostgroupsByString(containerName: string): Observable<LoadHostgroupsByString> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadHostgroupsByString>(`${proxyPath}/servicetemplategroups/loadHostgroupsByString.json?angular=true&filter[Containers.name]=${containerName}`);
    }

    public allocateToHostgroupGet(servicetemplategroupId: number, hostgroupId: number): Observable<AllocateToHostGroupGet> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<AllocateToHostGroupGet>(`${proxyPath}/servicetemplategroups/allocateToHostgroup/${servicetemplategroupId}.json?angular=true&hostgroupId=${hostgroupId}`);
    }

    public allocateToHostgroup(servicetemplategroupId: number, item: AllocateToHostgroupPost): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<GenericResponseWrapper>(`${proxyPath}/servicetemplategroups/allocateToHostgroup/${servicetemplategroupId}.json?angular=true`, item);
    }

    public allocateToMatchingHostgroup(servicetemplategroupId: number): Observable<AllocateToMatchingHostgroupResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<AllocateToMatchingHostgroupResponse>(`${proxyPath}/servicetemplategroups/allocateToMatchingHostgroup/${servicetemplategroupId}.json?angular=true`, {})
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
        const proxyPath: string = this.proxyPath;
        return this.http.get<AllocateToHostGet>(`${proxyPath}/servicetemplategroups/allocateToHost/${servicetemplategroupId}.json?angular=true&hostId=${hostId}`);
    }

    public loadHostsByString(containerId: number, hostsName: string): Observable<LoadHostsByStringResponse> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadHostsByStringResponse>(`${proxyPath}/hosts/loadHostsByString/${containerId}.json?angular=true&filter[Hosts.name]=${hostsName}&includeDisabled=false`);
    }

    public allocateToHost(servicetemplategroupId: number, item: AllocateToHostgroupPost): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<GenericResponseWrapper>(`${proxyPath}/servicetemplategroups/allocateToHost/${servicetemplategroupId}.json?angular=true`, item);
    }
}
