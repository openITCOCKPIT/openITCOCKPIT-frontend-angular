import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadUsersRoot,
    SystemHealthUserAdd,
    SystemHealthUserEditGet,
    SystemHealthUserEditPost,
    SystemHealthUsersIndex,
    SystemHealthUsersIndexParams
} from './systemhealthusers.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

// import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root',
})
export class SystemHealthUsersService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: SystemHealthUsersIndexParams): Observable<SystemHealthUsersIndex> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<SystemHealthUsersIndex>(`${proxyPath}/systemHealthUsers/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: SystemHealthUsersIndex) => {
                return data;
            })
        )
    }

    public loadUsers(): Observable<LoadUsersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadUsersRoot>(`${proxyPath}/systemHealthUsers/loadUsers.json?angular=true`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: LoadUsersRoot) => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/systemHealthUsers/delete/${item.id}.json?angular=true`, {});
    }

    public getEdit(id: number): Observable<SystemHealthUserEditGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemHealthUserEditGet>(`${proxyPath}/systemHealthUsers/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: SystemHealthUserEditGet) => {
                return data;
            })
        )
    }

    public updateSystemHealthUser(systemHealthUser: SystemHealthUserEditPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemHealthUsers/edit/${systemHealthUser.id}.json?angular=true`, systemHealthUser)
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

    public createSystemHealthUsers(systemHealthUser: SystemHealthUserAdd): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemHealthUsers/add.json?angular=true`, {
            SystemHealthUser: systemHealthUser
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.systemHealthUser as GenericIdResponse
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
