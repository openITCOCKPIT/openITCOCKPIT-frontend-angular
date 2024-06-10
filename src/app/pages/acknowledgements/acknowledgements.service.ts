import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { AcknowledgementObject } from './acknowledgement.interface';

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
                angular: true
            }
        }).pipe(
            map(data => {
                return data.acknowledgement
            })
        )
    }
}
