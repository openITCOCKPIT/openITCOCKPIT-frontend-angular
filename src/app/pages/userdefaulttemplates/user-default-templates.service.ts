import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    UserDefaultTemplatesEditResponse,
    UserDefaultTemplatesIndexParams,
    UserDefaultTemplatesIndexRoot,
    UserDefaultTemplatesPost
} from './user-default-templates.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class UserDefaultTemplatesService {

    constructor() {
    }

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/userDefaultTemplates/delete/${item.id}.json?angular=true`, {});
    }

    public getIndex(params: UserDefaultTemplatesIndexParams): Observable<UserDefaultTemplatesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<UserDefaultTemplatesIndexRoot>(`${proxyPath}/userDefaultTemplates/index.json`, {
            params: params as {} // cast UsersIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public add(userDefaultTemplate: UserDefaultTemplatesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/userDefaultTemplates/add.json?angular=true`, {
            Userdefaulttemplate: userDefaultTemplate
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.user as GenericIdResponse
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

    public getUserDefaultTemplatesEdit(id: number): Observable<UserDefaultTemplatesEditResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<UserDefaultTemplatesEditResponse>(`${proxyPath}/userDefaultTemplates/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public saveUserDefaultTemplatesEdit(userDefaultTemplate: UserDefaultTemplatesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/userDefaultTemplates/edit/${userDefaultTemplate.id}.json?angular=true`, {
            Userdefaulttemplate: userDefaultTemplate
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.user as GenericIdResponse
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
