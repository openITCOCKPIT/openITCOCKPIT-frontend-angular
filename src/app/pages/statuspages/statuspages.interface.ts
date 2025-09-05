import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface StatuspagesIndexRoot extends PaginateOrScroll {
    all_statuspages: StatuspageObject[]
}

export interface StatuspagesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Statuspages.id][]': number[] | [],
    'filter[Statuspages.name]': '',
    'filter[Statuspages.description]': '',
    'filter[Statuspages.public]': boolean | null,
}

export function getDefaultStatuspagesIndexParams(): StatuspagesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Statuspages.name',
        page: 1,
        direction: 'asc',
        'filter[Statuspages.id][]': [],
        'filter[Statuspages.name]': '',
        'filter[Statuspages.description]': '',
        'filter[Statuspages.public]': null,
    }
}

export interface StatuspageObject {
    id: number
    uuid: string,
    container_id: number
    name: string
    description: string
    public: boolean
    public_title: string | null
    public_identifier: string | null
    show_downtimes: boolean
    show_downtime_comments: boolean
    show_acknowledgements: boolean
    show_acknowledgement_comments: boolean
    created: string
    modified: string
    servicegroups?: ServicegroupObject[]
    hostgroups?: HostgroupObject[]
    services?: ServiceObject[]
    hosts?: HostObject[]
    allow_edit: boolean
}

export interface ServicegroupObject {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url: string
    _joinData: ServicegroupJoinData
}

export interface ServicegroupJoinData {
    id: number
    statuspage_id: number
    servicegroup_id: number
    display_alias: string
}

export interface HostgroupObject {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url: string
    _joinData: HostgroupJoinData
}

export interface HostgroupJoinData {
    id: number
    statuspage_id: number
    hostgroup_id: number
    display_alias: string
}

export interface ServiceObject {
    id: number
    uuid: string
    servicetemplate_id: number
    host_id: number
    name?: string
    description: any
    command_id: any
    check_command_args: string
    eventhandler_command_id: any
    notify_period_id: any
    check_period_id: any
    check_interval?: number
    retry_interval: any
    max_check_attempts: any
    first_notification_delay: any
    notification_interval?: number
    notify_on_warning?: number
    notify_on_unknown?: number
    notify_on_critical: any
    notify_on_recovery: any
    notify_on_flapping?: number
    notify_on_downtime?: number
    is_volatile: any
    flap_detection_enabled?: number
    flap_detection_on_ok: any
    flap_detection_on_warning: any
    flap_detection_on_unknown: any
    flap_detection_on_critical: any
    low_flap_threshold: any
    high_flap_threshold: any
    process_performance_data: any
    freshness_checks_enabled: any
    freshness_threshold: any
    passive_checks_enabled: any
    event_handler_enabled: any
    active_checks_enabled?: number
    notifications_enabled: any
    notes: any
    priority?: number
    tags?: string
    own_contacts?: number
    own_contactgroups?: number
    own_customvariables?: number
    service_url: any
    sla_relevant: any
    service_type: number
    disabled: number
    usage_flag: number
    created: string
    modified: string
    _joinData: ServiceJoinData
}

export interface ServiceJoinData {
    id: number
    statuspage_id: number
    service_id: number
    display_alias: string
}

export interface HostObject {
    id: number
    uuid: string
    container_id: number
    name: string
    description?: string
    hosttemplate_id: number
    address: string
    command_id: any
    eventhandler_command_id: any
    timeperiod_id: any
    check_interval?: number
    retry_interval: any
    max_check_attempts: any
    first_notification_delay: any
    notification_interval: any
    notify_on_down: any
    notify_on_unreachable: any
    notify_on_recovery: any
    notify_on_flapping: any
    notify_on_downtime: any
    flap_detection_enabled: any
    flap_detection_on_up: any
    flap_detection_on_down: any
    flap_detection_on_unreachable: any
    low_flap_threshold: any
    high_flap_threshold: any
    process_performance_data: any
    freshness_checks_enabled: any
    freshness_threshold: any
    passive_checks_enabled: any
    event_handler_enabled: any
    active_checks_enabled: any
    retain_status_information: any
    retain_nonstatus_information: any
    notifications_enabled: any
    notes?: string
    priority?: number
    check_period_id: any
    notify_period_id: any
    tags?: string
    own_contacts: number
    own_contactgroups: number
    own_customvariables: number
    host_url: any
    sla_id: any
    satellite_id: number
    host_type: number
    disabled: number
    usage_flag: number
    created: string
    modified: string
    _joinData: HostJoinData
}

export interface HostJoinData {
    id: number
    statuspage_id: number
    host_id: number
    display_alias: string
}


