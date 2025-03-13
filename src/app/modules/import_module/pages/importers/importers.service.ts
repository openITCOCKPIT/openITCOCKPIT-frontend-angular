import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    Importer,
    ImporterConfig,
    ImporterElements,
    ImportersGet,
    ImportersIndexParams,
    ImportersIndexRoot,
    ImportersPost,
    LoadElementsByContainerIdResponse
} from './importers.interface';
import { Hostdefault } from '../hostdefaults/hostdefaults.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ExternalSystemsAsList } from '../externalsystems/external-systems.interface';
import { ExternalMonitoringsAsList } from '../externalmonitorings/external-monitorings.interface';
import {
    GenericIdResponse,
    GenericMessageResponse,
    GenericResponseWrapper,
    GenericValidationError
} from '../../../../generic-responses';
import { ModalService } from '@coreui/angular';
import { ImportDataResponse } from '../importedhosts/importedhosts.interface';

@Injectable({
    providedIn: 'root'
})
export class ImportersService {
    public modalImporter$$: Subject<Importer> = new Subject();
    public modalImporter$$$ = this.modalImporter$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly modalService = inject(ModalService);

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
            this.http.get<LoadElementsByContainerIdResponse>(`${proxyPath}/import_module/importers/loadElementsByContainerId/` + containerId + `.json?angular=true`, {
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
            map(([hostdefaultsResponse, externalsystems, externalMonitorings]) => {
                return {
                    hostdefaults: hostdefaultsResponse.hostdefaults,
                    externalsystems: externalsystems,
                    externalMonitorings: externalMonitorings
                }
            })
        );
    }

    public loadConfig(data_source: string, importerId?: number) {
        const proxyPath = this.proxyPath;
        if (importerId) {
            return this.http.post<ImporterConfig>(`${proxyPath}/import_module/importers/loadConfigFieldsByDataSource/${data_source}.json?angular=true`, {
                importerId: importerId
            });
        } else {
            return this.http.post<ImporterConfig>(`${proxyPath}/import_module/importers/loadConfigFieldsByDataSource/${data_source}.json?angular=true`, {});
        }
    }


    /**********************
     *    Add action    *
     **********************/
    public createImporter(importer: ImportersPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/importers/add.json?angular=true`, {
            Importer: importer
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.importer as GenericIdResponse
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

    public getEdit(id: number): Observable<ImportersGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            importer: ImportersPost
        }>(`${proxyPath}/import_module/importers/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Edit action    *
     **********************/
    public edit(importer: ImportersPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/importers/edit/${importer.id}.json?angular=true`, {
            Importer: importer
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.importer as GenericIdResponse
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


    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/importers/delete/${item.id}.json?angular=true`, {});
    }

    public openImportedHostsDataModal(importer: Importer) {
        this.modalImporter$$.next(importer);
        if (importer.data_source === 'csv_with_header' || importer.data_source === 'csv_without_header') {
            this.modalService.toggle({
                show: true,
                id: 'importCsvDataModal',
            });
        } else {
            this.modalService.toggle({
                show: true,
                id: 'importDataModal',
            });
        }
    }

    public loadDataFromITop(importer: Importer): Observable<{
        success: boolean;
        data: ImportDataResponse | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportDataResponse>(`${proxyPath}/import_module/imported_hosts/loadDataFromITop/${importer.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
                };
            }),
            catchError((error: any) => {
                let errorMessage: GenericMessageResponse = {message: error.error.response.error};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public loadDataFromIdoit(importer: Importer): Observable<{
        success: boolean;
        data: ImportDataResponse | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportDataResponse>(`${proxyPath}/import_module/imported_hosts/loadDataFromIdoit/${importer.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
                };
            }),
            catchError((error: any) => {
                let errorMessage: GenericMessageResponse = {message: error.error.response.error};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public loadDataFromOITCAgent(importer: Importer): Observable<{
        success: boolean;
        data: ImportDataResponse | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportDataResponse>(`${proxyPath}/import_module/imported_hosts/loadDataFromOITCAgent/${importer.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
                };
            }),
            catchError((error: any) => {
                let errorMessage: GenericMessageResponse = {message: error.error.response.error};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public loadDataFromExternalMonitoring(importer: Importer): Observable<{
        success: boolean;
        data: ImportDataResponse | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportDataResponse>(`${proxyPath}/import_module/imported_hosts/loadDataFromExternalMonitoring/${importer.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
                };
            }),
            catchError((error: any) => {
                let message: any = '';
                if (error.status == 500 && error.error && error.error.response && error.error.response.error) {
                    message = error.error.response.error;

                } else if (error.status == 500 && error.message && !error.error.response) {
                    message = error.message;
                }
                let errorMessage: GenericMessageResponse = {message: message};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public startDataImport(importer: Importer, uploadedFile: string | undefined): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;


        return this.http.post(`${proxyPath}/import_module/imported_hosts/importData/.json?angular=true`, {
            filename: uploadedFile,
            importerId: importer.id
        }).pipe(map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data as GenericIdResponse
                };
            }),
            catchError((error: any) => {
                const err = error.error.response as GenericValidationError;
                return of({
                    success: false,
                    data: err
                });
            })
        );
    }
}
