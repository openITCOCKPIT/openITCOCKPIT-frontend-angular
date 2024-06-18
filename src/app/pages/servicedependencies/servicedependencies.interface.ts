import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';


export interface ServicedependencyIndexRoot extends PaginateOrScroll {
    all_servicedependencies: ServicedependencyIndex[]
    _csrfToken: string
}

export interface ServicedependencyIndex {
    id: number
    uuid: string
    container_id: number
    inherits_parent: number
    timeperiod_id: number
    execution_fail_on_ok: number
    execution_fail_on_warning: number
    execution_fail_on_critical: number
    execution_fail_on_unknown: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_ok: number
    notification_fail_on_warning: number
    notification_fail_on_critical: number
    notification_fail_on_unknown: number
    notification_fail_on_pending: number
    notification_none: number
    created: string
    modified: string
    servicegroups_dependent: ServicedependencyServicegroup[]
    servicegroups: ServicedependencyServicegroup[]
    services_dependent: ServicedependencyService[]
    services: ServicedependencyService[]
    timeperiod: Timeperiod
    allowEdit: boolean
}


export interface ServicedependencyServicegroupJoinData {
    id: number
    servicegroup_id: number
    servicedependency_id: number
    dependent: number
}

export interface Container {
    name: string
}

export interface ServicedependencyServicegroup {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url?: string
    _joinData: ServicedependencyServicegroupJoinData
    container: Container
}


export interface ServicedependencyService {
    id: number
    servicename: string
    disabled: number
    _joinData: ServicedependencyServicegJoinData
}

export interface ServicedependencyServicegJoinData {
    id: number
    service_id: number
    servicedependency_id: number
    dependent: number
}

export interface Timeperiod {
    id: number
    name: string
}

export interface ServicedependencyContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface ServicedependencyEditApiResult {
    servicedependency: ServicedependencyGet
}

export interface ServicedependencyGet {
    id?: null | number
    container_id?: null | number
    inherits_parent: number
    timeperiod_id?: null | number
    execution_fail_on_ok: number
    execution_fail_on_warning: number
    execution_fail_on_critical: number
    execution_fail_on_unknown: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_ok: number
    notification_fail_on_warning: number
    notification_fail_on_critical: number
    notification_fail_on_unknown: number
    notification_fail_on_pending: number
    notification_none: number
    services: ServicedependencyService[]
    services_dependent: ServicedependencyService[]
    servicegroups: ServicedependencyServicegroup[]
    servicegroups_dependent: ServicedependencyServicegroup[]
}

export interface ServicedependencyServices {
    services: SelectKeyValueWithDisabled[]
}

export interface ServicedependencyDependentServicegroups {
    dependentServicegroups: SelectKeyValueWithDisabled[]
}

export interface ServicedependencyEditApiResult {
    servicedependency: ServicedependencyGet
}

export interface ServicedependenciesIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[Servicedependencies.id][]': number[],
    'filter[Servicedependencies.inherits_parent][0]': string | null,
    'filter[Servicedependencies.inherits_parent][1]': string | null,
    'filter[Servicedependencies.execution_fail_on_ok]': string,
    'filter[Servicedependencies.execution_fail_on_warning]': string,
    'filter[Servicedependencies.execution_fail_on_critical]': string,
    'filter[Servicedependencies.execution_fail_on_unknown]': string,
    'filter[Servicedependencies.execution_fail_on_pending]': string,
    'filter[Servicedependencies.execution_none]': string,
    'filter[Servicedependencies.notification_fail_on_ok]': string,
    'filter[Servicedependencies.notification_fail_on_warning]': string,
    'filter[Servicedependencies.notification_fail_on_critical]': string,
    'filter[Servicedependencies.notification_fail_on_unknown]': string,
    'filter[Servicedependencies.notification_fail_on_pending]': string,
    'filter[Servicedependencies.notification_none]': string,
    'filter[Services.servicename]': string,
    'filter[ServicesDependent.servicename]': string,
    'filter[Servicegroups.name]': string,
    'filter[ServicegroupsDependent.name]': string
}

export interface ServicedependencyPost {
    id?: null | number
    container_id?: null | number
    inherits_parent: number
    timeperiod_id?: null | number
    execution_fail_on_ok: number
    execution_fail_on_warning: number
    execution_fail_on_critical: number
    execution_fail_on_unknown: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_ok: number
    notification_fail_on_warning: number
    notification_fail_on_critical: number
    notification_fail_on_unknown: number
    notification_fail_on_pending: number
    notification_none: number
    services: {
        _ids: number[]
    }
    services_dependent: {
        _ids: number[]
    }
    servicegroups: {
        _ids: number[]
    }
    servicegroups_dependent: {
        _ids: number[]
    }
}

export interface ServicedependencyElements {
    services: SelectKeyValueWithDisabled[]
    servicesDependent: SelectKeyValueWithDisabled[]
    servicegroups: SelectKeyValueWithDisabled[]
    servicegroupsDependent: SelectKeyValueWithDisabled[]
    timeperiods: SelectKeyValue[]
}

export function getDefaultServicedependenciesIndexParams(): ServicedependenciesIndexParams {
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[Servicedependencies.id][]': [],
        'filter[Servicedependencies.inherits_parent][0]': '',
        'filter[Servicedependencies.inherits_parent][1]': '',
        'filter[Servicedependencies.execution_fail_on_ok]': '',
        'filter[Servicedependencies.execution_fail_on_warning]': '',
        'filter[Servicedependencies.execution_fail_on_critical]': '',
        'filter[Servicedependencies.execution_fail_on_unknown]': '',
        'filter[Servicedependencies.execution_fail_on_pending]': '',
        'filter[Servicedependencies.execution_none]': '',
        'filter[Servicedependencies.notification_fail_on_ok]': '',
        'filter[Servicedependencies.notification_fail_on_warning]': '',
        'filter[Servicedependencies.notification_fail_on_critical]': '',
        'filter[Servicedependencies.notification_fail_on_unknown]': '',
        'filter[Servicedependencies.notification_fail_on_pending]': '',
        'filter[Servicedependencies.notification_none]': '',
        'filter[Services.servicename]': '',
        'filter[ServicesDependent.servicename]': '',
        'filter[Servicegroups.name]': '',
        'filter[ServicegroupsDependent.name]': ''
    }
}
