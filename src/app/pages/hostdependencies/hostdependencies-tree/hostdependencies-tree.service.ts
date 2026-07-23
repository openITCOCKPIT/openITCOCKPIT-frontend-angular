import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { HostdependenciesTree } from './hostdependencies-tree.interface';

@Injectable({
    providedIn: 'root',
})
export class HostdependenciesTreeService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public loadDependencyTree(hostId: number): Observable<HostdependenciesTree> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostdependenciesTree>(`${proxyPath}/hostdependencies/dependencyTree/${hostId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
