import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MkagentsDownloadRoot, MkagentsIndexParams, MkagentsIndexRoot } from './mkagents.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class MkagentsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: MkagentsIndexParams): Observable<MkagentsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkagentsIndexRoot>(`${proxyPath}/checkmk_module/mkagents/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/checkmk_module/mkagents/delete/${item.id}.json?angular=true`, {});
    }

    public getDownload(): Observable<MkagentsDownloadRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkagentsDownloadRoot>(`${proxyPath}/checkmk_module/mkagents/download.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
