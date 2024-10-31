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

    public restoreDefault(dbKey: ConfigurationFilesDbKeys, moduleUrl: null | string): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        let endpoint = `${proxyPath}/ConfigurationFiles/restorDefault/${dbKey}.json?angular=true`;
        if (moduleUrl) {
            endpoint = `${proxyPath}/${moduleUrl}/ConfigurationFiles/restorDefault/${dbKey}.json?angular=true`;
        }

        return this.http.post<GenericSuccessResponse>(endpoint, {});
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
     * @param moduleUrl
     */
    public getConfigFileForEditor(dbKey: ConfigurationFilesDbKeys, moduleUrl: null | string): Observable<ConfigurationEditorRootResponse> {
        const endpoint = this.getApiEndpoint(dbKey, moduleUrl);

        return this.http.get<ConfigurationEditorRootResponse>(endpoint, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveConfigFileFromEditor(dbKey: ConfigurationFilesDbKeys, moduleUrl: null | string, config: ConfigurationEditorConfig): Observable<GenericResponseWrapper> {

        const endpoint = this.getApiEndpoint(dbKey, moduleUrl);

        return this.http.post<any>(endpoint, config, {
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


    /**
     * Usually we can load and save the configuration file using the dbKey.
     * Every has its own ConfigurationFiles/{dbKey}.json endpoint, like "ConfigurationFiles/AfterExport.json"
     *
     * However, when it comes to modules things fall apart and get messy.
     * first of all, we have to load the configuration file from the module's endpoint, like "prometheus_module/ConfigurationFiles/PrometheusCfgsPrometheus.json"
     * we use the value of moduleUrl for this.
     * The dbKey of each module, has "_something" as suffix like "PrometheusCfgs_prometheus".
     * For the database it is very important to keep the dbKey as it is!
     *
     * To load the configuration, we have to remove the underscore "_" and make the first letter uppercase.
     * so PrometheusCfgs_prometheus becomes "PrometheusCfgsPrometheus". (but only for the API endpoint)
     *
     * @param dbKey
     * @param moduleUrl
     * @private
     */
    private getApiEndpoint(dbKey: ConfigurationFilesDbKeys, moduleUrl: null | string): string {
        const proxyPath = this.proxyPath;

        let url = `${proxyPath}/ConfigurationFiles/${dbKey}.json`;
        if (moduleUrl === null) {
            // We are a core configuration file
            return url;
        }

        // remove the underscore and make the first letter uppercase
        const dbKeyParts = dbKey.split('_');
        if (dbKeyParts.length !== 2) {
            console.log('Invalid dbKey format for a module. Key should be like "PrometheusCfgs_prometheus" your key is: ' + dbKey);
        }

        const configKey = dbKeyParts[0];
        const moduleKey = dbKeyParts[1].charAt(0).toUpperCase() + dbKeyParts[1].slice(1);

        const endpoint = `${configKey}${moduleKey}`;

        // e.g. prometheus_module
        url = `${proxyPath}/${moduleUrl}/ConfigurationFiles/${endpoint}.json`;

        return url;
    }

}
