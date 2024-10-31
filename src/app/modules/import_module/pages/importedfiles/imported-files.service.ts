import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ImportedFilesIndexParams, ImportedFilesIndexRoot, ImportedFilesViewRoot } from './imported-files.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ImportedFilesService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public getIndex(params: ImportedFilesIndexParams): Observable<ImportedFilesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportedFilesIndexRoot>(`${proxyPath}/import_module/imported_files/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/import_module/imported_files/delete/${item.id}.json`, {});
    }

    public getView(id: number): Observable<ImportedFilesViewRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportedFilesViewRoot>(`${proxyPath}/import_module/imported_files/view/${id}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return data;
            })
        );
    }
}
