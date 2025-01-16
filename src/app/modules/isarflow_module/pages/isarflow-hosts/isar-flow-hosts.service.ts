import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    IsarFlowHostInformationResponse,
    IsarflowHostsIndexParams,
    IsarflowHostsIndexRoot
} from './isarflow-hosts.interface';

@Injectable({
    providedIn: 'root'
})
export class IsarFlowHostsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: IsarflowHostsIndexParams): Observable<IsarflowHostsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<IsarflowHostsIndexRoot>(`${proxyPath}/isarflow_module/isarflow_hosts/index.json`, {
            params: params as {} // cast IsarflowHostsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getIsarFlowHostInformation(hostId: number) {
        const proxyPath = this.proxyPath;
        return this.http.get<IsarFlowHostInformationResponse>(`${proxyPath}/isarflow_module/isarflow_hosts/isarFlowHostInformation/${hostId}.json`, {
            params: {
                angular: 'true'
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
