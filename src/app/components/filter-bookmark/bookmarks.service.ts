import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { BookmarksObject, BookmarksParams, BookmarksIndexRoot } from './bookmarks.interface';

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
}
