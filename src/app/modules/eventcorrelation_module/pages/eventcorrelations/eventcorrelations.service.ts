import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    EventcorrelationsIndexParams,
    EventcorrelationsIndexRoot,
    EventcorrelationsViewRoot
} from './eventcorrelations.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

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

    public getIndex(params: EventcorrelationsIndexParams): Observable<EventcorrelationsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<EventcorrelationsIndexRoot>(`${proxyPath}/eventcorrelation_module/eventcorrelations/index.json`, {
            params: params as {} // cast EventcorrelationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/eventcorrelation_module/eventcorrelations/delete/${item.id}.json`, {});
    }
}
