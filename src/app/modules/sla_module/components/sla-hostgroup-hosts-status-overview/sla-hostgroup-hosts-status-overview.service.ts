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
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    LoadContainersRoot,
    SlaHostgroupHostsStatusOverviewParams,
    SlaHostgroupHostsStatusOverviewRoot
} from './sla-hostgroup-hosts-status-overview.interface';

@Injectable({
    providedIn: 'root',
})

export class SlaHostgroupHostsStatusOverviewService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public loadSlaHostgroupHostsStatusOverview(id: number, params: SlaHostgroupHostsStatusOverviewParams): Observable<SlaHostgroupHostsStatusOverviewRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<SlaHostgroupHostsStatusOverviewRoot>(`${proxyPath}/sla_module/slas/slaHostgroupHostsStatusOverview/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/containers/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

}
