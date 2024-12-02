import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { LoadHostsByStringRoot, WizardsIndex } from './wizards.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class WizardsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(): Observable<WizardsIndex> {
        return this.http.get<WizardsIndex>(`${this.proxyPath}/wizards/index.json?angular=true`).pipe(
            map((data: WizardsIndex): WizardsIndex => {
                return data;
            })
        );
    }

    public loadHostsByString(search: string = ''): Observable<SelectKeyValue[]> {
        return this.http.get<LoadHostsByStringRoot>(`${this.proxyPath}/wizards/loadHostsByString.json?angular=true`,).pipe(
            map((data: LoadHostsByStringRoot): SelectKeyValue[] => {
                return data.hosts;
            })
        );
    }
}