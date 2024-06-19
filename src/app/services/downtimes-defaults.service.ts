import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import {catchError, map, Observable, of} from 'rxjs';
import {GenericIdResponse, GenericValidationError} from '../generic-responses';

export interface DowntimesDefaultsConfiguration {
    js_from: string
    js_to: string
    from_date: string
    from_time: string
    to_date: string
    to_time: string
    duration: number
    comment: string
}

export interface ValidateTimes {
    from_date: string
    from_time: string
    to_date: string
    to_time: string
}

@Injectable({
    providedIn: 'root'
})
export class DowntimesDefaultsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getDowntimesDefaultsConfiguration(): Observable<DowntimesDefaultsConfiguration> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ defaultValues: DowntimesDefaultsConfiguration }>(`${proxyPath}/angular/getDowntimeData.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.defaultValues;
            })
        );
    }

    public validateDowntimesInput(params: ValidateTimes): Observable<any>{
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/downtimes/validateDowntimeInputFromAngular.json?angular=true`, params).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data as GenericIdResponse
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
