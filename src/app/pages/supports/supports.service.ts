import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupportsService {


    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getHasLicense(): Observable<boolean> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ hasLicense: boolean }>(`${proxyPath}/supports/issue.json`).pipe(
            map(data => {
                return data.hasLicense;
            })
        )
    }
}
