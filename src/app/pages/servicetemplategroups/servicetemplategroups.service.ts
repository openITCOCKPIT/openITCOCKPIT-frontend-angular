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
    LoadHostgroupsByString, AllocateToHostGroupGet
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

    public loadServicetemplatesByContainerId(containerId: number): Observable<LoadServiceTemplatesRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadServiceTemplatesRoot>(`${proxyPath}/servicetemplategroups/loadServicetemplatesByContainerId.json?angular=true&containerId=${containerId}`);
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

    public loadServicetemplategroupsByString(): Observable<LoadServicetemplategroupsByString> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadServicetemplategroupsByString>(`${proxyPath}/servicetemplategroups/loadServicetemplategroupsByString.json?angular=true`);
    }

    public loadHostgroupsByString(): Observable<LoadHostgroupsByString> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadHostgroupsByString>(`${proxyPath}/servicetemplategroups/loadHostgroupsByString.json?angular=true`);
    }

    public allocateToHostgroupGet(servicetemplategroupId: number, hostgroupId: number): Observable<AllocateToHostGroupGet> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<AllocateToHostGroupGet>(`${proxyPath}/servicetemplategroups/allocateToHostgroup/${servicetemplategroupId}.json?angular=true&hostgroupId=${hostgroupId}`);
    }
}
