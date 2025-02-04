import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MetadataResponse, MetadataResponseRoot } from './prometheus-autocomplete.interface';

@Injectable({
    providedIn: 'root'
})
export class PrometheusAutocompleteService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    /****************************************
     *   PrometheusModule: Qutocomplete     *
     ****************************************/

    public getMetadata(): Observable<MetadataResponse> {
        return this.http.get<MetadataResponseRoot>(`${this.proxyPath}/prometheus_module/PrometheusQuery/loadHostsByString.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map((data: MetadataResponseRoot) => {
                return data.data;
            })
        );
    }
}
