import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { DOCUMENT } from '@angular/common';
import { map, Observable } from 'rxjs';

export interface HeaderInfo {
    exportRunningHeaderInfo: boolean,
    hasSubscription: boolean,
    isCommunityEdition: boolean,
    newVersionAvailable: boolean
    //  _csrfToken: string
}

@Injectable({
    providedIn: 'root'
})
export class HeaderInfoService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getInfo(): Observable<HeaderInfo> {
        const proxyPath = this.proxyPath;
        return this.http.get<HeaderInfo>(`${proxyPath}/angular/getAppHeaderInfo.json`, {
            params: {
                disableGlobalLoader: true
            }
        }).pipe(
            map(HeaderInfo => {
                return HeaderInfo;
            })
        )
    }

}
