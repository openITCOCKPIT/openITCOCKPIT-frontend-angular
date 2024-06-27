// This interface is 1:1 the same as the src/itnovum/openITCOCKPIT/Core/Views/Host.php class
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp, RotateProp } from '@fortawesome/fontawesome-svg-core';
import { HostTypesEnum } from './hosts.enum';
import { AcknowledgementTypes } from '../acknowledgements/acknowledgement-types.enum';
import { Customvariable } from '../contacts/contacts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { HosttemplatePost } from '../hosttemplates/hosttemplates.interface';
import { GenericValidationError } from '../../generic-responses';

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
    allow_sharing?: boolean // hosts/index
    satelliteName?: string // hosts/index
    additionalInformationExists?: boolean // hosts/index
    type?: HostOrServiceType // hosts/index
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

export interface HoststatusObject {
    currentState?: number
    isFlapping?: boolean
    problemHasBeenAcknowledged?: boolean
    scheduledDowntimeDepth?: number
    lastCheck?: string
    nextCheck?: string
    activeChecksEnabled?: boolean
    lastHardState?: string
    lastHardStateChange?: string
    last_state_change?: string
    output?: string
    long_output?: string
    acknowledgement_type?: AcknowledgementTypes
    state_type?: number
    flap_detection_enabled?: any
    notifications_enabled?: boolean
    current_check_attempt?: any
    max_check_attempts?: any
    latency?: number
    last_time_up?: string
    lastHardStateChangeInWords?: string
    last_state_change_in_words?: string
    lastCheckInWords?: string
    nextCheckInWords?: string
    isHardstate?: boolean
    isInMonitoring?: boolean
    humanState?: string
    cssClass?: string
    textClass?: string
    outputHtml?: string
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

export interface HostOrServiceType {
    title: string
    color: string
    class: string
    icon: IconProp,
    rotate: RotateProp,
}

/**********************
 *    Index action    *
 **********************/
export interface HostsIndexRoot extends PaginateOrScroll {
    all_hosts: {
        Host: HostObject
        Hoststatus: HoststatusObject,
        ServicestatusSummary: {
            state: {
                ok: number
                warning: number
                critical: number
                unknown: number
                total: number
            }
        }
    }[]
}

export interface HostsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | ''
    // Filters are handled by POST data
}

export function getDefaultHostsIndexParams(): HostsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hoststatus.current_state',
        page: 1,
        direction: 'desc'
    }
}

export interface HostsIndexFilter {
    'Hosts.id': number[]
    'Hosts.name': string
    'Hosts.name_regex': boolean
    'Hosts.keywords': string[]
    'Hosts.not_keywords': string[]
    'Hosts.address': string
    'Hosts.address_regex': boolean
    'Hosts.satellite_id': number[]
    'Hosts.host_type': HostTypesEnum[]
    'hostdescription': string
    'Hoststatus.output': string
    'Hoststatus.current_state': string[]
    'Hoststatus.problem_has_been_acknowledged': string,
    'Hoststatus.scheduled_downtime_depth': string,
    'Hoststatus.notifications_enabled': string,
    'Hoststatus.is_hardstate': string,
    'hostpriority': string[]
}

export interface HostsCurrentStateFilter {
    up: boolean
    down: boolean
    unreachable: boolean
}

export function getHostCurrentStateForApi(currentState: HostsCurrentStateFilter): string[] {
    let result = [];
    if (currentState.up) {
        result.push('up');
    }
    if (currentState.down) {
        result.push('down');
    }
    if (currentState.unreachable) {
        result.push('unreachable');
    }

    return result;
}


