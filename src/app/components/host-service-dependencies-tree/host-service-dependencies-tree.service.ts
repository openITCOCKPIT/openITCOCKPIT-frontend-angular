import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    HostServiceDependenciesTreeGet,
    HostServiceDependenciesTreeItem
} from './host-service-dependencies-tree.interface';


@Injectable({
    providedIn: 'root'
})
export class HostServiceDependenciesTreeService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getHostDependencyTree(id: number): Observable<HostServiceDependenciesTreeItem[]> {
        const proxyPath = this.proxyPath;
        // ITC-2599 Change load function to use POST
        return this.http.get<HostServiceDependenciesTreeGet>(`${proxyPath}/hostdependencies/loadHostdependenciesTree/${id}.json?angular=true`).pipe(
            map((data: HostServiceDependenciesTreeGet) => {
                return data.hostdependenciesTree;
            })
        );
    }

}
