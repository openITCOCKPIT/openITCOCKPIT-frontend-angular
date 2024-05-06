import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { LoadUsersByContainerIdPost, LoadUsersByContainerIdRoot } from './users.interface';

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

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
