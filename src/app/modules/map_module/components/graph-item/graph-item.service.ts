import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable } from 'rxjs';
import { GraphItemParams, GraphItemRoot } from './graph-item.interface';
import { handleError, SKIP_ERROR_REDIRECT } from '../../../../tokens/skip-error-redirect.token';

@Injectable({
    providedIn: 'root'
})
export class GraphItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getGraphItem(params: GraphItemParams): Observable<GraphItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<GraphItemRoot>(`${proxyPath}/map_module/mapeditors/graph/.json`, {
            params: params as {},
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true)
        }).pipe(
            catchError(handleError),
            map(data => {
                return data;
            })
        )
    }
}
