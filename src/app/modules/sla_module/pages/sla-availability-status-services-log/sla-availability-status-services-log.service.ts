import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { SlaAvailabilityStatusLogIndexParams } from '../slas/slas.interface';
import { SlaAvailabilityStatusServicesLogIndexRoot } from './sla-availability-status-services-log.interface';

@Injectable({
    providedIn: 'root'
})
export class SlaAvailabilityStatusServicesLogService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(id: number, params: SlaAvailabilityStatusLogIndexParams): Observable<SlaAvailabilityStatusServicesLogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SlaAvailabilityStatusServicesLogIndexRoot>(`${proxyPath}/sla_module/sla_availability_status_services_log/index/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
