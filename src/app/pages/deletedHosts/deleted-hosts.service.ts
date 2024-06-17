import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DeletedHostsIndexParams, DeletedHostsIndexRoot } from './deleted-hosts.interface';

@Injectable({
    providedIn: 'root'
})
export class DeletedHostsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: DeletedHostsIndexParams): Observable<DeletedHostsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<DeletedHostsIndexRoot>(`${proxyPath}/deletedHosts/index.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}

