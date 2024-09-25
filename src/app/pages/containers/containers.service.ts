import { inject, Injectable } from '@angular/core';
import { ContainersIndexNested, ContainersLoadContainersByStringParams } from './containers.interface';
import { map, Observable } from 'rxjs';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class ContainersService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public loadContainersByString(params: ContainersLoadContainersByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.containers;
            })
        );
    }


    /**********************
     *    Index action    *
     **********************/
    public loadAllContainers(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/containers/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public loadContainersByContainerId(id: number): Observable<ContainersIndexNested[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            nest: ContainersIndexNested[]
        }>(`${proxyPath}/containers/loadContainersByContainerId/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.nest;
            })
        )
    }
}
