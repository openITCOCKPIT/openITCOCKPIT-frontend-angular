import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    BrowserSoftwareLinuxHostRoot,
    BrowserSoftwareLinuxParams,
    BrowserSoftwareWindowsAppHostRoot,
    BrowserSoftwareWindowsAppParams,
    BrowserSoftwareWindowsUpdateHostRoot,
    BrowserSoftwareWindowsUpdateParams
} from './browser-software.interface';

@Injectable({
    providedIn: 'root',
})
export class BrowserSoftwareService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getPackagesLinux(hostId: number, params: BrowserSoftwareLinuxParams): Observable<BrowserSoftwareLinuxHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<BrowserSoftwareLinuxHostRoot>(`${proxyPath}/packages/host_linux_packages/${hostId}.json`, {
            params: params as {} // cast into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getWindowsUpdates(hostId: number, params: BrowserSoftwareWindowsUpdateParams): Observable<BrowserSoftwareWindowsUpdateHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<BrowserSoftwareWindowsUpdateHostRoot>(`${proxyPath}/packages/host_windows_updates/${hostId}.json`, {
            params: params as {} // cast into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getWindowsApps(hostId: number, params: BrowserSoftwareWindowsAppParams): Observable<BrowserSoftwareWindowsAppHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<BrowserSoftwareWindowsAppHostRoot>(`${proxyPath}/packages/host_windows_apps/${hostId}.json`, {
            params: params as {} // cast into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
