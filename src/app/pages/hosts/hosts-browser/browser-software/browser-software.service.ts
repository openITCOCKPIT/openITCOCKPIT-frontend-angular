import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { BrowserSoftwareLinuxHostRoot, BrowserSoftwareLinuxParams } from './browser-software.interface';

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
}
