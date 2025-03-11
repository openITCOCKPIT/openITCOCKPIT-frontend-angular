import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    DashboardAllocationElements,
    DashboardAllocationsIndex,
    DashboardTabAllocationGet,
    DashboardTabAllocationPost,
    TabAllocationsIndexParams
} from './dashboard-allocations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class DashboardAllocationsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: TabAllocationsIndexParams): Observable<DashboardAllocationsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<DashboardAllocationsIndex>(`${proxyPath}/DashboardAllocations/index.json`, {
            params: params as {} // cast TabAllocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *    Add action    *
     **********************/
    public createDashboardTabAllocation(allocation: DashboardTabAllocationPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/DashboardAllocations/add.json?angular=true`, {
            DashboardAllocation: allocation
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.allocation as GenericIdResponse
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

    public getEdit(id: number): Observable<DashboardTabAllocationGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            allocation: {
                DashboardAllocation: DashboardTabAllocationPost
            }
        }>(`${proxyPath}/DashboardAllocations/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Edit action    *
     **********************/
    public edit(allocation: DashboardTabAllocationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/DashboardAllocations/edit/${allocation.id}.json?angular=true`, {
            DashboardAllocation: allocation
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.allocation as GenericIdResponse
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
        return this.http.post(`${proxyPath}/DashboardAllocations/delete/${item.id}.json?angular=true`, {});
    }

    public loadElements(containerId: number): Observable<DashboardAllocationElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<DashboardAllocationElements>(`${proxyPath}/DashboardAllocations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }
}
