export interface ServicesBrowser {
    mergedService: MergedService
    serviceType: ServiceType
    host: Host
    areContactsFromService: boolean
    areContactsInheritedFromHosttemplate: boolean
    areContactsInheritedFromHost: boolean
    areContactsInheritedFromServicetemplate: boolean
    hoststatus: Hoststatus
    servicestatus: Servicestatus
    acknowledgement: any[]
    downtime: any[]
    hostDowntime: any[]
    hostAcknowledgement: any[]
    checkCommand: CheckCommand
    checkPeriod: CheckPeriod
    notifyPeriod: NotifyPeriod
    canSubmitExternalCommands: boolean
    mainContainer: MainContainer[]
    sharedContainers: any[]
    objects: Objects
    usageFlag: number
    _csrfToken: string
}

export interface MergedService {
    id: number
    uuid: string
    servicetemplate_id: number
    host_id: number
    name: string
    description: string
    command_id: number
    check_command_args: string
    eventhandler_command_id: number
    notify_period_id: number
    check_period_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_warning: number
    notify_on_unknown: number
    notify_on_critical: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    is_volatile: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number
    flap_detection_on_unknown: number
    flap_detection_on_critical: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_checks_enabled: number
    freshness_threshold: any
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    notifications_enabled: number
    notes: string
    priority: number
    tags: string
    own_contacts: number
    own_contactgroups: number
    own_customvariables: number
    service_url: string
    service_type: number
    disabled: number
    usage_flag: number
    created: string
    modified: string
    serviceeventcommandargumentvalues: any[]
    servicecommandargumentvalues: Servicecommandargumentvalue[]
    customvariables: Customvariable[]
    servicegroups: Servicegroup[]
    contacts: Contact[]
    contactgroups: any[]
    service_url_replaced: string
    serviceCommandLine: string
    checkIntervalHuman: string
    retryIntervalHuman: string
    notificationIntervalHuman: string
    allowEdit: boolean
    has_graph: boolean
    Perfdata: any[]
}

export interface Servicecommandargumentvalue {
    id: number
    commandargument_id: number
    servicetemplate_id: number
    value: string
    created: string
    modified: string
    commandargument: Commandargument
}

export interface Commandargument {
    id: number
    command_id: number
    name: string
    human_name: string
    created: string
    modified: string
}

export interface Customvariable {
    id: number
    object_id: number
    objecttype_id: number
    name: string
    value: string
    password: number
    created: string
    modified: string
}

export interface Servicegroup {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url: string
    _joinData: JoinData
}

export interface JoinData {
    id: number
    service_id: number
    servicegroup_id: number
}

export interface Contact {
    id: number
    uuid: string
    name: string
    description: string
    email: string
    phone: string
    user_id: number
    host_timeperiod_id: number
    service_timeperiod_id: number
    host_notifications_enabled: number
    service_notifications_enabled: number
    notify_service_recovery: number
    notify_service_warning: number
    notify_service_unknown: number
    notify_service_critical: number
    notify_service_flapping: number
    notify_service_downtime: number
    notify_host_recovery: number
    notify_host_down: number
    notify_host_unreachable: number
    notify_host_flapping: number
    notify_host_downtime: number
    host_push_notifications_enabled: number
    service_push_notifications_enabled: number
    _joinData: JoinData2
    containers: Container[]
    allowEdit: boolean
}

export interface JoinData2 {
    id: number
    contact_id: number
    hosttemplate_id: number
}

export interface Container {
    id: number
    containertype_id: number
    name: string
    parent_id?: number
    lft: number
    rght: number
    _joinData: JoinData3
}

export interface JoinData3 {
    id: number
    contact_id: number
    container_id: number
}

export interface Gauges {
    key: string
    displayName: string
}

/*
export interface Perfdata {
    thread_cache_hitrate: ThreadCacheHitrate
    thread_cache_hitrate_now: ThreadCacheHitrateNow
    connections_per_sec: ConnectionsPerSec
}

export interface ThreadCacheHitrate {
    current: string
    unit: string
    warning: string
    critical: string
    min: any
    max: any
    metric: string
}

export interface ThreadCacheHitrateNow {
    current: string
    unit: string
    warning: any
    critical: any
    min: any
    max: any
    metric: string
}

export interface ConnectionsPerSec {
    current: string
    unit: any
    warning: any
    critical: any
    min: any
    max: any
    metric: string
}
 */

export interface ServiceType {
    title: string
    color: string
    class: string
    icon: string
}

export interface Host {
    Host: Host2
}

export interface Host2 {
    id: number
    uuid: string
    hostname: string
    address: string
    description: any
    hosttemplate_id: number
    active_checks_enabled: any
    satelliteId: number
    containerId: number
    containerIds: number[]
    tags: string
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

export interface Hoststatus {
    currentState: number
    isFlapping: any
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    acknowledgement_type: any
    state_type: any
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
    lastHardStateChangeUser: string
    last_state_change_user: string
    lastCheckUser: string
    nextCheckUser: string
}

export interface Servicestatus {
    currentState: number
    lastHardState: number
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: boolean
    lastHardStateChange: string
    last_state_change: string
    processPerformanceData: boolean
    state_type: boolean
    acknowledgement_type: number
    flap_detection_enabled: boolean
    notifications_enabled: boolean
    current_check_attempt: number
    output: string
    long_output: string
    perfdata: string
    latency: number
    max_check_attempts: number
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
    lastHardStateChangeUser: string
    last_state_change_user: string
    lastCheckUser: string
    nextCheckUser: string
    longOutputHtml: string
}

export interface CheckCommand {
    Command: Command
    Commandargument: Commandargument2[]
}

export interface Command {
    id: number
    name: string
    command_line: string
    command_type: number
    human_args: any
    uuid: string
    description: string
}

export interface Commandargument2 {
    id: number
    command_id: number
    name: string
    human_name: string
    created: string
    modified: string
}

export interface CheckPeriod {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
}

export interface NotifyPeriod {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
}

export interface MainContainer {
    id: number
    name: string
}

export interface Objects {
    Instantreports: any[]
    Autoreports: Autoreport[]
    Eventcorrelations: any[]
    Maps: any[]
    Servicegroups: Servicegroup2[]
}

export interface Autoreport {
    id: number
    name: string
}

export interface Servicegroup2 {
    name: string
    id: number
}