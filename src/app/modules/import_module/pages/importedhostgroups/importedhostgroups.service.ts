import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    Importedhostgroup,
    ImportedhostgroupGet,
    ImportedhostgroupsIndexParams,
    ImportedhostgroupsIndexRoot,
    ImportedhostgroupView
} from './importedhostgroups.interface';
import { GenericSuccessAndMessageResponse } from '../../../../generic-responses';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ImportedhostgroupsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: ImportedhostgroupsIndexParams): Observable<ImportedhostgroupsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportedhostgroupsIndexRoot>(`${proxyPath}/import_module/imported_hostgroups/index.json`, {
            params: params as {} // cast ImportedhostgroupsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getDependencyTree(hostgroupId: number): Observable<Importedhostgroup> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            importedhostgroup: Importedhostgroup
        }>(`${proxyPath}/import_module/ImportedHostgroups/dependencyTree/${hostgroupId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.importedhostgroup;
            })
        );
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

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/imported_hostgroups/delete/${item.id}.json?angular=true`, {});
    }

    public getView(id: number): Observable<ImportedhostgroupView> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            importedhostgroup: ImportedhostgroupGet
            containerPath: string
        }>(`${proxyPath}/import_module/imported_hostgroups/view/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }
}
