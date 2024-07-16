import { HostEntity, HostObject, HostOrServiceType, HoststatusObject } from '../hosts/hosts.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Customvariable } from '../contacts/contacts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { ServicetemplatePost } from '../servicetemplates/servicetemplates.interface';
import { GenericValidationError } from '../../generic-responses';

/**********************
 *    Index action    *
 **********************/
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
    'filter[Servicestatus.active_checks_enabled]': boolean | string,
    'filter[Servicestatus.notifications_enabled]': boolean | string,
    'filter[servicepriority][]': number[]
}


export interface ServiceIndexFilter {
    Servicestatus: {
        current_state: ServicesCurrentStateFilter,
        acknowledged: boolean,
        not_acknowledged: boolean,
        in_downtime: boolean,
        not_in_downtime: boolean,
        passive: boolean,
        active: boolean,
        notifications_enabled: boolean,
        notifications_not_enabled: boolean,
        output: string,
    },
    Services: {
        id: number[],
        name: string,
        name_regex: boolean | string,
        keywords: string[],
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

export interface ServicesCurrentStateFilter {
    ok: boolean,
    warning: boolean,
    critical: boolean,
    unknown: boolean
}

export function getServiceCurrentStateForApi(currentState: ServicesCurrentStateFilter): string[] {
    let result = [];
    if (currentState.ok) {
        result.push('ok');
    }
    if (currentState.warning) {
        result.push('warning');
    }
    if (currentState.critical) {
        result.push('critical');
    }
    if (currentState.unknown) {
        result.push('unknown');
    }

    return result;
}

export interface ServicesIndexRoot extends PaginateOrScroll {
    all_services: AllService[]
    username: string
    satellites: SelectKeyValue[]
}

export interface AllService {
    Service: ServiceObject
    Host: ServiceHostObject
    Hoststatus: HoststatusObject
    Servicestatus: Servicestatus
    ServiceType: HostOrServiceType
    Downtime: any[]
    Acknowledgement: any[]
}

export interface ServiceObject {
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

export interface ServiceHostObject {
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
    output: any
    long_output: any
    perfdata: string
    latency: number
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


/**********************
 *    Add action    *
 **********************/

export interface ServicePost {
    id?: null | number
    host_id: number
    uuid?: string
    servicetemplate_id: number
    name: string
    description: string
    command_id: number
    eventhandler_command_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_recovery: number
    notify_on_warning: number
    notify_on_critical: number
    notify_on_unknown: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number
    flap_detection_on_critical: number
    flap_detection_on_unknown: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
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
    service_url: string
    is_volatile: number
    freshness_checks_enabled: number
    contacts: {
        _ids: number[]
    },
    contactgroups: {
        _ids: number[]
    },
    servicegroups: {
        _ids: number[]
    },
    customvariables: Customvariable[],
    servicecommandargumentvalues: ServiceCommandArgument[],
    serviceeventcommandargumentvalues: ServiceCommandArgument[],
    service_type?: number
    usage_flag?: number
    sla_relevant: number
    created?: string
    modified?: string
}

export interface ServiceCommandArgument {
    id?: number
    commandargument_id: number
    service_id?: number
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

export interface ServiceElements {
    servicetemplates: SelectKeyValue[]
    servicegroups: SelectKeyValue[]
    timeperiods: SelectKeyValue[]
    checkperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
    existingServices: {
        [key: string | number]: string
    }
    isSlaHost: boolean
}

export interface ServiceLoadServicetemplateApiResult {
    servicetemplate: {
        Servicetemplate: ServicetemplatePost
    }
    contactsAndContactgroups: ServiceInheritedContactsAndContactgroups,
    hostContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId,
    hosttemplateContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId,
    servicetemplateContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId,
    areContactsInheritedFromHosttemplate: boolean,
    areContactsInheritedFromHost: boolean,
    areContactsInheritedFromServicetemplate: boolean,

}

export interface ServiceInheritedContactsAndContactgroups {
    contacts: {
        _ids: number[]
    },
    contactgroups: {
        _ids: number[]
    }
}

export interface ServiceInheritedContactsAndContactgroupsWithId {
    id: number,
    contacts: {
        _ids: number[]
    },
    contactgroups: {
        _ids: number[]
    }
}

/**********************
 *    Edit action    *
 **********************/

export interface ServiceEditApiResult {
    service: {
        Service: ServicePost
    },
    host: {
        Host: HostEntity
    }
    servicetemplate: {
        Servicetemplate: ServicetemplatePost,
    },
    hostContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId,
    hosttemplateContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId,
    areContactsInheritedFromHosttemplate: boolean,
    areContactsInheritedFromHost: boolean,
    areContactsInheritedFromServicetemplate: boolean,
    serviceType: HostOrServiceType,
    isSlaHost: boolean
}

/**********************
 *    Copy action    *
 **********************/

export interface ServiceCopy {
    id?: number
    name: string // Use for GET
    _name?: string // Used for POST
    description: string
    command_id: number
    active_checks_enabled: number,
    servicecommandargumentvalues: ServiceCommandArgument[]
    host: {
        id: number
        name: string
    },
    servicetemplate: any // unused just post it back to the server
}

export interface ServiceCopyGet {
    services: ServiceCopy[]
    commands: SelectKeyValue[]
    eventhandlerCommands: SelectKeyValue[]
}

export interface ServiceCopyPost {
    Source: {
        id: number,
        _name: string
        hostname: string
    }
    Service: ServiceCopy
    Error?: GenericValidationError | null
}

/**********************
 *     Global action    *
 **********************/
export interface ServicesLoadServicesByStringParams {
    'angular': true,
    'filter[Services.name]': string,
    'selected[]': number[],
    'includeDisabled': boolean
}

/**************************
 *   Not Monitored action  *
 ***************************/
export interface ServicesNotMonitoredParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[Hosts.name_regex]': boolean,
    'filter[servicename]': string,
    'filter[servicename_regex]': boolean
}

export function getDefaultServicesNotMonitoredParams(): ServicesNotMonitoredParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': false,
        'filter[servicename]': '',
        'filter[servicename_regex]': false
    }
}

export interface ServicesNotMonitoredRoot extends PaginateOrScroll {
    all_services: {
        Service: ServiceObject,
        ServiceType: HostOrServiceType,
        Host: HostObject,
        Hoststatus: HoststatusObject
    }[]
}


/**********************
 *   Disabled action  *
 **********************/
export interface ServicesDisabledParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[Hosts.name_regex]': boolean,
    'filter[servicename]': string,
    'filter[servicename_regex]': boolean
}

export function getDefaultServicesDisabledParams(): ServicesDisabledParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': false,
        'filter[servicename]': '',
        'filter[servicename_regex]': false
    }
}

export interface ServicesDisabledRoot extends PaginateOrScroll {
    all_services: {
        Service: ServiceObject,
        Host: HostObject,
        Hoststatus: HoststatusObject
    }[]
}

/**********************
 *   Deleted  action  *
 **********************/

export interface ServicesDeletedParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[DeletedServices.host_id]': number
}

export interface ServicesDeletedServicesRoot extends PaginateOrScroll {
    all_services: {
        DeletedService: DeletedService
    }[]
}

export interface DeletedService {
    id: number
    uuid: string
    hostUuid: string
    servicetemplateId: number
    hostId: number
    name: string
    description: null | string
    perfdataDeleted: boolean
    created: string
    modified: string
}
