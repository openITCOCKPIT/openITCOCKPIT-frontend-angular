import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    LoadContainersRoot,
    OrganizationalChartsIndexParams,
    OrganizationalChartsIndexRoot,
    OrganizationalChartsPost
} from './organizationalcharts.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class OrganizationalChartsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: OrganizationalChartsIndexParams): Observable<OrganizationalChartsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OrganizationalChartsIndexRoot>(`${proxyPath}/organizationalCharts/index.json`, {
            params: params as {} // cast LocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/organizationalCharts/delete/${item.id}.json`, {});
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/organizationalCharts/loadContainers.json`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public add(body: OrganizationalChartsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/organizationalCharts/add.json`, body)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as OrganizationalChartsPost
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
