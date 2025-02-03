import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { PerfdataTextItemRoot, PerfdataTextItemRootParams } from './perfdata-text-item.interface';

@Injectable({
    providedIn: 'root'
})
export class PerfdataTextItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getPerfdataTextItem(params: PerfdataTextItemRootParams): Observable<PerfdataTextItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PerfdataTextItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
