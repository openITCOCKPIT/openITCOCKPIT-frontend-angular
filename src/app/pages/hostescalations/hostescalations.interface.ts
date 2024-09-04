import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';

export interface HostescalationsIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[Hostescalations.id][]': number[],
    'filter[Hostescalations.first_notification]': string,
    'filter[Hostescalations.last_notification]': string,
    'filter[Hostescalations.escalate_on_recovery]': string,
    'filter[Hostescalations.escalate_on_down]': string,
    'filter[Hostescalations.escalate_on_unreachable]': string,
    'filter[Hostescalations.notification_interval]': string,
    'filter[Hosts.name]': string,
    'filter[HostsExcluded.name]': string,
    'filter[Hostgroups.name]': string,
    'filter[HostgroupsExcluded.name]': string
}

export function getDefaultHostescalationsIndexParams(): HostescalationsIndexParams {
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[Hostescalations.id][]': [],
        'filter[Hostescalations.first_notification]': '',
        'filter[Hostescalations.last_notification]': '',
        'filter[Hostescalations.escalate_on_recovery]': '',
        'filter[Hostescalations.escalate_on_down]': '',
        'filter[Hostescalations.escalate_on_unreachable]': '',
        'filter[Hostescalations.notification_interval]': '',
        'filter[Hosts.name]': '',
        'filter[HostsExcluded.name]': '',
        'filter[Hostgroups.name]': '',
        'filter[HostgroupsExcluded.name]': ''
    }
}

export interface HostescalationIndexRoot extends PaginateOrScroll {
    all_hostescalations: HostescalationIndex[]
    _csrfToken: string
}

export interface HostescalationIndex {
    id: number
    first_notification: string
    last_notification: string
    escalate_on_recovery: string
    escalate_on_unreachable: string
    escalate_on_down: string
    notification_interval: any
    allowEdit: boolean
    timeperiod: HostescalationTimeperiod
    hosts: HostescalationHost[]
    hosts_excluded: HostescalationHost[]
    hostgroups: HostescalationHostgroup[]
    hostgroups_excluded: HostescalationHostgroup[]
    contacts: HostescalationContact[]
    contactgroups: HostescalationContactgroup[]
}

export interface HostescalationHostgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url: any
    _joinData: HostescalationHostgroupJoinData
    container: HostescalationContainer
}

export interface HostescalationHostgroupJoinData {
    id: number
    hostgroup_id: number
    hostescalation_id: number
    excluded: number
}

export interface HostescalationContainer {
    name: string
}

export interface HostescalationHostsJoinData {
    id: number
    host_id: number
    hostescalation_id: number
    excluded: number
}

export interface HostescalationHost {
    id: number
    name: string
    disabled: number
    _joinData: HostescalationHostsJoinData
}

export interface HostescalationTimeperiod {
    id: number
    name: string
}

export interface HostescalationContactgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    _joinData: HostescalationContactgroupJoinData
    container: HostescalationContainer
}

export interface HostescalationContactgroupJoinData {
    id: number
    contactgroup_id: number
    hostescalation_id: number
}


export interface HostescalationContact {
    id: number
    name: string
    _joinData: HostescalationContactJoinData
}

export interface HostescalationContactJoinData {
    id: number
    contact_id: number
    hostescalation_id: number
}

export interface HostescalationContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface HostescalationPost {
    id?: null | number
    uuid?: string
    container_id?: null | number
    first_notification: number
    last_notification: number
    notification_interval: number
    timeperiod_id?: null | number
    escalate_on_recovery: number
    escalate_on_down: number
    escalate_on_unreachable: number
    hosts: {
        _ids: number[]
    }
    hosts_excluded: {
        _ids: number[]
    }
    hostgroups: {
        _ids: number[]
    }
    hostgroups_excluded: {
        _ids: number[]
    }
    contacts: {
        _ids: number[]
    }
    contactgroups: {
        _ids: number[]
    }
}

export interface HostescalationGet {
    id?: null | number
    uuid?: string
    container_id?: null | number
    first_notification: number
    last_notification: number
    notification_interval: number
    timeperiod_id?: null | number
    escalate_on_recovery: number
    escalate_on_down: number
    escalate_on_unreachable: number
    hosts: HostescalationHost[]
    hosts_excluded: HostescalationHost[]
    hostgroups: HostescalationHostgroup[]
    hostgroups_excluded: HostescalationHostgroup[]
    contacts: HostescalationContactJoinData[]
    contactgroups: HostescalationContactgroupJoinData[]
}

export interface HostescalationElements {
    hosts: SelectKeyValueWithDisabled[]
    hostgroups: SelectKeyValueWithDisabled[]
    timeperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
}

export interface HostescalationHosts {
    hosts: SelectKeyValueWithDisabled[]
}

export interface HostescalationExcludedHosts {
    excludedHosts: SelectKeyValueWithDisabled[]
}

export interface HostescalationExcludedHostgroups {
    excludedHostgroups: SelectKeyValueWithDisabled[]
}

export interface HostescalationEditApiResult {
    hostescalation: HostescalationGet
}
