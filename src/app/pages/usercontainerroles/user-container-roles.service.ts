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
    CopyUserContainerRoleDatum,
    CopyUserContainerRolesPost, CopyUserContainerRolesRequest,
    EditableUserContainerRole,
    UserContainerRole,
    UserContainerRolesIndex,
    UserContainerRolesIndexParams, UserContainerRolesIndexRoot
} from './usercontainerroles.interface';
import { LoadLdapgroups, UsergroupsCopyGetRoot, UsergroupsCopyPostRoot } from '../usergroups/usergroups.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

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
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/usercontainerroles/add.json?angular=true`, {Usercontainerrole: userContainerRole})
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
        return this.http.post<any>(`${proxyPath}/usercontainerroles/edit/${userContainerRole.id}.json?angular=true`, {Usercontainerrole: userContainerRole})
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

    public getCopy(ids: number[]): Observable<CopyUserContainerRolesRequest> {
        return this
            .http.get<CopyUserContainerRolesRequest>(`${this.proxyPath}/usercontainerroles/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: CopyUserContainerRolesRequest) => {
                    return data;
                })
            )
    }
    public saveCopy(post: CopyUserContainerRoleDatum[]): Observable<UsergroupsCopyPostRoot> {
        return this.http.post<UsergroupsCopyPostRoot>(`${this.proxyPath}/usercontainerroles/copy/.json?angular=true`, {data: post});
    }

    public loadLdapgroupsForAngular(search: string = ''): Observable<{ ldapgroups: SelectKeyValue[] }> {
        return this.http.get<{ ldapgroups: SelectKeyValue[] }>(`${this.proxyPath}/usercontainerroles/loadLdapgroupsForAngular.json?angular=true&filter[Ldapgroups.cn]=${search}`);
    }
}