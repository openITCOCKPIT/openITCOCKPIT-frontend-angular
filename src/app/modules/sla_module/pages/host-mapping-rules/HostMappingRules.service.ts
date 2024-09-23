/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
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
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    HostMappingRulesAssignToHostsRoot,
    HostMappingRulesLoadHostsParams,
    HostMappingRulesPost,
    LoadHostsRoot
} from './HostMappingRules.interface';

@Injectable({
    providedIn: 'root'
})
export class HostMappingRulesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public loadAssignToHosts(id: number): Observable<HostMappingRulesAssignToHostsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostMappingRulesAssignToHostsRoot>(`${proxyPath}/sla_module/host_mapping_rules/assignToHosts/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadHosts(params: HostMappingRulesLoadHostsParams): Observable<LoadHostsRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadHostsRoot>(`${proxyPath}/sla_module/host_mapping_rules/loadHostsBySlaId.json`, {
            params: params as {}
        }).pipe(
            map((data: LoadHostsRoot) => {
                return data;
            })
        )
    }

    public assignToHosts(post: HostMappingRulesPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/sla_module/host_mapping_rules/assignToHosts/${id}.json?angular=true`, post)
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
