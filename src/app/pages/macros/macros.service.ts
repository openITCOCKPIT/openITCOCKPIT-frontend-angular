import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MacroIndex, MacroIndexRoot } from './macros.interface';

@Injectable({
    providedIn: 'root'
})
export class MacrosService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(): Observable<MacroIndex[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<MacroIndexRoot>(`${proxyPath}/macros/index.json`, {
            params: {
                angular: 'true',
            }
        }).pipe(
            map(data => {
                return data.all_macros;
            })
        )
    }
}
