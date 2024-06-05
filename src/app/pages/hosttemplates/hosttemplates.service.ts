import { inject, Injectable } from '@angular/core';
import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    HosttemplateCommandArgument,
    HosttemplateContainerResult,
    HosttemplateCopyGet,
    HosttemplateCopyPost,
    HosttemplateEditApiResult,
    HosttemplateElements,
    HosttemplateEntity,
    HosttemplateIndexRoot,
    HosttemplatePost,
    HosttemplatesIndexParams,
    HosttemplateTypeResult
} from './hosttemplates.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { HostObjectCake2 } from '../hosts/hosts.interface';
import { PermissionsService } from '../../permissions/permissions.service';


@Injectable({
    providedIn: 'root'
})
export class HosttemplatesService {

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    /**********************
     *    Index action    *
     **********************/
    public getHosttemplateTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE,
                name: this.TranslocoService.translate('Generic templates'),
            }
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: HosttemplateTypesEnum.EVK_HOSTTEMPLATE,
                    name: this.TranslocoService.translate('EVC templates'),
                });
            }
        });

        return types;
    }

    public getIndex(params: HosttemplatesIndexParams): Observable<HosttemplateIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateIndexRoot>(`${proxyPath}/hosttemplates/index.json`, {
            params: params as {} // cast HosttemplatesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hosttemplates/delete/${item.id}.json?angular=true`, {});
    }

    /**********************
     *    Add action    *
     **********************/
    public loadHosttemplateTypes(): Observable<HosttemplateTypeResult[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ types: HosttemplateTypeResult[] }>(`${proxyPath}/hosttemplates/add.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.types
            })
        )
    }

    public loadCommands(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ commands: SelectKeyValue[] }>(`${proxyPath}/hosttemplates/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.commands
            })
        )
    }

    public loadContainers(hosttemplateId?: number): Observable<HosttemplateContainerResult> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/hosttemplates/loadContainers.json`;
        if (hosttemplateId) {
            url = `${proxyPath}/hosttemplates/loadContainers/${hosttemplateId}.json`;
        }

        return this.http.get<HosttemplateContainerResult>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<HosttemplateElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateElements>(`${proxyPath}/hosttemplates/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArgumentsForAdd(commandId: number): Observable<HosttemplateCommandArgument[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hosttemplatecommandargumentvalues: HosttemplateCommandArgument[]
        }>(`${proxyPath}/hosttemplates/loadCommandArguments/${commandId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.hosttemplatecommandargumentvalues;
            })
        );
    }

    public loadCommandArgumentsForEdit(commandId: number, hosttemplateId: number): Observable<HosttemplateCommandArgument[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hosttemplatecommandargumentvalues: HosttemplateCommandArgument[]
        }>(`${proxyPath}/hosttemplates/loadCommandArguments/${commandId}/${hosttemplateId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.hosttemplatecommandargumentvalues;
            })
        );
    }

    public loadCommandArgumentsForCopy(commandId: number, sourcehosttemplateId: number): Observable<HosttemplateCommandArgument[]> {
        return this.loadCommandArgumentsForEdit(commandId, sourcehosttemplateId);
    }

    public add(hosttemplate: HosttemplatePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hosttemplates/add.json?angular=true`, {
            Hosttemplate: hosttemplate
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

    /**********************
     *    Edit action    *
     **********************/
    public edit(hosttemplate: HosttemplatePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hosttemplates/edit/${hosttemplate.id}.json?angular=true`, {
            Hosttemplate: hosttemplate
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

    public getEdit(id: number): Observable<HosttemplateEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateEditApiResult>(`${proxyPath}/hosttemplates/edit/${id}.json`, {
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
     *    Copy action    *
     **********************/
    public getHosttemplatesCopy(ids: number[]): Observable<HosttemplateCopyGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateCopyGet>(`${proxyPath}/hosttemplates/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            )
    }


    public saveHosttemplatesCopy(hosttemplates: HosttemplateCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hosttemplates/copy/.json?angular=true`, {
            data: hosttemplates
        });
    }

    /**********************
     *   Used by action   *
     **********************/
    public usedBy(id: number): Observable<{
        all_hosts: HostObjectCake2[],
        hosttemplate: HosttemplateEntity
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            all_hosts: HostObjectCake2[],
            hosttemplate: HosttemplateEntity
        }>(`${proxyPath}/hosttemplates/usedBy/${id}.json`, {
            params: {
                angular: true,
                'filter[Hosts.disabled]': true
            }

        })
            .pipe(
                map(data => {
                    return data;
                })
            );
    }
}
