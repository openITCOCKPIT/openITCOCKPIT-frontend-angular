import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import {
    FilterbookmarkAllocationsIndex,
    FilterBookmarkAllocationElements,
    FilterbookmarkAllocationsIndexParams,
    FilterbookmarkAllocationPost,
    FilterbookmarkAllocationGet
} from './filterbookmark-allocations.interface';
@Injectable({
    providedIn: 'root'
})
export class FilterbookmarkAllocationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: FilterbookmarkAllocationsIndexParams): Observable<FilterbookmarkAllocationsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<FilterbookmarkAllocationsIndex>(`${proxyPath}/FilterBookmarksAllocations/index.json`, {
            params: params as {} // cast TabAllocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/FilterBookmarksAllocations/delete/${item.id}.json`, {});
    }

    public getEdit(id: number): Observable<FilterbookmarkAllocationGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            allocation: {
                FilterBookmarkAllocation: FilterbookmarkAllocationPost
            }
        }>(`${proxyPath}/FilterBookmarksAllocations/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public edit(allocation: FilterbookmarkAllocationPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/FilterBookmarksAllocations/edit/${allocation.id}.json?angular=true`, {
            BookmarkAllocation: allocation
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.allocation as GenericIdResponse
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

    public loadElements(containerId: number): Observable<FilterBookmarkAllocationElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<FilterBookmarkAllocationElements>(`${proxyPath}/FilterBookmarksAllocations/loadElementsByContainerId/${containerId}.json`, {
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
