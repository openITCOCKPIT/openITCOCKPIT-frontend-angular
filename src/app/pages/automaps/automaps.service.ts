import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { AutomapCopyPost, AutomapEntity, AutomapsIndexParams, AutomapsIndexRoot } from './automaps.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class AutomapsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: AutomapsIndexParams): Observable<AutomapsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutomapsIndexRoot>(`${proxyPath}/automaps/index.json`, {
            params: params as {} // cast AutomapsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/automaps/delete/${item.id}.json?angular=true`, {});
    }

    public getAutomapsCopy(ids: number[]): Observable<AutomapEntity[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ automaps: AutomapEntity[] }>(`${proxyPath}/automaps/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.automaps;
                })
            )
    }


    public saveAutomapsCopy(automaps: AutomapCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/automaps/copy/.json?angular=true`, {
            data: automaps
        });
    }
}
