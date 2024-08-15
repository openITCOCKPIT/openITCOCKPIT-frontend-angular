import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { PacketmanagerIndexRoot } from './packetmanager.interface';

@Injectable({
    providedIn: 'root'
})
export class PacketmanagerService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(): Observable<PacketmanagerIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PacketmanagerIndexRoot>(`${proxyPath}/packetmanager/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

}
