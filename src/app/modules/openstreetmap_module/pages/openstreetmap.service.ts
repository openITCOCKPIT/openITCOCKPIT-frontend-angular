import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import {
    OpenstreetmapIndexRoot,
    OpenstreetmapIndexParams,
    OpenstreetmapAclSettingsRoot
} from './openstreetmap.interface';

@Injectable({
    providedIn: 'root'
})
export class OpenstreetmapService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: OpenstreetmapIndexParams): Observable<OpenstreetmapIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OpenstreetmapIndexRoot>(`${proxyPath}/openstreetmap_module/openstreetmap/index.json`, {
            params: params as {} // cast EventcorrelationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getAclAndSettings(): Observable<OpenstreetmapAclSettingsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OpenstreetmapAclSettingsRoot>(`${proxyPath}/openstreetmap_module/openstreetmap/getAclAndSettings.json`, {
            params:  {angular: true} // cast EventcorrelationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
