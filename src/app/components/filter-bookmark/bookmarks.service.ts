import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { BookmarksObject, BookmarksParams, BookmarksIndexRoot, BookmarkPost } from './bookmarks.interface';
import {ServicePost} from '../../pages/services/services.interface';
import {GenericIdResponse, GenericResponseWrapper, GenericValidationError} from '../../generic-responses';
import {DeleteAllItem} from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root',
})

export class BookmarksService  {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getBookmarksIndex(params: BookmarksParams): Observable<BookmarksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<BookmarksIndexRoot>(`${proxyPath}/filter_bookmarks/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public add(bookmark: BookmarkPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/filter_bookmarks/add.json?angular=true`, bookmark )
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

    public update (bookmark: BookmarksObject, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/filter_bookmarks/edit/` + id + `.json?angular=true`, bookmark )
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

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/filter_bookmarks/delete/${item.id}.json?angular=true`, {});
    }
}
