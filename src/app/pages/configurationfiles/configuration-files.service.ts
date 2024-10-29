import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ConfigurationFileInformation, ConfigurationFilesIndexRoot } from './configuration-files.interface';
import { ConfigurationFilesDbKeys } from './configuration-files.enum';

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

}
