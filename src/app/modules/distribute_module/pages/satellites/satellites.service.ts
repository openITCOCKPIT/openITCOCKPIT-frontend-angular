import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    SatellitesLoadSatellitesByStringParams,
    SatelliteSystemdowntimesParams,
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

    constructor() {
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
}
