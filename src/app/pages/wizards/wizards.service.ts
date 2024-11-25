import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { UsersIndexParams, UsersIndexRoot } from '../users/users.interface';
import { map, Observable } from 'rxjs';
import { WizardsIndex } from './wizards.interface';

@Injectable({
    providedIn: 'root'
})
export class WizardsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(): Observable<WizardsIndex> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<WizardsIndex>(`${proxyPath}/wizards/index.json?angular=true`).pipe(
            map((data: WizardsIndex): WizardsIndex => {
                return data;
            })
        );
    }
}