/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import {
    ServiceBrowserMenu,
    ServiceCommandArgument,
    ServiceCopyGet,
    ServiceCopyPost,
    ServiceEditApiResult,
    ServiceElements,
    ServiceEntity,
    ServiceLoadServicetemplateApiResult,
    ServiceParams,
    ServicePost,
    ServicesDeletedParams,
    ServicesDeletedServicesRoot,
    ServicesDisabledRoot,
    ServicesIndexFilterApiRequest,
    ServicesIndexRoot,
    ServicesLoadServicesByStringParams,
    ServicesNotMonitoredParams,
    ServicesNotMonitoredRoot
} from './services.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { ServiceTypesEnum } from './services.enum';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../permissions/permissions.service';
import { DisableItem } from '../../layouts/coreui/disable-modal/disable.interface';
import { EnableItem } from '../../layouts/coreui/enable-modal/enable.interface';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    constructor() {
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/services/delete/${item.id}.json?angular=true`, {});
    }


    /**********************
     *    Add action    *
     **********************/

    public loadCommands(): Observable<{ commands: SelectKeyValue[], eventhandlerCommands: SelectKeyValue[] }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            commands: SelectKeyValue[],
            eventhandlerCommands: SelectKeyValue[]
        }>(`${proxyPath}/services/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(hostId: number, serviceId?: number): Observable<ServiceElements> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/services/loadElementsByHostId/${hostId}.json`;
        if (serviceId) {
            url = `${proxyPath}/services/loadElementsByHostId/${hostId}/${serviceId}.json`
        }

        return this.http.get<ServiceElements>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArguments(commandId: number, serviceId?: number): Observable<ServiceCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/services/loadCommandArguments/${commandId}.json`;
        if (serviceId) {
            // Edit or copy
            url = `${proxyPath}/services/loadCommandArguments/${commandId}/${serviceId}.json`
        }

        return this.http.get<{
            servicecommandargumentvalues: ServiceCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.servicecommandargumentvalues;
            })
        );
    }

    public loadEventHandlerCommandArguments(commandId: number, serviceId?: number): Observable<ServiceCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/services/loadEventhandlerCommandArguments/${commandId}.json`;
        if (serviceId) {
            // Edit or copy
            url = `${proxyPath}/services/loadEventhandlerCommandArguments/${commandId}/${serviceId}.json`
        }

        return this.http.get<{
            serviceeventhandlercommandargumentvalues: ServiceCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.serviceeventhandlercommandargumentvalues;
            })
        );
    }

    public add(service: ServicePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/services/add.json?angular=true`, {
            Service: service
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

    public loadServicetemplate(servicetemplateId: number, hostId: number): Observable<ServiceLoadServicetemplateApiResult> {
        const proxyPath = this.proxyPath;


        return this.http.get<ServiceLoadServicetemplateApiResult>(`${proxyPath}/services/loadServicetemplate/${servicetemplateId}/${hostId}.json`, {
            params: {
                'angular': true
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

    public getEdit(id: number): Observable<ServiceEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceEditApiResult>(`${proxyPath}/services/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public edit(service: ServicePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/services/edit/${service.id}.json?angular=true`, {
            Service: service
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
     *    Service Index   *
     **********************/


    public getServicesIndexViaGet(params: ServiceParams): Observable<ServicesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesIndexRoot>(`${proxyPath}/services/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getServicesIndexViaPost(params: ServiceParams, filter: ServicesIndexFilterApiRequest): Observable<ServicesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.post<ServicesIndexRoot>(`${proxyPath}/services/index.json`, {
            filter: filter as {} // POST data used for filter
        }, {
            params: params as {} // query string parameter
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public disable(item: DisableItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/services/deactivate/${item.id}.json?angular=true`, {});
    }

    /**********************
     *    Service Types   *
     **********************/

    public getServiceTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: ServiceTypesEnum.GENERIC_SERVICE,
                name: this.TranslocoService.translate('Generic service'),
            }
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServiceTypesEnum.EVK_SERVICE,
                    name: this.TranslocoService.translate('EVC service'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('CheckmkModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServiceTypesEnum.MK_SERVICE,
                    name: this.TranslocoService.translate('Checkmk service'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('PrometheusModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServiceTypesEnum.PROMETHEUS_SERVICE,
                    name: this.TranslocoService.translate('Prometheus service'),
                });
            }
        });

        types.push({
            id: ServiceTypesEnum.OITC_AGENT_SERVICE,
            name: this.TranslocoService.translate('Agent service'),
        });

        this.PermissionsService.hasModuleObservable('ImportModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServiceTypesEnum.EXTERNAL_SERVICE,
                    name: this.TranslocoService.translate('External service'),
                });
            }
        });
        return types;
    }

    /**********************
     *    Copy action    *
     **********************/

    public getServicesCopy(ids: number[], hostId: number): Observable<ServiceCopyGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceCopyGet>(`${proxyPath}/services/copy/${ids.join('/')}.json`, {
            params: {
                angular: true,
                hostId: hostId
            }
        })
            .pipe(
                map(data => {
                    return data
                })
            )
    }

    public saveServicesCopy(services: ServiceCopyPost[], hostId: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/services/copy/.json?angular=true`, {
            data: services,
            hostId: hostId
        });
    }

    public loadServicesByString(params: ServicesLoadServicesByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        let url = `${proxyPath}/services/loadServicesByStringForOptionGroup.json`;

        return this.http.get<{ services: SelectKeyValue[] }>(url, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.services;
            })
        );
    }

    /***************************
     * Services Not Monitored  *
     ***************************/

    public getNotMonitored(params: ServicesNotMonitoredParams): Observable<ServicesNotMonitoredRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesNotMonitoredRoot>(`${proxyPath}/services/notMonitored.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     * Services Disabled  *
     **********************/

    public getDisabled(params: ServicesNotMonitoredParams): Observable<ServicesDisabledRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesDisabledRoot>(`${proxyPath}/services/disabled.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public enable(item: EnableItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/services/enable/${item.id}.json?`, {
            empty: true // ??
        });
    }

    /**********************
     *   Service Deleted  *
     **********************/

    public getServicesDeleted(params: ServicesDeletedParams): Observable<ServicesDeletedServicesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesDeletedServicesRoot>(`${proxyPath}/services/deleted.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *   Browser action   *
     **********************/
    public getServiceByUuid(uuid: string): Observable<ServiceEntity> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ service: ServiceEntity }>(`${proxyPath}/services/byUuid/${uuid}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.service;
                })
            )
    }

    public getServiceBrowserMenuConfig(serviceId: number, includeHoststatus: boolean = true, includeServicestatus: boolean = true): Observable<ServiceBrowserMenu> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ config: ServiceBrowserMenu }>(`${proxyPath}/angular/serviceBrowserMenu/.json`, {
                params: {
                    angular: true,
                    serviceId: serviceId,
                    includeHoststatus: includeHoststatus,
                    includeServicestatus: includeServicestatus
                }
            })
            .pipe(
                map(data => {
                    return data.config;
                })
            )
    }
}
