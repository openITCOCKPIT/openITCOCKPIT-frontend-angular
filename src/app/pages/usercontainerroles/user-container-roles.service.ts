import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    GenericIdResponse,
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    EditableUserContainerRole,
    UserContainerRole,
    UserContainerRolesIndex,
    UserContainerRolesIndexParams, UserContainerRolesIndexRoot
} from './usercontainerroles.interface';

@Injectable({
    providedIn: 'root'
})
export class UserContainerRolesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: UserContainerRolesIndexParams): Observable<UserContainerRolesIndexRoot> {
        return this.http.get<UserContainerRolesIndexRoot>(`${this.proxyPath}/usercontainerroles/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: UserContainerRolesIndexRoot) => {
                return data;
            })
        )
    }


    public addUserContainerRole(userContainerRole: UserContainerRole): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/usercontainerroles/add.json?angular=true`, {usercontainerrole: userContainerRole})
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as unknown as GenericIdResponse
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
    public getEdit(id: number): Observable<EditableUserContainerRole> {
        return this.http.get<{
            usercontainerrole: EditableUserContainerRole
        }>(`${this.proxyPath}/usercontainerroles/edit/${id}.json?angular=true`)
            .pipe(
                map((data: { usercontainerrole: EditableUserContainerRole }) => {
                    return data.usercontainerrole;
                })
            )
    }
    public updateUserContainerRole(userContainerRole: EditableUserContainerRole): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/usercontainerroles/edit/${userContainerRole.id}.json?angular=true`, {usercontainerrole: userContainerRole})
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as unknown as GenericIdResponse
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

    public delete(item: DeleteAllItem): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/usercontainerroles/delete/${item.id}.json?angular=true`, {})
            .pipe(
                map(data => {
                    return data;
                }),
                catchError((error: any) => {
                    const err: GenericSuccessResponse = {
                        success: false
                    }
                    return of(err);
                })
            );
    }

    public getCopy():void{}
    public copy(): void{}
}