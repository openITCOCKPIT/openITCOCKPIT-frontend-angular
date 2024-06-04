import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    HostescalationContainerResult,
    HostescalationElements,
    HostescalationHosts,
    HostescalationIndexRoot,
    HostescalationPost,
    HostescalationsIndexParams
} from './hostescalations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class HostescalationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: HostescalationsIndexParams): Observable<HostescalationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationIndexRoot>(`${proxyPath}/hostescalations/index.json`, {
            params: params as {} // cast HostescalationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hostescalations/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<HostescalationContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationContainerResult>(`${proxyPath}/hostescalations/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<HostescalationElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationElements>(`${proxyPath}/hostescalations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadHosts(containerId: number, searchString: string, hostsIds: number []): Observable<HostescalationHosts> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostescalationHosts>(`${proxyPath}/hostescalations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true,
                'filter[Hosts.name]': searchString,
                'selected[]': hostsIds
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public add(hostescalation: HostescalationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hostescalations/add.json?angular=true`, {
            Hostescalation: hostescalation
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
