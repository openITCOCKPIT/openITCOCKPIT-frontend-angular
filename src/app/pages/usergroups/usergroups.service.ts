import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    AcoRoot,
    LoadLdapgroups,
    UsergroupsAddRoot,
    UsergroupsCopyGetRoot,
    UsergroupsCopyPostRoot,
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
        const proxyPath = this.proxyPath;
        return this.http.get<UsergroupsIndexRoot>(`${proxyPath}/usergroups/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: UsergroupsIndexRoot) => {
                return data;
            })
        )
    }


    public getUsergroupsCopy(ids: number[]): Observable<UsergroupsCopyGetRoot> {
        const proxyPath: string = this.proxyPath;
        return this
            .http.get<UsergroupsCopyGetRoot>(`${proxyPath}/usergroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: UsergroupsCopyGetRoot) => {
                    return data;
                })
            )
    }

    public saveUsergroupsCopy(post: UsergroupsCopyPostRoot): Observable<UsergroupsCopyPostRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<UsergroupsCopyPostRoot>(`${proxyPath}/usergroups/copy/.json?angular=true`, post);
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath: string = this.proxyPath;

        return this.http.post(`${proxyPath}/usergroups/delete/${item.id}.json?angular=true`, {});
    }

    public loadLdapgroupsForAngular(search: string = ''): Observable<LoadLdapgroups> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<LoadLdapgroups>(`${proxyPath}/usergroups/loadLdapgroupsForAngular.json?angular=true&filter[Ldapgroups.cn]=${search}`);
    }

    public loadAcos(): Observable<AcoRoot> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<AcoRoot>(`${proxyPath}/usergroups/add.json?angular=true`);
    }

    public addUsergroup(usergroup: UsergroupsAddRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/usergroups/add.json?angular=true`, usergroup)
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
