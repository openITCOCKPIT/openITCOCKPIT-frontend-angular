import { PerfParams } from '../../../../components/popover-graph/popover-graph.interface';

export interface GraphItemParams {
    angular: true,
    disableGlobalLoader: true,
    serviceId: number,
    type: string
}

export interface UserTimezoneParams {
    angular: true,
    disableGlobalLoader: true
}

export interface PerfdataParams extends PerfParams {
    disableGlobalLoader: true
}

export interface GraphItemRoot {
    allowView: boolean
    host: Host
    service: Service
    _csrfToken: string
}

export interface Host {
    id: number
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

export interface Service {
    id: number
    uuid: string
    servicename: string
    hostname: string
    description: any
    active_checks_enabled: any
    tags: any
    host_id: number
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: any
}

export interface UserTimezoneRoot {
    timezone: Timezone
    _csrfToken: string
}

export interface Timezone {
    user_timezone: string
    user_time_to_server_offset: number
    user_offset: number
    server_time_utc: number
    server_time: string
    server_timezone_offset: number
    server_time_iso: string
    server_timezone: string
}

export interface Setup {
    metric: Metric
    scale: Scale
    warn: Warn
    crit: Crit
}

export interface Metric {
    value: number
    unit: string
    name: string
}

export interface Scale {
    min: number
    max: number
    type: string
}

export interface Warn {
    low: number | null
    high: any
}

export interface Crit {
    low: number | null
    high: any
}
