import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { PackagesLinuxParams, PackagesLinuxRoot, PackagesLinuxSummary } from './packages.interface';

@Injectable({
    providedIn: 'root'
})
export class PackagesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getPackages(params: PackagesLinuxParams): Observable<PackagesLinuxRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesLinuxRoot>(`${proxyPath}/packages/linux.json`, {
            params: params as {} // cast PackagesLinuxParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getSummary(): Observable<PackagesLinuxSummary> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesLinuxSummary>(`${proxyPath}/packages/summary.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
