import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MapsIndexParams, MapsIndexRoot } from './Maps.interface';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: MapsIndexParams): Observable<MapsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapsIndexRoot>(`${proxyPath}/map_module/maps/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
