import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    ResourcegroupsGet,
    ResourcegroupsIndex,
    ResourcegroupsIndexParams,
    ResourcegroupsPost
} from './resourcegroups.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ResourcegroupsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getResourcegroups(params: ResourcegroupsIndexParams): Observable<ResourcegroupsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResourcegroupsIndex>(`${proxyPath}/scm_module/resourcegroups/index.json`, {
            params: params as {} // cast ResourcegroupsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *    Add action    *
     **********************/
    public createResourcegroup(resourcegroup: ResourcegroupsPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/resourcegroups/add.json?angular=true`, {
            Resourcegroup: resourcegroup
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

    public getEdit(id: number): Observable<ResourcegroupsGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            resourcegroup: {
                Resourcegroup: ResourcegroupsPost
            }
        }>(`${proxyPath}/scm_module/resourcegroups/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Edit action    *
     **********************/
    public edit(resourcegroup: ResourcegroupsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/resourcegroups/edit/${resourcegroup.id}.json?angular=true`, {
            Resourcegroup: resourcegroup
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
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/scm_module/resourcegroups/delete/${item.id}.json?angular=true`, {});
    }
}
