import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadContainersRoot,
    LoadTimeperiodsParams,
    LoadTimeperiodsRoot,
    LoadUsersParams,
    LoadUsersRoot,
    SlaPost,
    SlasEditRoot,
    SlasHostsParams,
    SlasHostsRoot,
    SlasIndexParams,
    SlasIndexRoot
} from './Slas.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class SlasService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: SlasIndexParams): Observable<SlasIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasIndexRoot>(`${proxyPath}/sla_module/slas/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/sla_module/slas/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/containers/loadContainers.json?angular=true`).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public loadUsers(params: LoadUsersParams): Observable<LoadUsersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadUsersRoot>(`${proxyPath}/users/loadUsersByContainerId.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadUsersRoot) => {
                return data;
            })
        )
    }

    public loadTimeperiods(params: LoadTimeperiodsParams): Observable<LoadTimeperiodsRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadTimeperiodsRoot>(`${proxyPath}/timeperiods/loadTimeperiodsByContainerId.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadTimeperiodsRoot) => {
                return data;
            })
        )
    }

    public add(sla: SlaPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/add.json?angular=true`, sla)
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

    public getEdit(id: number): Observable<SlasEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasEditRoot>(`${proxyPath}/sla_module/slas/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateSla(sla: SlaPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/slas/edit/${sla.id}.json?angular=true`, sla)
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

    public getSlaHosts(id: number, params: SlasHostsParams): Observable<SlasHostsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlasHostsRoot>(`${proxyPath}/sla_module/slas/hosts/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
