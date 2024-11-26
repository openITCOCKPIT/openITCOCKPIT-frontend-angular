import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    EventcorrelationsIndexParams,
    EventcorrelationsIndexRoot,
    EventcorrelationsViewRoot
} from './eventcorrelations.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { HostAddEditSuccessResponse, HostPost } from '../../../../pages/hosts/hosts.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

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

    /**********************
     *    Add action      *
     **********************/
    public add(host: HostPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        let body: any = {
            Host: host
        };

        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelations/add.json?angular=true`, body)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as HostAddEditSuccessResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

}
