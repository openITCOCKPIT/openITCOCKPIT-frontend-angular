export interface PerfdataTextItemRootParams {
    angular: true,
    disableGlobalLoader: true,
    objectId: number,
    mapId: number,
    type: string
}

export interface PerfdataTextItemRoot {
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
    Service: Service
    Perfdata: Perfdata
    Servicestatus: Servicestatus
}

export interface Host {
    id: number
    uuid: string
    hostname: string
    address: string
    description: any
    hosttemplate_id: any
    active_checks_enabled: any
    satelliteId: any
    containerId: number
    containerIds: number[]
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

export interface Perfdata {
    load1: Load1
    load5: Load5
    load15: Load15
}

export interface Load1 {
    current: string
    unit: any
    warning: string
    critical: string
    min: string
    max: any
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

export interface Load5 {
    current: string
    unit: any
    warning: string
    critical: string
    min: string
    max: any
    metric: string
    datasource: Datasource2
}

export interface Datasource2 {
    setup: Setup2
}

export interface Setup2 {
    metric: Metric2
    scale: Scale2
    warn: Warn2
    crit: Crit2
}

export interface Metric2 {
    value: number
    unit: string
    name: string
}

export interface Scale2 {
    min: any
    max: any
    type: string
}

export interface Warn2 {
    low: number
    high: any
}

export interface Crit2 {
    low: number
    high: any
}

export interface Load15 {
    current: string
    unit: any
    warning: string
    critical: string
    min: string
    max: any
    metric: string
    datasource: Datasource3
}

export interface Datasource3 {
    setup: Setup3
}

export interface Setup3 {
    metric: Metric3
    scale: Scale3
    warn: Warn3
    crit: Crit3
}

export interface Metric3 {
    value: number
    unit: string
    name: string
}

export interface Scale3 {
    min: any
    max: any
    type: string
}

export interface Warn3 {
    low: number
    high: any
}

export interface Crit3 {
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

