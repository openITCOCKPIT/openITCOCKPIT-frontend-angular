import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ConfigurationEditorConfig,
    ConfigurationEditorRootResponse,
    ConfigurationFileInformation,
    ConfigurationFilesIndexRoot
} from './configuration-files.interface';
import { ConfigurationFilesDbKeys } from './configuration-files.enum';
import { GenericResponseWrapper, GenericSuccessResponse, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationFilesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(): Observable<ConfigurationFilesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ConfigurationFilesIndexRoot>(`${proxyPath}/ConfigurationFiles/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public restoreDefault(dbKey: ConfigurationFilesDbKeys): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/ConfigurationFiles/restorDefault/${dbKey}.json?angular=true`, {});
    }

    public getConfigFileForEdit(dbKey: ConfigurationFilesDbKeys): Observable<ConfigurationFileInformation> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            ConfigFile: ConfigurationFileInformation
        }>(`${proxyPath}/ConfigurationFiles/edit/${dbKey}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.ConfigFile;
            })
        )
    }

    /**
     * Each configuration file has its own API endpoint where we can load the current configuration file.
     * @param dbKey
     */
    public getConfigFileForEditor(dbKey: ConfigurationFilesDbKeys): Observable<ConfigurationEditorRootResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ConfigurationEditorRootResponse>(`${proxyPath}/ConfigurationFiles/${dbKey}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveConfigFileFromEditor(dbKey: ConfigurationFilesDbKeys, config: ConfigurationEditorConfig): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}${proxyPath}/ConfigurationFiles/${dbKey}.json`, config, {
            params: {
                angular: true
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericSuccessResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

}
