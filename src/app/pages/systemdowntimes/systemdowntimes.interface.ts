import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**
 * Hosts list
 */
export interface SystemdowntimeHostIndexRoot extends PaginateOrScroll {
    all_host_recurring_downtimes: HostSystemdowntime[]
    _csrfToken: string
}

export interface HostSystemdowntime {
    Host: SystemdowntimeHost
    Systemdowntime: Systemdowntime
}

export interface SystemdowntimeHost {
    id: string
    uuid: string
    hostname: string
    address: any
    description: any
    hosttemplate_id: any
    active_checks_enabled: any
    satelliteId: any
    containerId: any
    containerIds: any
    tags: any
    usageFlag: any
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

/**
 * Services list
 */

export interface SystemdowntimeServiceIndexRoot extends PaginateOrScroll {
    all_service_recurring_downtimes: ServiceSystemdowntime[]
    _csrfToken: string
}

export interface ServiceSystemdowntime {
    Host: SystemdowntimeHost
    Service: SystemdowntimeService
    Systemdowntime: Systemdowntime
}

export interface SystemdowntimeService {
    id: string
    uuid: string
    servicename: string
    hostname: any
    description: any
    active_checks_enabled: any
    tags: any
    host_id: any
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: any
}

/**
 * Host groups list
 */

export interface SystemdowntimeHostgroupIndexRoot extends PaginateOrScroll {
    all_hostgroup_recurring_downtimes: HostgroupSystemdowntime[]
    _csrfToken: string
}

export interface HostgroupSystemdowntime {
    Container: SystemdowntimeHostgroupContainer
    Hostgroup: SystemdowntimeHostgroup
    Systemdowntime: Systemdowntime
}

export interface SystemdowntimeHostgroupContainer {
    id: number
    containertype_id: number
    name: string
}

export interface SystemdowntimeHostgroup {
    id: number
    uuid: string
    description: string
    container_id: number
    container: SystemdowntimeHostgroupContainer
    allow_edit: boolean
}

/**
 * Node list
 */

export interface SystemdowntimeNodeIndexRoot extends PaginateOrScroll {
    all_node_recurring_downtimes: NodeSystemdowntime[]
    _csrfToken: string
}

export interface NodeSystemdowntime {
    Container: SystemdowntimeNode
    Systemdowntime: Systemdowntime
}

export interface SystemdowntimeNode {
    id: number
    containertype_id: number
    name: string
    allow_edit: boolean
}


export interface SystemdowntimesPost {
    id?: null | number
    is_recurring: number
    weekdays: number[]
    day_of_month?: string
    from_date: Date | string
    from_time: Date | string
    to_date: Date | string
    to_time: Date | string
    duration: number
    downtime_type: string
    downtimetype_id: number | string
    objecttype_id: number
    object_id: number[]
    comment: string
    is_recursive: number
}

export interface SystemdowntimesGet {
    defaultValues: {
        js_from: string
        js_to: string
        from_date: string
        from_time: string
        to_date: string
        to_time: string
        duration: number
        comment: string
        downtimetype_id: string
        object_id: number[]
    }
}

export interface Systemdowntime {
    id: number
    objecttypeId: number
    objectId: number
    downtimeTypeId: number
    weekdays: string[]
    weekdaysHuman: string[]
    dayOfMonth: string[]
    startTime: string
    duration: number
    comment: string
    author: string
    UserTime: {}
}

export interface HostSystemdowntimesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Systemdowntimes.author]': '',
    'filter[Systemdowntimes.comment]': '',
    'filter[Hosts.name]': ''
}

export function getDefaultHostSystemdowntimesParams(): HostSystemdowntimesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Systemdowntimes.from_time',
        page: 1,
        direction: 'desc',
        'filter[Systemdowntimes.author]': '',
        'filter[Systemdowntimes.comment]': '',
        'filter[Hosts.name]': ''
    }
}

export interface ServiceSystemdowntimesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Systemdowntimes.author]': '',
    'filter[Systemdowntimes.comment]': '',
    'filter[Hosts.name]': '',
    'filter[servicename]': ''
}

export function getDefaultServiceSystemdowntimesParams(): ServiceSystemdowntimesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Systemdowntimes.from_time',
        page: 1,
        direction: 'desc',
        'filter[Systemdowntimes.author]': '',
        'filter[Systemdowntimes.comment]': '',
        'filter[Hosts.name]': '',
        'filter[servicename]': ''
    }
}

/* Host group and container params are the same */
export interface ContainerSystemdowntimesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Systemdowntimes.author]': '',
    'filter[Systemdowntimes.comment]': '',
    'filter[Containers.name]': ''
}

export function getDefaultContainerSystemdowntimesParams(): ContainerSystemdowntimesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Systemdowntimes.from_time',
        page: 1,
        direction: 'desc',
        'filter[Systemdowntimes.author]': '',
        'filter[Systemdowntimes.comment]': '',
        'filter[Containers.name]': ''
    }
}
