import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ImportersIndexParams, ImportersIndexRoot } from './importers.interface';
import { Hostdefault } from '../hostdefaults/hostdefaults.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ImportersService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getImporters(params: ImportersIndexParams): Observable<ImportersIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportersIndexRoot>(`${proxyPath}/import_module/importers/index.json`, {
            params: params as {} // cast ImportersIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getHostdefaults(): Observable<Hostdefault[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hostdefaults: Hostdefault[]
        }>(`${proxyPath}/import_module/host_defaults/index.json`, {}).pipe(
            map(data => {
                return data.hostdefaults;
            })
        )
    }

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/importers/delete/${item.id}.json?angular=true`, {});
    }
}
