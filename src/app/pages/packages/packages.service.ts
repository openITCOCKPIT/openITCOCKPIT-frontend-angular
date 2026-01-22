import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    PackagesLinuxParams,
    PackagesLinuxRoot,
    PackagesTotalSummary,
    PackagesViewLinuxParams,
    PackagesViewLinuxRoot
} from './packages.interface';

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

    public getSummary(): Observable<PackagesTotalSummary> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ summary: PackagesTotalSummary }>(`${proxyPath}/packages/summary.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.summary;
            })
        )
    }

    public getViewLinux(id: number, params: PackagesViewLinuxParams): Observable<PackagesViewLinuxRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesViewLinuxRoot>(`${proxyPath}/packages/view_linux/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
