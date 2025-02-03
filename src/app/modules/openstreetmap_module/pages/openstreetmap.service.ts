import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import {
    OpenstreetmapIndexRoot,
    OpenstreetmapIndexParams,
    OpenstreetmapAclSettingsRoot,
    OpenstreetmapSettings,
    OpenstreetmapRequestSettings,
    OpenstreetmapSettingsFilter,
    OpenstreetmapSettingsPostResponse
} from './openstreetmap.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';

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
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getAclAndSettings(): Observable<OpenstreetmapAclSettingsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OpenstreetmapAclSettingsRoot>(`${proxyPath}/openstreetmap_module/openstreetmap/getAclAndSettings.json`, {
            params:  {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getSettings(): Observable<OpenstreetmapRequestSettings> {
        const proxyPath = this.proxyPath;
        return this.http.get<OpenstreetmapRequestSettings>(`${proxyPath}/openstreetmap_module/openstreetmap_settings/index.json`, {
            params:  {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public setOpenstreetmapSettings(post: OpenstreetmapSettingsFilter): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<OpenstreetmapSettingsPostResponse>(`${proxyPath}/openstreetmap_module/openstreetmap_settings/index.json?angular=true`,
            post
        ).pipe(
            map((data: OpenstreetmapSettingsPostResponse) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
                };
            }),
            catchError((error: any) => {
                const err = error.error.error as GenericValidationError;
                return of({
                    success: false,
                    data: err
                });
            })
        );
    }

}
