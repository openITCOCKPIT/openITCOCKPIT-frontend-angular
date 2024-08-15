import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SystemHealthUser, SystemHealthUsersIndex, SystemHealthUsersIndexParams } from './systemhealthusers.interface';

@Injectable({
    providedIn: 'root',
})
export class SystemHealthUsersService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);


    public getIndex(params: SystemHealthUsersIndexParams): Observable<SystemHealthUser[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<SystemHealthUsersIndex>(`${proxyPath}/servicetemplategroups/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: SystemHealthUsersIndex) => {
                return data.all_users;
            })
        )
    }
}
