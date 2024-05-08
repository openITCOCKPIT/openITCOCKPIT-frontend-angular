import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    UserDateformatsRoot,
    UserLocaleOption,
    LoadUsersByContainerIdPost,
    LoadUsersByContainerIdRoot
} from './users.interface';


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

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
        )
    }

    public getDateformats(): Observable<UserDateformatsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<UserDateformatsRoot>(`${proxyPath}/users/loadDateformats.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadUsersByContainerId(params: LoadUsersByContainerIdPost): Observable<LoadUsersByContainerIdRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadUsersByContainerIdRoot>(`${proxyPath}/users/loadUsersByContainerId.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )

    }
}
