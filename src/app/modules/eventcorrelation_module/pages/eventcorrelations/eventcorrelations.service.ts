import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    EvcHostUsedBy,
    HostUsedByEVC,
    ServiceUsedByEVC,
    EvcModalService,
    EvcServiceSelect,
    EvcTree,
    EventcorrelationsEditCorrelationRoot,
    EventcorrelationsIndexParams,
    EventcorrelationsIndexRoot,
    EventcorrelationsViewRoot
} from './eventcorrelations.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { HostAddEditSuccessResponse, HostPost } from '../../../../pages/hosts/hosts.interface';
import { GenericResponseWrapper, GenericSuccessResponse, GenericValidationError } from '../../../../generic-responses';

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

    /**********************
     *  Usedby action     *
     **********************/
    public usedBy(id: number): Observable<EvcHostUsedBy> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            usedBy:
                EvcHostUsedBy
        }>(`${proxyPath}/eventcorrelation_module/eventcorrelations/usedBy/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.usedBy;
            })
        )
    }

    public hostUsedBy(id: number): Observable<HostUsedByEVC> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostUsedByEVC>(`${proxyPath}/eventcorrelation_module/eventcorrelations/hostUsedBy/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public serviceUsedBy(id: number): Observable<ServiceUsedByEVC> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceUsedByEVC>(`${proxyPath}/eventcorrelation_module/eventcorrelations/serviceUsedBy/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /*******************************
     *  editCorrelation action     *
     *******************************/
    public getEventcorrelationEditCorrelation(id: number): Observable<EventcorrelationsEditCorrelationRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<EventcorrelationsEditCorrelationRoot>(`${proxyPath}/eventcorrelation_module/eventcorrelations/editCorrelation/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public loadServices(searchString: string, evcId: number, selected: (number | string)[] = []): Observable<EvcServiceSelect[]> {
        const proxyPath = this.proxyPath;

        // ITC-2712 Change load function to use POST
        const data = {
            filter: {
                servicename: searchString
            },
            selected: selected,
            notServiceId: evcId
        }

        return this.http.post<{
            services: EvcServiceSelect[]
        }>(`${proxyPath}/eventcorrelation_module/eventcorrelations/loadServicesByString.json`, data, {
            params: {
                angular: true
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return data.services
                })
            );
    }

    public validateModalAddVServices(vService: EvcModalService): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelations/validateModalAddVServices.json?angular=true`, vService);
    }

    public validateModalEditVServices(vService: EvcModalService): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelations/validateModalEditVServices.json?angular=true`, vService);
    }

    public saveCorrelation(evcId: number, evcTree: EvcTree[]): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/eventcorrelation_module/eventcorrelations/editCorrelation/${evcId}.json?angular=true`, {
            evcTree: evcTree,
            evcId: evcId
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericSuccessResponse
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
