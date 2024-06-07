// This interface is 1:1 the same as the src/itnovum/openITCOCKPIT/Core/Views/Host.php class
export interface HostObject {
    id?: number
    uuid?: string
    hostname?: string // same as name
    address?: string
    description?: string
    hosttemplate_id?: number
    active_checks_enabled?: boolean
    satelliteId?: number
    containerId?: number
    containerIds?: number[]
    tags?: string
    usageFlag?: number
    allow_edit?: boolean
    disabled?: boolean
    priority?: number
    notes?: string
    is_satellite_host: boolean
    name?: string // same as hostname
}

// Same as HostObject but with "Host" key in between as CakePHP 2 does.
// [Host][name] instead of [name]
export interface HostObjectCake2 {
    Host: HostObject
}

export interface HostEntity {
    id: number
    uuid?: string
    container_id?: number
    name?: string
    description?: string
    hosttemplate_id?: number
    address?: string
    command_id?: any
    eventhandler_command_id?: number
    timeperiod_id?: number
    check_interval?: number
    retry_interval?: number
    max_check_attempts?: number
    first_notification_delay?: number
    notification_interval?: number
    notify_on_down?: number
    notify_on_unreachable?: number
    notify_on_recovery?: number
    notify_on_flapping?: number
    notify_on_downtime?: number
    flap_detection_enabled?: number
    flap_detection_on_up?: number
    flap_detection_on_down?: number
    flap_detection_on_unreachable?: number
    low_flap_threshold?: number
    high_flap_threshold?: number
    process_performance_data?: number
    freshness_checks_enabled?: number
    freshness_threshold?: number
    passive_checks_enabled?: number
    event_handler_enabled?: number
    active_checks_enabled?: number
    retain_status_information?: number
    retain_nonstatus_information?: number
    notifications_enabled?: number
    notes?: string
    priority?: number
    check_period_id?: number
    notify_period_id?: number
    tags?: string
    own_contacts?: number
    own_contactgroups?: number
    own_customvariables?: number
    host_url?: string
    sla_id?: number
    satellite_id?: number
    host_type?: number
    disabled?: number
    usage_flag?: number
    created?: string
    modified?: string
    allow_edit?: boolean
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: {
        id: number
        host_id: number
        container_id: number
    }
}
