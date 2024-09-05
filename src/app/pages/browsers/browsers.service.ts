import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { BrowsersIndexResponse, StatuscountResponse } from './browsers.interface';
import { ROOT_CONTAINER } from '../changelogs/object-types.enum';

@Injectable({
    providedIn: 'root'
})
export class BrowsersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(containerId: number = ROOT_CONTAINER): Observable<BrowsersIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<BrowsersIndexResponse>(`${proxyPath}/browsers/index/${containerId}.json`).pipe(
            map(data => {
                return data
            })
        );
    }

    public getStatusCountsByContainer(containerIds: number[], recursive: boolean = false): Observable<StatuscountResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuscountResponse>(`${proxyPath}/angular/statuscount.json`, {
            params: {
                angular: true,
                'containerIds[]': containerIds,
                recursive: recursive
            }
        }).pipe(
            map(data => {
                return data
            })
        );
    }

}
