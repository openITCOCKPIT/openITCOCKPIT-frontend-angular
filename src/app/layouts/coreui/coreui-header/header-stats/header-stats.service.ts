import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';

import { map, Observable } from 'rxjs';

export interface MenuStatsRoot {
    hoststatusCount: {
        [key: number]: number,
    },
    servicestatusCount: {
        [key: number]: number,
    },
    showstatsinmenu: boolean
}

@Injectable({
    providedIn: 'root'
})
export class HeaderStatsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getMenustats(): Observable<MenuStatsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MenuStatsRoot>(`${proxyPath}/angular/menustats.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
