import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProfileApiRoot } from './profile.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getProfile(): Observable<ProfileApiRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProfileApiRoot>(`${proxyPath}/profile/edit.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
