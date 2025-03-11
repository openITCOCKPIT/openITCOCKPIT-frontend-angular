import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    EditSatellitePostRoot,
    EditSatelliteRoot,
    LoadHostsBySatelliteIds,
    SatelliteEntityCake2,
    SatelliteIndex,
    SatelliteIndexParams,
    SatellitesAddRoot,
    SatellitesLoadSatellitesByStringParams,
    SatellitesStatusParams,
    SatelliteStatusIndex,
    SatelliteSystemdowntimesParams,
    SatelliteTasksIndex,
    SatelliteTasksParams,
    SatelliteUsedBy,
    SystemdowntimeSatelliteIndexRoot
} from './satellites.interface';
import { SystemdowntimesPost } from '../../../../pages/systemdowntimes/systemdowntimes.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class SatellitesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getSatellitesIndex(params: SatelliteIndexParams): Observable<SatelliteIndex> {
        return this.http.get<SatelliteIndex>(`${this.proxyPath}/distribute_module/satellites/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: SatelliteIndex): SatelliteIndex => {
                return data;
            })
        );
    }


    public getTasksIndex(params: SatelliteTasksParams): Observable<SatelliteTasksIndex> {
        return this.http.get<SatelliteTasksIndex>(`${this.proxyPath}/distribute_module/satellites/tasks.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: SatelliteTasksIndex): SatelliteTasksIndex => {
                return data;
            })
        );
    }

    public getStatusIndex(params: SatellitesStatusParams): Observable<SatelliteStatusIndex> {
        return this.http.get<SatelliteStatusIndex>(`${this.proxyPath}/distribute_module/satellites/status.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: SatelliteStatusIndex): SatelliteStatusIndex => {
                return data;
            })
        );
    }

    public updateSatellite(satelliteId: number, satellite: EditSatellitePostRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/distribute_module/satellites/edit/${satelliteId}.json?angular=true`, satellite)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data.satellite as GenericIdResponse
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

    public getEdit(id: number): Observable<EditSatelliteRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<EditSatelliteRoot>(`${proxyPath}/distribute_module/satellites/edit/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            );
    }

    public addSatellite(satellite: SatellitesAddRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/distribute_module/satellites/add.json?angular=true`, satellite)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data.satellite as GenericIdResponse
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

    public loadSatellitesByString(params: SatellitesLoadSatellitesByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            all_satellites: SelectKeyValue[]
        }>(`${proxyPath}/distribute_module/satellites/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.all_satellites;
            })
        );
    }


    public loadAllContainers(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/distribute_module/satellites/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public createSatellitedowntime(satellitecontainerdowntime: SystemdowntimesPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/distribute_module/satellites/addSatelliteDowntime.json?angular=true`, {
            Systemdowntime: satellitecontainerdowntime
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

    public getSatelliteSystemdowntimes(params: SatelliteSystemdowntimesParams): Observable<SystemdowntimeSatelliteIndexRoot> {
        const proxyPath = this.proxyPath;

        return this.http.get<SystemdowntimeSatelliteIndexRoot>(`${proxyPath}/distribute_module/satellites/downtime.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getSatelliteById(id: number): Observable<SatelliteEntityCake2> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            satellite: SatelliteEntityCake2
        }>(`${proxyPath}/distribute_module/satellites/name.json`, {
            params: {
                angular: true,
                id: id
            }
        }).pipe(
            map(data => {
                return data.satellite;
            })
        )
    }

    public loadHostsBySatelliteId(satelliteIds: number[]): Observable<LoadHostsBySatelliteIds> {
        const proxyPath = this.proxyPath;

        return this.http.get<LoadHostsBySatelliteIds>(`${proxyPath}/distribute_module/satellites/loadHostsBySatelliteIds.json`, {
            params: {
                angular: true,
                'satelliteIds[]': satelliteIds
            }
        }).pipe(
            map((data: LoadHostsBySatelliteIds) => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/distribute_module/satellites/delete/${item.id}.json?angular=true`, {});
    }

    public usedBy(id: number): Observable<SatelliteUsedBy> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<SatelliteUsedBy>(`${proxyPath}/distribute_module/satellites/usedBy/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            )
    }
}
