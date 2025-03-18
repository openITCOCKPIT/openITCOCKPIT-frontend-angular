import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExportSocketClientService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getSocketConfig() {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/angular/websocket_configuration.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true,
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
