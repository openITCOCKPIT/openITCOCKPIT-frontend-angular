import { Sla } from '../slas/slas.interface';
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { HostsToContainersSharing } from '../../../../pages/hosts/hosts.interface';
import { HosttemplateEntity } from '../../../../pages/hosttemplates/hosttemplates.interface';
import { ServicetemplateEntity } from '../../../../pages/servicetemplates/servicetemplates.interface';


export interface HostMappingRulesPost {
    host_keywords: null | string | string[]
    host_not_keywords: null | string | string[]
    hostname_regex: string
    description: string
    service_keywords: null | string | string[]
    service_not_keywords: null | string | string[]
    servicename_regex: string
    save_options: boolean
    sla_id: number
    only_unassigned: boolean
    filter?: HostMappingRuleFilter
    hostgroups: {
        _ids: number[]
    }
    servicegroups: {
        _ids: number[]
    }
}

export interface HostMappingRuleFilter {
    'Hosts.name': string
    'Hosts.keywords': null | string | string[]
    'Hosts.not_keywords': null | string | string[]
    'servicename': string
    'Services.keywords': null | string | string[]
    'Services.not_keywords': null | string | string[]
    'Hostgroups.id[]': number[]
    'Servicegroups.id[]': number[]
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
        only_unassigned: true,
        hostgroups: {
            _ids: []
        },
        servicegroups: {
            _ids: []
        },
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
    'filter[Hosts.keywords][]': null | string | string[]
    'filter[Hosts.not_keywords][]': null | string | string[]
    'filter[servicename]': string
    'filter[Services.keywords][]': null | string | string[]
    'filter[Services.not_keywords][]': null | string | string[]
    'filter[Hostgroups.id][]': number[]
    'filter[Servicegroups.id][]': number[],
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
        'filter[Hostgroups.id][]': [],
        'filter[Servicegroups.id][]': [],
        resolveContainerIds: true,
        onlyUnassigned: true

    }
}

export interface LoadHostsRoot extends PaginateOrScroll {
    hosts: SlaHostEntity[]
    _csrfToken: string;
}

export interface SlaHostEntity {
    id: number
    name: string
    address: string
    sla_id: number
    hostdescription: string
    hosttags: string
    container: string
    primary_container: string
    services: SlaServiceEntity[]
    hosttemplate: HosttemplateEntity
    hosts_to_containers_sharing: HostsToContainersSharing[]
    sla: Sla
}

export interface SlaServiceEntity {
    id: number
    host_id: number
    servicename: string
    description: any
    servicetags: string
    sla_relevant: any
    is_sla_relevant: number | string
    servicetemplate: ServicetemplateEntity
}
