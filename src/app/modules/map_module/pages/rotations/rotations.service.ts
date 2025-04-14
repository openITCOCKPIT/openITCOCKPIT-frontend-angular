import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadMapsByContainerIdRequest,
    LoadMapsRoot,
    RotationPost,
    RotationsEditRoot,
    RotationsIndexParams,
    RotationsIndexRoot
} from './rotations.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { LoadContainersRoot } from '../../../../pages/containers/containers.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class RotationsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: RotationsIndexParams): Observable<RotationsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<RotationsIndexRoot>(`${proxyPath}/map_module/rotations/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/map_module/rotations/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/map_module/rotations/loadContainers.json?angular=true`).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public loadMaps(params: LoadMapsByContainerIdRequest): Observable<LoadMapsRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadMapsRoot>(`${proxyPath}/map_module/rotations/loadMaps.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadMapsRoot) => {
                return data;
            })
        )
    }

    public add(post: RotationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/rotations/add.json?angular=true`, post)
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

    public getEdit(id: number): Observable<RotationsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/map_module/rotations/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateRotation(post: RotationPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/rotations/edit/${id}.json?angular=true`, post)
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
