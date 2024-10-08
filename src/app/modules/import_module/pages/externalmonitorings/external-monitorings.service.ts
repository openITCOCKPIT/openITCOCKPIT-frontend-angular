import { inject, Injectable } from '@angular/core';
import {
    ExternalMonitoringConfig,
    ExternalMonitoringPost,
    ExternalMonitoringsIndexParams,
    ExternalMonitoringsIndexRoot
} from './external-monitorings.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ExternalMonitoringsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: ExternalMonitoringsIndexParams): Observable<ExternalMonitoringsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExternalMonitoringsIndexRoot>(`${proxyPath}/import_module/external_monitorings/index.json`, {
            params: params as {} // cast ExternalMonitoringsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public createExternalMonitoring(externalMonitoring: ExternalMonitoringPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/external_monitorings/add.json?angular=true`, externalMonitoring)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.externalMonitoring as GenericIdResponse
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
        return this.http.post(`${proxyPath}/import_module/external_monitorings/delete/${item.id}.json?angular=true`, {});
    }

    public loadConfig(system_type: string) {
        const proxyPath = this.proxyPath;
        return this.http.post<ExternalMonitoringConfig>(`${proxyPath}/import_module/external_monitorings/loadConfigFieldsBySystemType/${system_type}.json?angular=true`, {});
    }
}
