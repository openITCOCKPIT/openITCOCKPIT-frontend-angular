import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { LoadHostsByStringRoot, WizardGet, WizardPost, WizardsIndex } from './wizards.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericResponseWrapper } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export abstract class WizardsService {

    protected readonly http: HttpClient = inject(HttpClient);
    protected readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(): Observable<WizardsIndex> {
        return this.http.get<WizardsIndex>(`${this.proxyPath}/wizards/index.json?angular=true`).pipe(
            map((data: WizardsIndex): WizardsIndex => {
                return data;
            })
        );
    }

    public loadHostsByString(search: string = ''): Observable<SelectKeyValue[]> {
        return this.http.get<LoadHostsByStringRoot>(`${this.proxyPath}/wizards/loadHostsByString.json?angular=true`).pipe(
            map((data: LoadHostsByStringRoot): SelectKeyValue[] => {
                return data.hosts;
            })
        );
    }

    abstract fetch(hostId: number): Observable<WizardGet>;

    abstract submit(post: WizardPost): Observable<GenericResponseWrapper>;
}