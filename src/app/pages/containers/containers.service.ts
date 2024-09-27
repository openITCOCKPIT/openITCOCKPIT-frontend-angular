import { inject, Injectable } from '@angular/core';
import { ContainersIndexNested, ContainersLoadContainersByStringParams, NodePost } from './containers.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ContainersService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public loadContainersByString(params: ContainersLoadContainersByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.containers;
            })
        );
    }


    /**********************
     *    Index action    *
     **********************/
    public loadAllContainers(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/containers/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public loadContainersByContainerId(id: number): Observable<ContainersIndexNested[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            nest: ContainersIndexNested[]
        }>(`${proxyPath}/containers/loadContainersByContainerId/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.nest;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/containers/delete/${item.id}.json?angular=true`, {});
    }

    /**********************
     *     Add action     *
     **********************/
    public add(node: NodePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/containers/add.json?angular=true`, {Container: node})
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
