import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    SatelliteEntityCake2,
    SatelliteIndex,
    SatelliteIndexParams,
    SatellitesLoadSatellitesByStringParams,
    SatellitesStatusParams,
    SatelliteStatusIndex,
    SatelliteSystemdowntimesParams,
    SatelliteTasksIndex,
    SatelliteTasksParams,
    SystemdowntimeSatelliteIndexRoot
} from './satellites.interface';
import { SystemdowntimesPost } from '../../../../pages/systemdowntimes/systemdowntimes.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

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
}
