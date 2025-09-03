import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { StatuspagegroupPost, StatuspagegroupsIndex, StatuspagegroupsIndexParams } from './statuspagegroups.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class StatuspagegroupsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getStatuspagegroups(params: StatuspagegroupsIndexParams): Observable<StatuspagegroupsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuspagegroupsIndex>(`${proxyPath}/statuspagegroups/index.json`, {
            params: params as {} // cast StatuspagegroupsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public add(statuspagegroup: StatuspagegroupPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/add.json`, statuspagegroup)
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

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/statuspagegroups/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        )
    }

    public getStatuspagegroupEdit(id: number): Observable<StatuspagegroupPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            statuspagegroup: StatuspagegroupPost
        }>(`${proxyPath}/statuspagegroups/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.statuspagegroup;
            })
        );
    }

    public saveStatuspagegroupEdit(statuspagegroup: StatuspagegroupPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/edit/${statuspagegroup.id}.json`, statuspagegroup)
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

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/statuspagegroups/delete/${item.id}.json?angular=true`, {});
    }
}
