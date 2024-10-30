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

import {inject, Injectable} from '@angular/core';
import {DeleteAllItem} from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PROXY_PATH} from '../../tokens/proxy-path.token';
import {SelectKeyValue} from '../../layouts/primeng/select.interface';
import {GenericIdResponse, GenericResponseWrapper, GenericValidationError} from '../../generic-responses';
import {
    StatuspagesParams,
    StatuspagesIndexRoot
}
    from './statuspages.interface';
import {
    StatuspageRoot,
    SelectValueExtended,
    PostParams, StatuspagePost
}
    from './statuspage.interface';

@Injectable({
    providedIn: 'root'
})
export class StatuspagesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor () {
    }

    public getStatuspagesIndex (params: StatuspagesParams): Observable<StatuspagesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuspagesIndexRoot>(`${proxyPath}/statuspages/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getStatuspageViewData (statuspageId: number): Observable<StatuspageRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuspageRoot>(`${proxyPath}/statuspages/view/${statuspageId}.json`, {
            params: {'angular': true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainers (): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/statuspages/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        )
    }

    public loadHostgroups (containerId: number, search: string, selected: number[]): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hostgroups: SelectKeyValue[]
        }>(`${proxyPath}/hostgroups/loadHostgroupsByStringAndContainers.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Containers.name]': search,
                'selected[]': selected,
                'resolveContainerIds': true

            }
        }).pipe(
            map(data => {
                return data.hostgroups
            })
        )
    }

    public loadServicegroups (containerId: number, search: string, selected: number[]): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            servicegroups: SelectKeyValue[]
        }>(`${proxyPath}/servicegroups/loadServicegroupsByContainerId.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Containers.name]': search,
                'selected[]': selected,
                'resolveContainerIds': true

            }
        }).pipe(
            map(data => {
                return data.servicegroups
            })
        )
    }

    public loadHosts (containerId: number, search: string, selected: number[]): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${proxyPath}/hosts/loadHostsByContainerId.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Hosts.name]': search,
                'selected[]': selected,
                'resolveContainerIds': true

            }
        }).pipe(
            map(data => {
                return data.hosts
            })
        )
    }

    public loadServices (containerId: number, search: string, selected: number[]): Observable<SelectValueExtended[]> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            services: SelectValueExtended[]
        }>(`${proxyPath}/services/loadServicesByContainerIdCake4.json?angular=true`, {
            params: {
                'containerId': containerId,
                'filter': {
                    'servicename': search,
                },
                'selected': selected
            }
        }).pipe(
            map(data => {
                return data.services
            })
        )
    }

    public addStatuspage (params: StatuspagePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericIdResponse>(`${proxyPath}/statuspages/add.json?angular=true`, {Statuspage: params})
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

    public editStatuspage(id: number): Observable<StatuspagePost>  {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/statuspages/edit/${id}.json`, {params: {angular: true}})
            .pipe(
                map(data => {
                    return data.statuspage.Statuspage;
                }),
            );
    }

    public updateStatuspage(id: number, params: StatuspagePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericIdResponse>(`${proxyPath}/statuspages/edit/${id}.json?angular=true`, {Statuspage: params})
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


    public delete (item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/statuspages/delete/${item.id}.json?angular=true`, {});
    }
}
