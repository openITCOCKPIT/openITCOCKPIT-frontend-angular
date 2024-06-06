import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { TranslocoService } from '@jsverse/transloco';
import { ServicetemplateTypesEnum } from './servicetemplate-types.enum';
import { PermissionsService } from '../../permissions/permissions.service';
import {
    ServicetemplateCommandArgument,
    ServicetemplateContainerResult,
    ServicetemplateElements,
    ServicetemplateIndexRoot,
    ServicetemplatePost,
    ServicetemplatesIndexParams,
    ServicetemplateTypeResult
} from './servicetemplates.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class ServicetemplatesService {

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    /**********************
     *    Index action    *
     **********************/
    public getServicetemplateTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: ServicetemplateTypesEnum.GENERIC_SERVICE,
                name: this.TranslocoService.translate('Generic templates'),
            },
            {
                id: ServicetemplateTypesEnum.OITC_AGENT_SERVICE,
                name: this.TranslocoService.translate('Agent templates'),
            },
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.EVK_SERVICE,
                    name: this.TranslocoService.translate('EVC templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('CheckmkModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.MK_SERVICE,
                    name: this.TranslocoService.translate('Checkmk templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('PrometheusModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.PROMETHEUS_SERVICE,
                    name: this.TranslocoService.translate('Prometheus templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('ImportModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.EXTERNAL_SERVICE,
                    name: this.TranslocoService.translate('External templates'),
                });
            }
        });

        return types;
    }

    public getIndex(params: ServicetemplatesIndexParams): Observable<ServicetemplateIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicetemplateIndexRoot>(`${proxyPath}/servicetemplates/index.json`, {
            params: params as {} // cast ServicetemplatesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/servicetemplates/delete/${item.id}.json?angular=true`, {});
    }

    /**********************
     *    Add action    *
     **********************/
    public loadContainers(servicetemplateId?: number): Observable<ServicetemplateContainerResult> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/servicetemplates/loadContainers.json`;
        if (servicetemplateId) {
            url = `${proxyPath}/servicetemplates/loadContainers/${servicetemplateId}.json`;
        }

        return this.http.get<ServicetemplateContainerResult>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommands(): Observable<{ commands: SelectKeyValue[], eventhandlerCommands: SelectKeyValue[] }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            commands: SelectKeyValue[],
            eventhandlerCommands: SelectKeyValue[]
        }>(`${proxyPath}/servicetemplates/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadServicetemplateTypes(): Observable<ServicetemplateTypeResult[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ types: ServicetemplateTypeResult[] }>(`${proxyPath}/servicetemplates/add.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.types
            })
        )
    }

    public loadElements(containerId: number): Observable<ServicetemplateElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicetemplateElements>(`${proxyPath}/servicetemplates/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArguments(commandId: number, servicetemplateId?: number): Observable<ServicetemplateCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/servicetemplates/loadCommandArguments/${commandId}.json`;
        if (servicetemplateId) {
            // Edit or copy
            `${proxyPath}/servicetemplates/loadCommandArguments/${commandId}/${servicetemplateId}.json`
        }

        return this.http.get<{
            servicetemplatecommandargumentvalues: ServicetemplateCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.servicetemplatecommandargumentvalues;
            })
        );
    }

    public loadEventHandlerCommandArguments(commandId: number, servicetemplateId?: number): Observable<ServicetemplateCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/servicetemplates/loadEventhandlerCommandArguments/${commandId}.json`;
        if (servicetemplateId) {
            // Edit or copy
            `${proxyPath}/servicetemplates/loadEventhandlerCommandArguments/${commandId}/${servicetemplateId}.json`
        }

        return this.http.get<{
            servicetemplateeventhandlercommandargumentvalues: ServicetemplateCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.servicetemplateeventhandlercommandargumentvalues;
            })
        );
    }

    public add(servicetemplate: ServicetemplatePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/servicetemplates/add.json?angular=true`, {
            Servicetemplate: servicetemplate
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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
