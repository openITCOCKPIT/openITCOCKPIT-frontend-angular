import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { LicenseResponseRoot, RegistersRoot } from './registers.interface';

@Injectable({
    providedIn: 'root'
})
export class RegistersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getLicense(): Observable<RegistersRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<RegistersRoot>(`${proxyPath}/registers/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveLicense(license: string): Observable<LicenseResponseRoot> {
        const proxyPath = this.proxyPath;
        return this.http.post<LicenseResponseRoot>(`${proxyPath}/registers/index.json?angular=true`, {
            Registers: {
                license: license
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
