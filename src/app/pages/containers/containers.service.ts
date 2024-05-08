import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { LoadContainersRoot } from './containers.interface';

@Injectable({
    providedIn: 'root',
})
export class ContainersService  {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/containers/loadContainers.json?angular=true`, {
            params: {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )

    }
}
