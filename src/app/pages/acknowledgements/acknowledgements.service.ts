import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    AcknowledgementObject,
    AcknowledgementsHostParams,
    AcknowledgementsHostRoot,
    AcknowledgementsServiceParams,
    AcknowledgementsServiceRoot
} from './acknowledgement.interface';

@Injectable({
    providedIn: 'root'
})
export class AcknowledgementsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getAcknowledgementTooltipDetails(objectId: number, type: 'hosts' | 'services'): Observable<AcknowledgementObject> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            acknowledgement: AcknowledgementObject
        }>(`${proxyPath}/${type}/browser/${objectId}.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true
            }
        }).pipe(
            map(data => {
                return data.acknowledgement
            })
        )
    }

    /**********************
     *    Host action    *
     **********************/
    public getAcknowledgementsHost(hostId: number, params: AcknowledgementsHostParams): Observable<AcknowledgementsHostRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AcknowledgementsHostRoot>(`${proxyPath}/acknowledgements/host/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *   Service action   *
     **********************/
    public getAcknowledgementsService(serviceId: number, params: AcknowledgementsServiceParams): Observable<AcknowledgementsServiceRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AcknowledgementsServiceRoot>(`${proxyPath}/acknowledgements/service/${serviceId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
