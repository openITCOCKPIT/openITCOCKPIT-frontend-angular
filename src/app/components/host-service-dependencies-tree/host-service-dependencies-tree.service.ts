import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    HostDependenciesTreeGet,
    HostServiceDependenciesTreeItem,
    ServiceDependenciesTreeGet
} from './host-service-dependencies-tree.interface';


@Injectable({
    providedIn: 'root'
})
export class HostServiceDependenciesTreeService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getHostDependencyTree(id: number): Observable<HostServiceDependenciesTreeItem[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostDependenciesTreeGet>(`${proxyPath}/hostdependencies/loadHostdependenciesTree/${id}.json?angular=true`).pipe(
            map((data: HostDependenciesTreeGet) => {
                return data.hostdependenciesTree;
            })
        );
    }

    public getServiceDependencyTree(id: number): Observable<HostServiceDependenciesTreeItem[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceDependenciesTreeGet>(`${proxyPath}/servicedependencies/loadServicedependenciesTree/${id}.json?angular=true`).pipe(
            map((data: ServiceDependenciesTreeGet) => {
                return data.servicedependenciesTree;
            })
        );
    }

}
