import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { DashboardTab, DashboardTabAllocation } from '../../dashboards.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DashboardAllocateContainerResponse } from './dashboard-allocate-modal.interface';
import { ContainersLoadContainersByStringParams } from '../../../containers/containers.interface';
import { LoadContainersResponse } from '../../../users/users.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class DashboardAllocateModalService {

    private readonly event$$ = new Subject<DashboardTab>();
    public readonly event$ = this.event$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**
     * Call this method to open the allocation modal
     * @param tab The tab to open the allocation modal for
     */
    toggleAllocateModal(tab: DashboardTab): void {
        this.event$$.next(tab);
    }


    public loadElementsByContainerId(containerId: number): Observable<DashboardAllocateContainerResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<DashboardAllocateContainerResponse>(`${proxyPath}/DashboardAllocations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainersByString(params: ContainersLoadContainersByStringParams): Observable<LoadContainersResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<LoadContainersResponse>(`${proxyPath}/users/loadContainersForAngular.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadContainersResponse) => {
                return data;
            })
        );
    }

    public deleteDashboardAllocation(tabId: number): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/DashboardAllocations/delete/${tabId}.json`, {});
    }

    public addDashboardAllocation(data: DashboardTabAllocation): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/DashboardAllocations/add.json?angular=true`, {
            DashboardAllocation: data
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

    public editDashboardAllocation(data: DashboardTabAllocation): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/DashboardAllocations/edit/${data.id}.json?angular=true`, {
            DashboardAllocation: data
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
