import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    CopyUserContainerRoleDatum,
    CopyUserContainerRolesRequest,
    UsercontainerrolesGet, UsercontainerrolesIndex, UsercontainerrolesIndexParams,
    UsercontainerrolesPost
} from './usercontainerroles.interface';
import { LoadLdapgroups, UsergroupsCopyPostRoot } from '../usergroups/usergroups.interface';
import { ResourcesIndex } from '../../modules/scm_module/pages/resources/resources.interface';

@Injectable({
    providedIn: 'root'
})
export class UsercontainerrolesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);


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

    public loadLdapGroups(searchString: string) {
        return this.http.get<LoadLdapgroups>(`${this.proxyPath}/usercontainerroles/loadLdapgroupsForAngular.json?angular=true&filter[Ldapgroups.cn]=${searchString}`);
    }

    /**********************
     *    Add action    *
     **********************/
    public createUsercontainerrole(usercontainerrole: UsercontainerrolesPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/usercontainerroles/add.json?angular=true`, {
            Usercontainerrole: usercontainerrole
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

    public getEdit(id: number): Observable<UsercontainerrolesGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            usercontainerrole: UsercontainerrolesPost
        }>(`${proxyPath}/usercontainerroles/edit/${id}.json`, {
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
    public edit(usercontainerrole: UsercontainerrolesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/usercontainerroles/edit/${usercontainerrole.id}.json?angular=true`, {
            Usercontainerrole: usercontainerrole
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.usercontainerrole as GenericIdResponse
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

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/usercontainerroles/delete/${item.id}.json?angular=true`, {});
    }

    public getUsercontainerrolesIndex(params: UsercontainerrolesIndexParams) {
        const proxyPath = this.proxyPath;
        return this.http.get<UsercontainerrolesIndex>(`${proxyPath}/usercontainerroles/index.json`, {
            params: params as {} // cast UsercontainerrolesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
