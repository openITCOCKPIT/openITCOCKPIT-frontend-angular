import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    HostDefaultsElements,
    HostDefaultsIndexParams,
    HostDefaultsIndexRoot,
    HostDefaultsPost
} from './hostdefaults.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class HostdefaultsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostDefaultsIndexParams): Observable<HostDefaultsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostDefaultsIndexRoot>(`${proxyPath}/import_module/host_defaults/index.json`, {
            params: params as {} // cast ExternalMonitoringsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *    Add action    *
     **********************/
    public createHostdefault(hostdefault: HostDefaultsPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/host_defaults/add.json?angular=true`, hostdefault)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.hostdefault as GenericIdResponse
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
        return this.http.post(`${proxyPath}/import_module/host_defaults/delete/${item.id}.json?angular=true`, {});
    }

    public loadElements(containerId: number): Observable<HostDefaultsElements> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/import_module/host_defaults/loadElementsByContainerId/${containerId}.json`;

        return this.http.get<HostDefaultsElements>(url, {
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
