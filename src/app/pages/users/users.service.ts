import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    LoginGetRoot,
    UserAddContainerRolePermission,
    UserAddUserContainerRoleContainerPermissionsResponse,
    UserDateformatsRoot,
    UserLocaleOption,
    UserPost,
    UsersEditResponse,
    UsersIndexParams,
    UsersIndexRoot,
    UsersLdapUser,
    UsersLdapUserDetails,
    UserTimezoneGroup,
    UserTimezonesSelect
} from './users.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { SelectKeyValue, SelectKeyValueString } from '../../layouts/primeng/select.interface';


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor() {
    }

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getLoginDetails(): Observable<LoginGetRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoginGetRoot>(`${proxyPath}/users/login.json`).pipe(
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
            dateformats: SelectKeyValueString[],
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

    public loadUsersByContainerId(containerId: number, selected: any[]): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            users: SelectKeyValue[]
        }>(`${proxyPath}/users/loadUsersByContainerId.json`, {
            params: {
                angular: true,
                containerId: containerId,
                'selected[]': selected,
            }
        }).pipe(
            map(data => {
                return data.users;
            })
        );
    }

    public getIndex(params: UsersIndexParams): Observable<UsersIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<UsersIndexRoot>(`${proxyPath}/users/index.json`, {
            params: params as {} // cast UsersIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadUsergroups(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ usergroups: SelectKeyValue[] }>(`${proxyPath}/users/loadUsergroups.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.usergroups;
            })
        )
    }

    public loadUserContainerRoles(searchString: string = '', selected: number[] = []): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ usercontainerroles: SelectKeyValue[] }>(`${proxyPath}/users/loadContainerRoles.json`, {
            params: {
                angular: true,
                'filter[Usercontainerroles.name]': searchString,
                'selected[]': selected
            }
        }).pipe(
            map(data => {
                return data.usercontainerroles;
            })
        )
    }

    public loadContainersForAngular(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/users/loadContainersForAngular.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public loadContainerPermissions(usercontainerRoleIds: number[]): Observable<UserAddContainerRolePermission[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            userContainerRoleContainerPermissions: UserAddUserContainerRoleContainerPermissionsResponse,
            _csrfToken: string
        }>(`${proxyPath}/users/loadContainerPermissions.json`, {
            params: {
                angular: true,
                'usercontainerRoleIds[]': usercontainerRoleIds
            }
        }).pipe(
            map(data => {
                const containerRoles: UserAddContainerRolePermission[] = [];

                // Convert hashmap to array
                for (const index in data.userContainerRoleContainerPermissions) {
                    const cr = data.userContainerRoleContainerPermissions[index];
                    cr.user_roles_array = Object.values(cr.user_roles);
                    containerRoles.push(cr);
                }

                return containerRoles;

            })
        )
    }

    public loadLdapUserByString(samAccountName: string = ''): Observable<UsersLdapUser[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ ldapUsers: UsersLdapUser[] }>(`${proxyPath}/users/loadLdapUserByString.json`, {
            params: {
                angular: true,
                samaccountname: samAccountName
            }
        }).pipe(
            map(data => {
                return data.ldapUsers
            })
        )
    }

    public loadLdapUserDetails(samAccountName: string = ''): Observable<UsersLdapUserDetails> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ ldapUser: UsersLdapUserDetails }>(`${proxyPath}/users/loadLdapUserDetails.json`, {
            params: {
                angular: true,
                samaccountname: samAccountName
            }
        }).pipe(
            map(data => {
                const ldapUser = data.ldapUser
                ldapUser.userContainerRoleContainerPermissionsLdapArray = [];

                const containerRoles: UserAddContainerRolePermission[] = [];

                // Convert hashmap to array
                for (const index in ldapUser.userContainerRoleContainerPermissionsLdap) {
                    const cr = ldapUser.userContainerRoleContainerPermissionsLdap[index];
                    cr.user_roles_array = Object.values(cr.user_roles);
                    containerRoles.push(cr);
                }

                ldapUser.userContainerRoleContainerPermissionsLdapArray = containerRoles;

                return ldapUser;
            })
        )
    }

    public add(user: UserPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/add.json?angular=true`, {
            User: user
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

    public addLdap(user: UserPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/users/addFromLdap.json?angular=true`, {
            User: user
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

    public getUserEdit(id: number): Observable<UsersEditResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<UsersEditResponse>(`${proxyPath}/users/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
