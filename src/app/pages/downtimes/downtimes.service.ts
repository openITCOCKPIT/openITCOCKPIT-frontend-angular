import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DowntimeHostIndexRoot, DowntimeObject, HostDowntimesParams } from './downtimes.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class DowntimesService {


    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getDowntimeTooltipDetails(objectId: number, type: 'hosts' | 'services'): Observable<DowntimeObject> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            downtime: DowntimeObject
        }>(`${proxyPath}/${type}/browser/${objectId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.downtime
            })
        )
    }

    public getHostDowntimes(params: HostDowntimesParams): Observable<DowntimeHostIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<DowntimeHostIndexRoot>(`${proxyPath}/downtimes/host.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    // Generic function for the Delete All Modal
    public deleteHostdowntime(item: DeleteAllItem, includeServices: boolean): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/downtimes/delete/${item.id}.json?angular=true`, {
            includeServices: includeServices,
            type: 'host'
        });
    }
}
