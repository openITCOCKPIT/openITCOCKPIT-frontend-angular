import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { CylinderItemRoot, CylinderItemRootParams } from './cylinder-item.interface';

@Injectable({
    providedIn: 'root'
})
export class CylinderItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getCylinderItem(params: CylinderItemRootParams): Observable<CylinderItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CylinderItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
