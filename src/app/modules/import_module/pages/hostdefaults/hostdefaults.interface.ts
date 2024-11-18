import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface HostDefaultsIndexRoot extends PaginateOrScroll {
    hostdefaults: Hostdefault[]
    _csrfToken: any
}

export interface Hostdefault {
    id: number
    name: string
    container_id: number
    description: string
    hosttemplate_id: number
    satellite_id: number
    container: string
    allowEdit: boolean
}

export interface HostDefaultsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hostdefaults.id][]': [],
    'filter[Hostdefaults.name]': string
    'filter[Hostdefaults.description]': string
}

export function getDefaultHostDefaultsIndexParams(): HostDefaultsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hostdefaults.name',
        page: 1,
        direction: 'asc',
        'filter[Hostdefaults.id][]': [],
        'filter[Hostdefaults.name]': '',
        'filter[Hostdefaults.description]': ''
    }
}

export interface HostDefaultsPost {
    id?: number
    container_id: number | null
    name: string
    description: string
    hosttemplate_id: number
    satellite_id: number
    host_container_id: number | null
    hostdefaults_to_containers_sharing: {
        _ids: number[]
    }
    hostdefaults_to_servicetemplates: HostdefaultsToServicetemplates[]
    hostdefaults_to_servicetemplategroups: HostdefaultsToServicetemplategroups[]
    hostdefaults_to_agentchecks: HostdefaultsToAgentchecks[]
    hostdefaults_to_servicetemplates_external_monitoring: HostdefaultsToExternalmonitorings[]
}

export interface HostDefaultsGet {
    hostdefault: HostDefaultsPost
}

export interface HostdefaultsToServicetemplates {
    id?: number
    servicetemplate_id: number | null
    field: string
    regex: string
    index?: number
}

export interface HostdefaultsToServicetemplategroups {
    id?: number
    servicetemplategroup_id: number | null
    field: string
    regex: string
    index?: number
}

export interface HostdefaultsToAgentchecks {
    id?: number
    agentcheck_id: number | null
    regex: string
    index?: number
}

export interface HostdefaultsToExternalmonitorings {
    id?: number
    regex: string
    servicetemplate_id: number | null
    index?: number
}


export interface HostDefaultsElements {
    sharingContainers: SelectKeyValue[]
    hosttemplates: SelectKeyValue[]
    servicetemplates: SelectKeyValue[]
    servicetemplategroups: SelectKeyValue[]
    satellites: SelectKeyValue[]
    agentchecks: SelectKeyValue[]
}
