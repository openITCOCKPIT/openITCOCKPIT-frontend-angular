import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DowntimeHostIndexRoot, DowntimeObject, HostDowntimesParams } from './downtimes.interface';
import { CancelAllItem } from './cancel-hostdowntime-modal/cancel-hostdowntime.interface';

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

        let tempParams = JSON.parse(JSON.stringify(params));
        let wasCancelled: boolean | string = tempParams['filter[DowntimeHosts.was_cancelled]'];
        let wasNotCancelled: boolean | string = tempParams['filter[DowntimeHosts.was_not_cancelled]'];

        delete tempParams['filter[DowntimeHosts.was_cancelled]'];
        delete tempParams['filter[DowntimeHosts.was_not_cancelled]'];

        if (wasCancelled && !wasNotCancelled) {
            tempParams['filter[DowntimeHosts.was_cancelled]'] = true;
        } else if (!wasCancelled && wasNotCancelled) {
            tempParams['filter[DowntimeHosts.was_cancelled]'] = false;
        }

        return this.http.get<DowntimeHostIndexRoot>(`${proxyPath}/downtimes/host.json`, {
            params: tempParams as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    // Generic function for the Delete All Modal
    public deleteHostdowntime(item: CancelAllItem, includeServices: boolean): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/downtimes/delete/${item.id}.json?angular=true`, {
            includeServices: includeServices,
            type: 'host'
        });
    }
}
