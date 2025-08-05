import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { LocationPost, LocationsIndexParams, LocationsIndexRoot } from './locations.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class LocationsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: LocationsIndexParams): Observable<LocationsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LocationsIndexRoot>(`${proxyPath}/locations/index.json`, {
            params: params as {} // cast LocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/locations/delete/${item.id}.json`, {});
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/locations/loadContainers.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public add(location: LocationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/locations/add.json?angular=true`, location)
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

    public getLocationEdit(id: number): Observable<LocationPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ location: LocationPost }>(`${proxyPath}/locations/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.location;
            })
        );
    }

    public saveLocationEdit(location: LocationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/locations/edit/${location.id}.json?angular=true`, location)
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
