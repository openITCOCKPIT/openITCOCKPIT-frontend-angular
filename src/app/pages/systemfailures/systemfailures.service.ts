import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
    SystemfailureIndexParams,
    SystemfailureIndexRoot,
    SystemfailuresGet,
    SystemfailuresPost
} from './systemfailures.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SystemdowntimesGet, SystemdowntimesPost } from '../systemdowntimes/systemdowntimes.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class SystemfailuresService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: SystemfailureIndexParams): Observable<SystemfailureIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemfailureIndexRoot>(`${proxyPath}/systemfailures/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadDefaults(): Observable<SystemfailuresGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<SystemfailuresGet>(`${proxyPath}/angular/getDowntimeData.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/systemfailures/delete/${item.id}.json?angular=true`, {});
    }

    public createSystemfailure(systemfailure: SystemfailuresPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemdowntimes/addHostdowntime.json?angular=true`, {
            Systemfailures: systemfailure
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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
