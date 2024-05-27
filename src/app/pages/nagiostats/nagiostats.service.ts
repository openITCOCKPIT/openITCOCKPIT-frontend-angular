import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { Nagiostats, NagiostatsRoot } from './nagiostats.interface';

@Injectable({
    providedIn: 'root'
})
export class NagiostatsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(): Observable<Nagiostats> {
        const proxyPath = this.proxyPath;
        return this.http.get<NagiostatsRoot>(`${proxyPath}/nagiostats/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.stats
            })
        );
    }
}
