import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ImporterConfig, ImporterElements, ImportersIndexParams, ImportersIndexRoot } from './importers.interface';
import { Hostdefault, HostDefaultsIndexRoot } from '../hostdefaults/hostdefaults.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ExternalSystemsAsList } from '../externalsystems/external-systems.interface';
import { ExternalMonitoringsAsList } from '../externalmonitorings/external-monitorings.interface';

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

    public loadElements(containerId: number, dataSource: string): Observable<ImporterElements> {
        const proxyPath = this.proxyPath;
        return forkJoin([
            this.http.get<HostDefaultsIndexRoot>(`${proxyPath}/import_module/importers/loadElementsByContainerId/` + containerId + `.json?angular=true`, {
                params: {
                    empty: 'true'
                }
            }),
            this.http.get<ExternalSystemsAsList>(`/import_module/external_systems/loadExternalSystemsByContainerId/` + containerId + `.json?angular=true`, {
                params: {
                    data_source: dataSource
                }
            }),
            this.http.get<ExternalMonitoringsAsList>(`/import_module/external_monitorings/loadExternalMonitoringsByContainerId/` + containerId + `.json?angular=true`, {
                params: {
                    empty: 'true'
                }
            })
        ]).pipe(
            map(([hostdefaults, externalsystems, externalMonitorings]) => {
                return {
                    hostdefaults: hostdefaults.hostdefaults,
                    externalsystems: externalsystems,
                    externalMonitorings: externalMonitorings
                }
            })
        );
    }

    public loadConfig(data_source: string) {
        const proxyPath = this.proxyPath;
        return this.http.post<ImporterConfig>(`${proxyPath}/import_module/importers/loadConfigFieldsByDataSource/${data_source}.json?angular=true`, {});
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
