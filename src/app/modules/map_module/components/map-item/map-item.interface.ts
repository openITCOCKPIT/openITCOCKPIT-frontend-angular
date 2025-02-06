export interface MapItemRootParams {
    angular: true,
    disableGlobalLoader: true,
    objectId: number,
    mapId: number,
    type: string
}

export interface MapItemRoot {
    type: string
    allowView: boolean
    data: Data
    _csrfToken: string
}

export interface Data {
    icon: string
    icon_property: string
    isAcknowledged: boolean
    isInDowntime: boolean
    color: string
    background: string
    Host: Host
    Hoststatus: Hoststatus
    Service: Service
    Perfdata: Perfdata
    Servicestatus: Servicestatus
    Hostgroup: Hostgroup
    Servicegroup: Servicegroup
    Map: Map
}

export interface Host {
    id: number
    uuid: string
    hostname: string
    address: string
    description: string
    hosttemplate_id: number
    active_checks_enabled: boolean
    satelliteId: number
    containerId: number
    containerIds: number[]
    tags: string
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    priority: number
    notes: string
    is_satellite_host: boolean
    name: string
}

export interface Hoststatus {
    currentState: number
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: number
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    acknowledgement_type: any
    state_type: any
    flap_detection_enabled: number
    notifications_enabled: number
    current_check_attempt: any
    max_check_attempts: number
    latency: any
    last_time_up: string
    UserTime: any
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
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

export interface Perfdata {
    [key: string]: PerformanceData
}

export interface PerformanceData {
    current: string
    unit: string
    warning: string
    critical: string
    min: string
    max: string
    metric: string
    datasource: Datasource
}

export interface Datasource {
    setup: Setup
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
    low: number
    high: any
}

export interface Crit {
    low: number
    high: any
}

export interface Servicestatus {
    currentState: number
    lastHardState: any
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: any
    nextCheck: any
    activeChecksEnabled: any
    lastHardStateChange: any
    last_state_change: any
    processPerformanceData: any
    state_type: any
    acknowledgement_type: any
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: any
    output: any
    long_output: any
    perfdata: string
    latency: any
    max_check_attempts: any
    last_time_ok: any
    UserTime: any
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

export interface Hostgroup {
    id: number
    name: string
    description: string
}

export interface Servicegroup {
    id: number
    name: string
    description: string
}

export interface Map {
    id: number
    name: string
    title: string
}

