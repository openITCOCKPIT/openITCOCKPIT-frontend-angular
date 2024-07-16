import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { HostObject } from '../hosts/hosts.interface';

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
