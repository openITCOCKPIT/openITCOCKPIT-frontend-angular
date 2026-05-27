import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { ContainersLoadContainersByStringParams } from '../../../pages/containers/containers.interface';
import { LoadContainersResponse } from '../../../pages/users/users.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { allocatedFilterbookmark, BookmarkAllocateContainerResponse } from '../bookmarks.interface';

@Injectable({
    providedIn: 'root'
})
export class FilterBookmarkAllocateModalService {


    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }



    public loadElementsByContainerId(containerId: number, plugin: string, controller: string, action: string): Observable<BookmarkAllocateContainerResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/FilterBookmarksAllocations/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true,
                plugin: plugin,
                controller: controller,
                action: action
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainersByString(params: ContainersLoadContainersByStringParams): Observable<LoadContainersResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<LoadContainersResponse>(`${proxyPath}/users/loadContainersForAngular.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: LoadContainersResponse) => {
                return data;
            })
        );
    }

    public addBookmarkAllocation(data: allocatedFilterbookmark): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/FilterBookmarksAllocations/add.json?angular=true`, {
            FilterBookmarkAllocation: data
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

    public deleteBookmarkAllocation(bookmarkId: number): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/FilterBookmarksAllocations/delete/${bookmarkId}.json`, {});
    }


    public editBookmarkAllocation(data: allocatedFilterbookmark): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/FilterBookmarksAllocations/edit/${data.id}.json?angular=true`, {
            BookmarkAllocation: data
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
