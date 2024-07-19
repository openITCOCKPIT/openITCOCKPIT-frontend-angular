import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { StatehistoriesHostRoot, StatehistoriesServiceRoot, StatehistoryHostParams } from './statehistories.interface';

@Injectable({
    providedIn: 'root'
})
export class StatehistoryService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**********************
     *    Host action    *
     **********************/
    public getStatehistoryHost(hostId: number, params: StatehistoryHostParams): Observable<StatehistoriesHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatehistoriesHostRoot>(`${proxyPath}/statehistories/host/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *   Service action   *
     **********************/
    public getStatehistoryService(serviceId: number, params: StatehistoryHostParams): Observable<StatehistoriesServiceRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatehistoriesServiceRoot>(`${proxyPath}/statehistories/service/${serviceId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
