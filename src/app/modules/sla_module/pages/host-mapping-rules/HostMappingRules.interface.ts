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

import { Sla } from '../slas/Slas.interface';
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface HostMappingRulesPost {
    host_keywords: null | string[]
    host_not_keywords: null | string[]
    hostname_regex: string
    description: string
    service_keywords: null | string[]
    service_not_keywords: null | string[]
    servicename_regex: string
    save_options: boolean
    sla_id: number
    only_unassigned: boolean
    filter?: Filter
}

export interface Filter {
    'Hosts.name': string
    'Hosts.keywords': any[]
    'Hosts.not_keywords': any[]
    'servicename': string
    'Services.keywords': any[]
    'Services.not_keywords': any[]
}

export interface HostMappingRulesAssignToHostsRoot {
    sla: Sla
    _csrfToken: string;
}

export function getDefaultHostMappingRulesPost(id: number): HostMappingRulesPost {
    return {
        host_keywords: null,
        host_not_keywords: null,
        hostname_regex: '',
        description: '',
        service_keywords: null,
        service_not_keywords: null,
        servicename_regex: '',
        save_options: false,
        sla_id: id,
        only_unassigned: true

    }
}

export interface HostMappingRulesLoadHostsParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc' | '' // asc or desc
    slaId: number
    'filter[Hosts.name]': string
    'filter[hostdescription]': string
    'filter[Hosts.keywords][]': string[]
    'filter[Hosts.not_keywords][]': string[]
    'filter[servicename]': string
    'filter[Services.keywords][]': string[]
    'filter[Services.not_keywords][]': string[]
    resolveContainerIds: true
    onlyUnassigned: boolean
}

export function getDefaultHostMappingRulesLoadHostsParams(id: number): HostMappingRulesLoadHostsParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        slaId: id,
        'filter[Hosts.name]': '',
        'filter[hostdescription]': '',
        'filter[Hosts.keywords][]': [],
        'filter[Hosts.not_keywords][]': [],
        'filter[servicename]': '',
        'filter[Services.keywords][]': [],
        'filter[Services.not_keywords][]': [],
        resolveContainerIds: true,
        onlyUnassigned: true

    }
}

export interface LoadHostsRoot extends PaginateOrScroll {
    hosts: Host[]
    _csrfToken: string;
}

export interface Host {
    id: number
    name: string
    address: string
    sla_id: number
    hostdescription: string
    hosttags: string
    container: string
    primary_container: string
    services: Service[]
    hosttemplate: Hosttemplate
    hosts_to_containers_sharing: HostsToContainersSharing[]
    sla: Sla
}

export interface Service {
    id: number
    host_id: number
    servicename: string
    description: any
    servicetags: string
    sla_relevant: any
    is_sla_relevant: number
    servicetemplate: Servicetemplate
}

export interface Servicetemplate {
    id: number
    sla_relevant: number
}

export interface Hosttemplate {
    id: number
    sla_id: any
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    host_id: number
    container_id: number
}

