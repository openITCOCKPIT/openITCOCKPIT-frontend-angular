import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ServiceOutputItemRoot, ServiceOutputItemRootParams } from './service-output-item.interface';

@Injectable({
    providedIn: 'root'
})
export class ServiceOutputItemService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getServiceOutputItem(params: ServiceOutputItemRootParams): Observable<ServiceOutputItemRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceOutputItemRoot>(`${proxyPath}/map_module/mapeditors/mapitem/.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
