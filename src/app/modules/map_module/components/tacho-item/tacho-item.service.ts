import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { TachoItemRoot, TachoItemRootParams } from './tacho-item.interface';

@Injectable({
    providedIn: 'root'
})
export class TachoItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getTachoItem(params: TachoItemRootParams): Observable<TachoItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TachoItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
