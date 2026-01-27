import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    PackagesLinuxParams,
    PackagesLinuxRoot,
    PackagesMacosAppParams,
    PackagesMacosAppsParams,
    PackagesMacosAppsRoot,
    PackagesTotalSummary,
    PackagesViewLinuxParams,
    PackagesViewLinuxRoot,
    PackagesViewMacosAppRoot,
    PackagesViewWindowAppRoot,
    PackagesViewWindowsUpdateParams,
    PackagesViewWindowsUpdateRoot,
    PackagesWindowsAppParams,
    PackagesWindowsAppsParams,
    PackagesWindowsAppsRoot,
    PackagesWindowsUpdatesParams,
    PackagesWindowsUpdatesRoot
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

    public getWindowsApps(params: PackagesWindowsAppsParams): Observable<PackagesWindowsAppsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesWindowsAppsRoot>(`${proxyPath}/packages/windows.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getViewWindowsApp(id: number, params: PackagesWindowsAppParams): Observable<PackagesViewWindowAppRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesViewWindowAppRoot>(`${proxyPath}/packages/view_windows/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getMacosApps(params: PackagesMacosAppsParams): Observable<PackagesMacosAppsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesMacosAppsRoot>(`${proxyPath}/packages/macos.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getViewMacosApp(id: number, params: PackagesMacosAppParams): Observable<PackagesViewMacosAppRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesViewMacosAppRoot>(`${proxyPath}/packages/view_macos/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getWindowsUpdates(params: PackagesWindowsUpdatesParams): Observable<PackagesWindowsUpdatesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesWindowsUpdatesRoot>(`${proxyPath}/packages/windows_updates.json`, {
            params: params as {} // cast PackagesLinuxParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getViewWindowsUpdate(id: number, params: PackagesViewWindowsUpdateParams): Observable<PackagesViewWindowsUpdateRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PackagesViewWindowsUpdateRoot>(`${proxyPath}/packages/view_windows_update/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
