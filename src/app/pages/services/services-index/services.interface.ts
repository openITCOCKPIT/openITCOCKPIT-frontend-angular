export interface ServiceParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Hosts.id]': number[],
    'filter[Hosts.name]': string,
    'filter[Hosts.name_regex]': boolean | string,
    'filter[Hosts.satellite_id][]': number[],
    'filter[Services.id][]': number[],
    'filter[Services.service_type][]': number[],
    'filter[servicename]': string,
    'filter[servicename_regex]': boolean | string,
    'filter[servicedescription]': string,
    'filter[Servicestatus.output]': string,
    'filter[Servicestatus.current_state][]': string[],
    'filter[keywords][]': string[],
    'filter[not_keywords][]': string[],
    'filter[Servicestatus.problem_has_been_acknowledged]': boolean | string,
    'filter[Servicestatus.scheduled_downtime_depth]': boolean | string,
    'filter[Servicestatus.active_checks_enabled]': boolean |string,
    'filter[Servicestatus.notifications_enabled]': boolean | string,
    'filter[servicepriority][]': number[]
}

export interface filter {
    Servicestatus: {
        current_state: string[],
        acknowledged: boolean,
        not_acknowledged: boolean,
        in_downtime: boolean,
        not_in_downtime: boolean,
        passive: boolean ,
        active: boolean ,
        notifications_enabled: boolean ,
        notifications_not_enabled: boolean,
        output: string,
    },
    Services: {
        id: number[],
        name: string,
        name_regex: boolean | string,
        keywords:string[],
        not_keywords: string[],
        servicedescription: string,
        priority: {
            1: boolean,
            2: boolean,
            3: boolean,
            4: boolean,
            5: boolean
        },
        service_type: number[]
    },
    Hosts: {
        id: number[],
        name: string,
        name_regex: boolean | string,
        satellite_id: number[]
    }
}

export interface ServicesIndexRoot {
    all_services: AllService[]
    _csrfToken: string
    scroll: Scroll
}

export interface AllService {
    Service: Service
    Host: Host
    Hoststatus: Hoststatus
    Servicestatus: Servicestatus
    ServiceType: ServiceType
    Downtime: any[]
    Acknowledgement: any[]
}

export interface Service {
    id: number
    uuid: string
    servicename: string
    hostname: string
    description: any
    active_checks_enabled: boolean
    tags?: string
    host_id: number
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: number
    has_graph: boolean
}

export interface Host {
    id: number
    uuid: string
    hostname: string
    address: string
    description: any
    hosttemplate_id: any
    active_checks_enabled: any
    satelliteId: number
    containerId: any
    containerIds: any
    tags?: any
    usageFlag: any
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
    satelliteName: string
}

export interface Hoststatus {
    currentState: number
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: any
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    acknowledgement_type: any
    state_type: boolean
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: any
    max_check_attempts: any
    latency: any
    last_time_up: string
    lastHardStateChangeInWords: string
    last_state_change_in_words: string
    lastCheckInWords: string
    nextCheckInWords: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

export interface Servicestatus {
    currentState: number
    lastHardState: any
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: number
    lastHardStateChange: string
    last_state_change: string
    processPerformanceData: any
    state_type: number
    acknowledgement_type: number
    flap_detection_enabled: any
    notifications_enabled: boolean
    current_check_attempt: any
    output: string
    long_output: any
    perfdata: string
    latency: any
    max_check_attempts: any
    last_time_ok: string
    lastHardStateChangeInWords: string
    last_state_change_in_words: string
    lastCheckInWords: string
    nextCheckInWords: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

export interface ServiceType {
    title: string
    color: string
    class: string
    icon: string
}

export interface Scroll {
    page: number
    limit: number
    offset: number
    hasPrevPage: boolean
    prevPage: number
    nextPage: number
    current: number
    hasNextPage: boolean
}

export interface Usertimezone {
    timezone: TimezoneObject
    _csrfToken: string
}

export interface TimezoneObject {
    user_timezone: string
    user_time_to_server_offset: number
    user_offset: number
    server_time_utc: number
    server_time: string
    server_timezone_offset: number
    server_time_iso: string
    server_timezone: string
}
