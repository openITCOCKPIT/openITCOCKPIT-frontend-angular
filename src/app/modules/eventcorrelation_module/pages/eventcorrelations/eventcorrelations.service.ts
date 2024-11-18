import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { EventcorrelationsViewRoot } from './eventcorrelations.interface';

@Injectable({
    providedIn: 'root'
})
export class EventcorrelationsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getEventcorrelationView(id: number): Observable<EventcorrelationsViewRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<EventcorrelationsViewRoot>(`${proxyPath}/eventcorrelation_module/eventcorrelations/view/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
