import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    EditUserGet,
    LoadContainerPermissionsRequest,
    LoadContainerPermissionsRoot,
    LoadContainerRolesRequest,
    LoadContainerRolesRoot,
    LoadContainersResponse,
    LoadLdapUserByStringRoot,
    LoadLdapUserDetailsRoot,
    LoadUsergroupsRoot,
    LoginGetRoot,
    UpdateUser,
    UserDateformat,
    UserDateformatsRoot,
    UserLocaleOption,
    UsersAddRoot,
    UsersIndexParams,
    UsersIndexRoot,
    UserTimezoneGroup,
    UserTimezonesSelect
} from './users.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../containers/containers.interface';


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor() {
    }

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: UsersIndexParams): Observable<UsersIndexRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<UsersIndexRoot>(`${proxyPath}/users/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: UsersIndexRoot): UsersIndexRoot => {
                return data;
            })
        );
    }

    public loadContainersByString(params: ContainersLoadContainersByStringParams): Observable<LoadContainersResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<LoadContainersResponse>(`${proxyPath}/users/loadContainersForAngular.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadContainersResponse) => {
                return data;
            })
        );
    }
    public loadContainerRoles(params: LoadContainerRolesRequest): Observable<LoadContainerRolesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainerRolesRoot>(`${proxyPath}/users/loadContainerRoles.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getLoginDetails(): Observable<LoginGetRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoginGetRoot>(`${proxyPath}/users/login.json`).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadContainerPermissions(params: LoadContainerPermissionsRequest): Observable<LoadContainerPermissionsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainerPermissionsRoot>(`${proxyPath}/users/loadContainerPermissions.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        );

    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/users/delete/${item.id}.json?angular=true`, {});
    }

    public getLocaleOptions(): Observable<UserLocaleOption[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ localeOptions: UserLocaleOption[] }>(`${proxyPath}/users/getLocaleOptions.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.localeOptions;
            })
        );
    }

    public getUsergroups(): Observable<LoadUsergroupsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadUsergroupsRoot>(`${proxyPath}/users/loadUsergroups.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadLdapUserByString(samaccountname: string): Observable<LoadLdapUserByStringRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadLdapUserByStringRoot>(`${proxyPath}/users/loadLdapUserByString.json`, {
            params: {
                angular: true,
                samaccountname: samaccountname
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadLdapUserDetails(samaccountname: string): Observable<LoadLdapUserDetailsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadLdapUserDetailsRoot>(`${proxyPath}/users/loadLdapUserDetails.json`, {
            params: {
                angular: true,
                samaccountname: samaccountname
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }




    public addUser(user: UsersAddRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/add.json?angular=true`, user)
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
    public addFromLdap(user: UsersAddRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/addFromLdap.json?angular=true`, user)
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

    public getEdit(id: number): Observable<EditUserGet> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<EditUserGet>(`${proxyPath}/users/edit/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    public updateUser(user: UpdateUser): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/edit/${user.User.id}.json?angular=true`, user)
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

    public resetPassword(id: number): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/resetPassword/${id}.json?angular=true`, {})
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

    public getDateformats(): Observable<UserDateformatsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            dateformats: UserDateformat[],
            defaultDateFormat: string,
            timezones: UserTimezoneGroup,
            serverTime: string,
            serverTimeZone: string
        }>(`${proxyPath}/users/loadDateformats.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // We reformat the timezones, so we can use them in a select box

                let timezones: UserTimezonesSelect[] = [];
                for (var timezoneGroup in data.timezones) {
                    for (var timezone in data.timezones[timezoneGroup]) {
                        timezones.push({
                            group: timezoneGroup,
                            value: timezone,
                            name: data.timezones[timezoneGroup][timezone]
                        });
                    }

                }

                let result: UserDateformatsRoot = {
                    dateformats: data.dateformats,
                    defaultDateFormat: data.defaultDateFormat,
                    timezones: timezones,
                    serverTime: data.serverTime,
                    serverTimeZone: data.serverTimeZone
                };
                return result;
            })
        );
    }
}
