import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    ConfigurationitemsElementsExport,
    ConfigurationitemsElementsExportPost,
    ConfigurationitemsElementsJsonFile,
    ConfigurationItemsImportResponse
} from './configurationitems.interface';
import { ProfileMaxUploadLimit } from '../../../../pages/profile/profile.interface';
import { GenericSuccessAndMessageResponse } from '../../../../generic-responses';

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

    public loadMaxUploadLimit(): Observable<ProfileMaxUploadLimit> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            maxUploadLimit: ProfileMaxUploadLimit
        }>(`${proxyPath}/import_module/configurationitems/import.json`, {
            params: {}
        }).pipe(
            map(data => {
                return data.maxUploadLimit;
            })
        )
    }

    public deleteUploadedFile(filename: string): Observable<GenericSuccessAndMessageResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            response: GenericSuccessAndMessageResponse
        }>(`${proxyPath}/import_module/configurationitems/deleteUploadedFile.json?angular=true`, {
            filename: filename
        }).pipe(
            map(data => {
                return data.response;
            })
        )
    }

    public launchImport(filename: string): Observable<ConfigurationItemsImportResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<ConfigurationItemsImportResponse>(`${proxyPath}/import_module/configurationitems/launch_import.json?angular=true`, {
            filename: filename
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
