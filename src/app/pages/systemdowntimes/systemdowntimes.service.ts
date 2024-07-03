import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { SystemdowntimesHostGet } from './systemdowntimes.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemdowntimesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadDefaults(): Observable<SystemdowntimesHostGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemdowntimesHostGet>(`${proxyPath}/angular/getDowntimeData.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }
}
