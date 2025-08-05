import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ServicechecksIndexParams, ServicechecksIndexRoot } from './servicechecks.interface';

@Injectable({
    providedIn: 'root'
})
export class ServicechecksService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**********************
     *    Index action    *
     **********************/
    public getServicechecksIndex(serviceId: number, params: ServicechecksIndexParams): Observable<ServicechecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicechecksIndexRoot>(`${proxyPath}/servicechecks/index/${serviceId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
