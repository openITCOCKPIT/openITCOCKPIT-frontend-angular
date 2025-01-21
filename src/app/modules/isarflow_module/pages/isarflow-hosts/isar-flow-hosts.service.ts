import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    IsarFlowHostInformationResponse,
    IsarflowHostsIndexParams,
    IsarflowHostsIndexRoot,
    IsarFlowInterfaceInformationResponse
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

    public getIsarFlowHostInformation(hostId: number): Observable<IsarFlowHostInformationResponse> {
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

    public loadInterfaceInformation(interfaceId: number, duration: number): Observable<IsarFlowInterfaceInformationResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<IsarFlowInterfaceInformationResponse>(`${proxyPath}/isarflow_module/isarflow_hosts/loadInterfaceInformation/${interfaceId}.json`, {
            params: {
                angular: 'true',
                duration: duration.toString()
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
