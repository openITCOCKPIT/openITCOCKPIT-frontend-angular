import { inject, Injectable } from '@angular/core';
import { ContainersLoadContainersByStringParams } from '../../../../pages/containers/containers.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { SatellitesLoadSatellitesByStringParams } from './satellites.interface';
import { SystemdowntimesPost } from '../../../../pages/systemdowntimes/systemdowntimes.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
  providedIn: 'root'
})
export class SatellitesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

  constructor() { }


    public loadSatellitesByString(params: SatellitesLoadSatellitesByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            satellites: SelectKeyValue[]
        }>(`${proxyPath}/distribute_module/satellites/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.satellites;
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
}
