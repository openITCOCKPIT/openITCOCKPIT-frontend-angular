import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadContainersRoot,
    LoadSatellitesRoot,
    MapCopyGet,
    MapCopyPost,
    MapPost,
    MapsEditRoot,
    MapsIndexParams,
    MapsIndexRoot
} from './Maps.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: MapsIndexParams): Observable<MapsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapsIndexRoot>(`${proxyPath}/map_module/maps/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getEdit(id: number): Observable<MapsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/map_module/maps/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/map_module/maps/loadContainers.json?angular=true`).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public loadSatellites(containerIds: number[]): Observable<LoadSatellitesRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadSatellitesRoot>(`${proxyPath}/containers/loadSatellitesByContainerIds.json`, {
            params: {
                'angular': true,
                'containerIds[]': containerIds
            }
        }).pipe(
            map((data: LoadSatellitesRoot) => {
                return data;
            })
        )
    }

    public add(post: MapPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/maps/add.json?angular=true`, post)
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

    public updateMap(post: MapPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/maps/edit/${post.Map.id}.json?angular=true`, post)
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

    public getMapsCopy(ids: number[]): Observable<MapCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ maps: MapCopyGet[] }>(`${proxyPath}/map_module/maps/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.maps;
                })
            )
    }


    public saveMapsCopy(mapsCopyPost: MapCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/maps/copy/.json?angular=true`, {
            data: mapsCopyPost
        });
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/map_module/maps/delete/${item.id}.json?angular=true`, {});
    }

}
