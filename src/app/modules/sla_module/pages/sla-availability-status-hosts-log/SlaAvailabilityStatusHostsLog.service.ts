import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    SlaAvailabilityStatusHostsLogIndexParams,
    SlaAvailabilityStatusHostsLogIndexRoot
} from './SlaAvailabilityStatusHostsLog.interface';

@Injectable({
    providedIn: 'root'
})
export class SlaAvailabilityStatusHostsLogService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(id: number, params: SlaAvailabilityStatusHostsLogIndexParams): Observable<SlaAvailabilityStatusHostsLogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlaAvailabilityStatusHostsLogIndexRoot>(`${proxyPath}/sla_module/sla_availability_status_hosts_log/index/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
