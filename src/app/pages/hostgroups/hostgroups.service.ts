import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import {
    AddHostgroupsPost,
    HostgroupsCopyGet,
    HostgroupsCopyGetHostgroup,
    HostgroupsCopyPostResult,
    HostgroupsEditGet,
    Hostgroup,
    HostgroupsIndexParams,
    HostgroupsIndexRoot,
    LoadContainersRoot,
    LoadHostsRequest,
    LoadHostsResponse,
    LoadHosttemplates, HostgroupExtended, HostgroupExtendedRoot
} from "./hostgroups.interface";
import { HttpClient } from "@angular/common/http";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from "../../generic-responses";
import { DeleteAllItem } from "../../layouts/coreui/delete-all-modal/delete-all.interface";


@Injectable({
    providedIn: 'root'
})
export class HostgroupsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: HostgroupsIndexParams): Observable<HostgroupsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostgroupsIndexRoot>(`${proxyPath}/hostgroups/index.json`, {
            params: params as {} // cast HostgroupsIndexParams into object
        }).pipe(
            map((data: HostgroupsIndexRoot) => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/hostgroups/loadContainers.json?angular=true`).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public loadHosts(containerId: number, search: string, selected: number[]): Observable<LoadHostsResponse> {
        const proxyPath: string = this.proxyPath;
        let postObject: LoadHostsRequest = {
            containerId: containerId,
            filter: {
                'Hosts.name': search
            },
            selected: selected
        }
        return this.http.post<LoadHostsResponse>(`${proxyPath}/hostgroups/loadHosts.json?angular=true`, postObject).pipe(
            map((data: LoadHostsResponse) => {
                return data;
            })
        )
    }

    public loadHosttemplates(containerId: number, search: string, selected: number[]): Observable<LoadHosttemplates> {
        const proxyPath: string = this.proxyPath;
        let selectedString = '';
        for (let i = 0; i < selected.length; i++) {
            selectedString += `&selected[]=${selected[i]}`;
        }
        return this.http.get<LoadHosttemplates>(`${proxyPath}/hostgroups/loadHosttemplates.json?angular=true&containerId=${containerId}&filter[Hosttemplates.name]=${search}`).pipe(
            map((data: LoadHosttemplates) => {
                return data;
            })
        )
    }

    public addHostgroup(hostgroup: Hostgroup): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        const postObject: AddHostgroupsPost = {Hostgroup: hostgroup}
        return this.http.post<any>(`${proxyPath}/hostgroups/add.json?angular=true`, postObject)
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

    public listToPdf(params: HostgroupsIndexParams) {

    }

    public listToCsv(params: HostgroupsIndexParams) {

    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/hostgroups/delete/${item.id}.json?angular=true`, {});
    }


    public getEdit(id: number): Observable<HostgroupsEditGet> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<HostgroupsEditGet>(`${proxyPath}/hostgroups/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateHostgroup(hostgroup: Hostgroup): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostgroups/edit/${hostgroup.id}.json?angular=true`, {
            Hostgroup: hostgroup
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

    public getHostgroupsCopy(ids: number[]): Observable<HostgroupsCopyGetHostgroup[]> {
        const proxyPath: string = this.proxyPath;
        return this
            .http.get<HostgroupsCopyGet>(`${proxyPath}/hostgroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: HostgroupsCopyGet) => {
                    return data.hostgroups;
                })
            )
    }

    public saveHostgroupsCopy(items: HostgroupsCopyPostResult[]) {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostgroups/copy/.json?angular=true`, {
            data: items
        });

    }

    public loadHostgroupWithHostsById(id: number): Observable<HostgroupExtended> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<HostgroupExtendedRoot>(`${proxyPath}/hostgroups/loadHostgroupWithHostsById/${id}.json?angular=true`, {
            params: {
                'filter["Hosts.name"]': '',
            }
        }).pipe(
            map((data: HostgroupExtendedRoot) => {
                return data.hostgroup;
            })
        )

    }

}
