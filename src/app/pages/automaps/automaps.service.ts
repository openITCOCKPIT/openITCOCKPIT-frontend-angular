import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { AutomapsIndexParams, AutomapsIndexRoot } from './automaps.interface';

@Injectable({
    providedIn: 'root'
})
export class AutomapsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: AutomapsIndexParams): Observable<AutomapsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutomapsIndexRoot>(`${proxyPath}/automaps/index.json`, {
            params: params as {} // cast AutomapsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
