import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    AcoRoot,
    LoadLdapgroups,
    Usergroup,
    UsergroupsAddRoot,
    UsergroupsCopyGetRoot,
    UsergroupsCopyPostRoot,
    UsergroupsEditGetRoot, UsergroupsEditPostRoot,
    UsergroupsIndexParams,
    UsergroupsIndexRoot
} from './usergroups.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class UsergroupsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: UsergroupsIndexParams): Observable<UsergroupsIndexRoot> {
        return this.http.get<UsergroupsIndexRoot>(`${this.proxyPath}/usergroups/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: UsergroupsIndexRoot) => {
                return data;
            })
        )
    }

    public getUsergroupsCopy(ids: number[]): Observable<UsergroupsCopyGetRoot> {
        return this
            .http.get<UsergroupsCopyGetRoot>(`${this.proxyPath}/usergroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: UsergroupsCopyGetRoot) => {
                    return data;
                })
            )
    }

    public saveUsergroupsCopy(post: UsergroupsCopyPostRoot): Observable<UsergroupsCopyPostRoot> {
        return this.http.post<UsergroupsCopyPostRoot>(`${this.proxyPath}/usergroups/copy/.json?angular=true`, post);
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/usergroups/delete/${item.id}.json?angular=true`, {});
    }

    public loadLdapgroupsForAngular(search: string = '', selected?: number[]): Observable<LoadLdapgroups> {
        return this.http.get<LoadLdapgroups>(`${this.proxyPath}/usergroups/loadLdapgroupsForAngular.json?angular=true&filter[Ldapgroups.cn]=${search}`,
            {
                params: selected ? {'selected[]': selected} : {}
            });
    }

    public loadAcos(): Observable<AcoRoot> {
        return this.http.get<AcoRoot>(`${this.proxyPath}/usergroups/add.json?angular=true`);
    }

    public addUsergroup(usergroup: UsergroupsAddRoot): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/usergroups/add.json?angular=true`, usergroup)
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

    public getEdit(id: number): Observable<UsergroupsEditGetRoot> {
        return this.http.get<UsergroupsEditGetRoot>(`${this.proxyPath}/usergroups/edit/${id}.json?angular=true`);
    }

    public updateUsergroup(post: UsergroupsEditPostRoot): Observable<any> {
        return this.http.post<any>(`${this.proxyPath}/usergroups/edit/${post.Usergroup.id}.json?angular=true`, post)
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
}