export function getDefaultHostsIndexFilter(): HostsIndexFilter {
    return {
        'Hosts.id': [],
        'Hosts.name': '',
        'Hosts.name_regex': false,
        'Hosts.keywords': [],
        'Hosts.not_keywords': [],
        'Hosts.address': '',
        'Hosts.address_regex': false,
        'Hosts.satellite_id': [],
        'Hosts.host_type': [],
        'hostdescription': '',
        'Hoststatus.output': '',
        'Hoststatus.current_state': [],
        'Hoststatus.problem_has_been_acknowledged': '',
        'Hoststatus.scheduled_downtime_depth': '',
        'Hoststatus.notifications_enabled': '',
        'Hoststatus.is_hardstate': '',
        'hostpriority': []
    }
}

/**********************
 *    Sharing action    *
 **********************/
export interface HostSharing {
    Host: {
        id: number
        uuid: string
        name: string
        container_id: number
        host_type: number
        hosts_to_containers_sharing: {
            _ids: number[]
        }
    }
}

/**********************
 *      Add action    *
 **********************/
export interface HostPost {
    id?: null | number
    name: string
    uuid?: string
    description: string
    hosttemplate_id: number
    address: string
    command_id: number
    eventhandler_command_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_down: number
    notify_on_unreachable: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_up: number
    flap_detection_on_down: number
    flap_detection_on_unreachable: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_checks_enabled: number
    freshness_threshold: number
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    check_period_id: number
    notify_period_id: number
    tags: string
    container_id: number
    host_url: string
    satellite_id: number
    sla_id?: number | null,
    contacts: {
        _ids: number[]
    },
    contactgroups: {
        _ids: number[]
    },
    hostgroups: {
        _ids: number[]
    },
    hosts_to_containers_sharing: {
        _ids: number[]
    },
    parenthosts: {
        _ids: number[]
    },
    customvariables: Customvariable[],
    hostcommandargumentvalues: HostCommandArgument[],
    prometheus_exporters: {
        _ids: number[]
    }
    host_type?: number
    created?: string
    modified?: string
}

export interface HostCommandArgument {
    id?: number
    commandargument_id: number
    host_id?: number
    value: string
    created?: string
    modified?: string
    commandargument: {
        id?: number
        name: string
        human_name: string
        command_id: number
        created?: string
        modified?: string
    }
}

export interface HostElements {
    hosttemplates: SelectKeyValue[]
    hostgroups: SelectKeyValue[]
    timeperiods: SelectKeyValue[]
    checkperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
    satellites: SelectKeyValue[]
    sharingContainers: SelectKeyValue[]
    exporters: SelectKeyValue[]
    slas: SelectKeyValue[]
}

export interface HostDnsLookup {
    hostname: string | null
    address: string | null
}

export interface HostAddEditSuccessResponse {
    id: number
    services?: {
        _ids: number[]
    }
    disabled_services?: {
        _ids: number[]
    }
    errors: any[]
    disabled_errors: any[]
    servicetemplategroups_removed_count?: number
    services_disabled_count?: number
}

/**********************
 *     Edit action    *
 **********************/
export interface HostEditApiResult {
    host: {
        Host: HostPost
    }
    commands: SelectKeyValue[]
    hosttemplate: {
        Hosttemplate: HosttemplatePost
    },
    isPrimaryContainerChangeable: boolean
    allowSharing: boolean
    isHostOnlyEditableDueToHostSharing: boolean
    fakeDisplayContainers: SelectKeyValue[]
    areContactsInheritedFromHosttemplate: boolean
    hostType: HostOrServiceType
}

/**********************
 *    Copy action    *
 **********************/

export interface HostCopy {
    id?: number
    name: string
    description: string | null
    address: string
    host_url: string | null
}

export interface HostCopyGet {
    Host: HostCopy
}


export interface HostCopyPost {
    Source: {
        id: number,
        name: string
        address: string
    }
    Host: HostCopy
    Error?: GenericValidationError | null
}

/**********************
 *     Global action    *
 **********************/
export interface HostsLoadHostsByStringParams {
    'angular': true,
    'filter[Hosts.name]': string,
    'selected[]': number[],
    'includeDisabled': boolean
}
