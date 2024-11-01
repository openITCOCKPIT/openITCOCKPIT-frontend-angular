import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    ConfigurationitemsElementsExport,
    ConfigurationitemsElementsExportPost,
    ConfigurationitemsElementsJsonFile
} from './configurationitems.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationitemsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadElementsForExport(): Observable<ConfigurationitemsElementsExport> {
        const proxyPath = this.proxyPath;
        return this.http.get<ConfigurationitemsElementsExport>(`${proxyPath}/import_module/configurationitems/loadElementsForExport.json`, {
            params: {
                angular: 'true'
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public export(data: ConfigurationitemsElementsExportPost): Observable<ConfigurationitemsElementsJsonFile> {
        const proxyPath = this.proxyPath;
        return this.http.post<ConfigurationitemsElementsJsonFile>(`${proxyPath}/import_module/configurationitems/export.json?angular=true`, data)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return data;
                })
            );
    }
}
