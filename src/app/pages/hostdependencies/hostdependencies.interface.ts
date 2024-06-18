import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';


export interface HostdependencyIndexRoot extends PaginateOrScroll {
    all_hostdependencies: HostdependencyIndex[]
    _csrfToken: string
}

export interface HostdependencyIndex {
    id: number
    uuid: string
    container_id: number
    inherits_parent: number
    timeperiod_id: number
    execution_fail_on_up: number
    execution_fail_on_down: number
    execution_fail_on_unreachable: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_up: number
    notification_fail_on_down: number
    notification_fail_on_unreachable: number
    notification_fail_on_pending: number
    notification_none: number
    created: string
    modified: string
    hostgroups_dependent: HostdependencyHostgroup[]
    hostgroups: HostdependencyHostgroup[]
    hosts_dependent: HostdependencyHost[]
    hosts: HostdependencyHost[]
    timeperiod: Timeperiod
    allowEdit: boolean
}


export interface HostdependencyHostgroupJoinData {
    id: number
    hostgroup_id: number
    hostdependency_id: number
    dependent: number
}

export interface Container {
    name: string
}

export interface HostdependencyHostgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url?: string
    _joinData: HostdependencyHostgroupJoinData
    container: Container
}


export interface HostdependencyHost {
    id: number
    name: string
    disabled: number
    _joinData: HostdependencyHostgJoinData
}

export interface HostdependencyHostgJoinData {
    id: number
    host_id: number
    hostdependency_id: number
    dependent: number
}

export interface Timeperiod {
    id: number
    name: string
}

export interface HostdependencyContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface HostdependencyEditApiResult {
    hostdependency: HostdependencyGet
}

export interface HostdependencyGet {
    id?: null | number
    container_id?: null | number
    timeperiod_id?: null | number
    execution_fail_on_up: number
    execution_fail_on_down: number
    execution_fail_on_unreachable: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_up: number
    notification_fail_on_down: number
    notification_fail_on_unreachable: number
    notification_fail_on_pending: number
    notification_none: number
    hosts: HostdependencyHost[]
    hosts_dependent: HostdependencyHost[]
    hostgroups: HostdependencyHostgroup[]
    hostgroups_dependent: HostdependencyHostgroup[]
}

export interface HostdependencyHosts {
    hosts: SelectKeyValueWithDisabled[]
}

export interface HostdependencyDependentHostgroups {
    dependentHostgroups: SelectKeyValueWithDisabled[]
}

export interface HostdependencyEditApiResult {
    hostdependency: HostdependencyGet
}

export interface HostdependenciesIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[Hostdependencies.id][]': number[],
    'filter[Hostdependencies.inherits_parent][0]': string | null,
    'filter[Hostdependencies.inherits_parent][1]': string | null,
    'filter[Hostdependencies.execution_fail_on_up]': string,
    'filter[Hostdependencies.execution_fail_on_down]': string,
    'filter[Hostdependencies.execution_fail_on_unreachable]': string,
    'filter[Hostdependencies.execution_fail_on_pending]': string,
    'filter[Hostdependencies.execution_none]': string,
    'filter[Hostdependencies.notification_fail_on_up]': string,
    'filter[Hostdependencies.notification_fail_on_down]': string,
    'filter[Hostdependencies.notification_fail_on_unreachable]': string,
    'filter[Hostdependencies.notification_fail_on_pending]': string,
    'filter[Hostdependencies.notification_none]': string,
    'filter[Hosts.name]': string,
    'filter[HostsDependent.name]': string,
    'filter[Hostgroups.name]': string,
    'filter[HostgroupsDependent.name]': string
}

export interface HostdependencyPost {
    id?: null | number
    container_id?: null | number
    inherits_parent: number
    timeperiod_id?: null | number
    execution_fail_on_up: number
    execution_fail_on_down: number
    execution_fail_on_unreachable: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_up: number
    notification_fail_on_down: number
    notification_fail_on_unreachable: number
    notification_fail_on_pending: number
    notification_none: number
    hosts: {
        _ids: number[]
    }
    hosts_dependent: {
        _ids: number[]
    }
    hostgroups: {
        _ids: number[]
    }
    hostgroups_dependent: {
        _ids: number[]
    }
}

export interface HostdependencyElements {
    hosts: SelectKeyValueWithDisabled[]
    hostsDependent: SelectKeyValueWithDisabled[]
    hostgroups: SelectKeyValueWithDisabled[]
    hostgroupsDependent: SelectKeyValueWithDisabled[]
    timeperiods: SelectKeyValue[]
}

export function getDefaultHostdependenciesIndexParams(): HostdependenciesIndexParams {
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[Hostdependencies.id][]': [],
        'filter[Hostdependencies.inherits_parent][0]': '',
        'filter[Hostdependencies.inherits_parent][1]': '',
        'filter[Hostdependencies.execution_fail_on_up]': '',
        'filter[Hostdependencies.execution_fail_on_down]': '',
        'filter[Hostdependencies.execution_fail_on_unreachable]': '',
        'filter[Hostdependencies.execution_fail_on_pending]': '',
        'filter[Hostdependencies.execution_none]': '',
        'filter[Hostdependencies.notification_fail_on_up]': '',
        'filter[Hostdependencies.notification_fail_on_down]': '',
        'filter[Hostdependencies.notification_fail_on_unreachable]': '',
        'filter[Hostdependencies.notification_fail_on_pending]': '',
        'filter[Hostdependencies.notification_none]': '',
        'filter[Hosts.name]': '',
        'filter[HostsDependent.name]': '',
        'filter[Hostgroups.name]': '',
        'filter[HostgroupsDependent.name]': ''
    }
}
