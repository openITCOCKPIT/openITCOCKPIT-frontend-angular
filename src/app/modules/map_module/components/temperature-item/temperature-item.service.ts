import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { TemperatureItemRoot, TemperatureItemRootParams } from './temperature-item.interface';

@Injectable({
    providedIn: 'root'
})
export class TemperatureItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getTemperatureItem(params: TemperatureItemRootParams): Observable<TemperatureItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TemperatureItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
