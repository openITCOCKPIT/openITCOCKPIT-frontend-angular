import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericSuccessAndMessageResponse } from '../../../../generic-responses';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ImportedhostsIndexParams, ImportedhostsIndexRoot } from './importedhosts.interface';

@Injectable({
    providedIn: 'root'
})
export class ImportedhostsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public getIndex(params: ImportedhostsIndexParams): Observable<ImportedhostsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportedhostsIndexRoot>(`${proxyPath}/import_module/imported_hosts/index.json`, {
            params: params as {} // cast ImportedhostsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public synchronizeWithMonitoring(): Observable<GenericSuccessAndMessageResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessAndMessageResponse>(`${proxyPath}/import_module/imported_hosts/synchronizeWithMonitoring/.json?angular=true.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
