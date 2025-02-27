import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ResourcesGet, ResourcesIndex, ResourcesIndexParams, ResourcesPost } from './resources.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { ResourcegroupsGet, ResourcegroupsPost } from '../resourcegroups/resourcegroups.interface';

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public getResources(params: ResourcesIndexParams): Observable<ResourcesIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResourcesIndex>(`${proxyPath}/scm_module/resources/index.json`, {
            params: params as {} // cast ResourcesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadResourcegroups(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            resourcegroups: SelectKeyValue[]
        }>(`${proxyPath}/scm_module/resources/loadResourcegroups.json?angular=true`, {}).pipe(
            map(data => {
                return data.resourcegroups;
            })
        );
    }


    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/scm_module/resources/delete/${item.id}.json?angular=true`, {});
    }

    public createResource(resource: ResourcesPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/resources/add.json?angular=true`, {
            Resource: resource
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

    public getEdit(id: number): Observable<ResourcesGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            resource: {
                Resource: ResourcesPost
            }
        }>(`${proxyPath}/scm_module/resources/edit/${id}.json`, {
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
    public edit(resource: ResourcesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/resources/edit/${resource.id}.json?angular=true`, {
            Resource: resource
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
}
