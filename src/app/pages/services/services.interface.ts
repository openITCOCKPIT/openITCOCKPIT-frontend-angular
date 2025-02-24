import {
    HostBrowserSlaOverview,
    HostEntity,
    HostObject,
    HostObjectCake2,
    HostOrServiceType,
    HoststatusObject
} from '../hosts/hosts.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { ContactEntity, Customvariable } from '../contacts/contacts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { ServicetemplateEntity, ServicetemplatePost } from '../servicetemplates/servicetemplates.interface';
import { GenericValidationError } from '../../generic-responses';
import { ServiceTypesEnum } from './services.enum';
import { GenericIdAndName } from '../../generic.interfaces';
import { AcknowledgementObject } from '../acknowledgements/acknowledgement.interface';
import { DowntimeObject } from '../downtimes/downtimes.interface';
import { CheckCommandCake2 } from '../commands/commands.interface';
import { TimeperiodEnity } from '../timeperiods/timeperiods.interface';
import { ContactgroupEntity } from '../contactgroups/contactgroups.interface';
import { ServicegroupEntityWithJoinData } from '../servicegroups/servicegroups.interface';

/**********************
 *    Index action    *
 **********************/
export interface ServiceParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    BrowserContainerId?: number
}

export function getDefaultServiceIndexParams(): ServiceParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Servicestatus.current_state',
        page: 1,
        direction: 'desc',
    }
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

export function getDefaultServicesIndexFilter(): ServiceIndexFilter {
    return {
        Servicestatus: {
            current_state: {
                ok: false,
                warning: false,
                critical: false,
                unknown: false
            },
            acknowledged: false,
            not_acknowledged: false,
            in_downtime: false,
            not_in_downtime: false,
            passive: false,
            active: false,
            notifications_enabled: false,
            notifications_not_enabled: false,
            output: '',
        },
        Services: {
            id: [],
            name: '',
            name_regex: false,
            keywords: [],
            not_keywords: [],
            servicedescription: '',
            priority: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false
            },
            service_type: []
        },
        Hosts: {
            id: [],
            name: '',
            name_regex: false,
            satellite_id: []
        }
    };
}

export interface ServicesIndexFilterApiRequest {
    'Hosts.id': number[]
    'Hosts.name': string
    'Hosts.name_regex': boolean | string
    'Hosts.satellite_id': number[]

    'Services.id': number[]
    'Services.service_type': ServiceTypesEnum[]
    'servicename': string
    'servicename_regex': boolean | string
    'servicedescription': string
    'keywords': string[]
    'not_keywords': string[]
    'servicepriority': string[]

    'Servicestatus.current_state': string[]
    'Servicestatus.output': string
    'Servicestatus.problem_has_been_acknowledged': string
    'Servicestatus.scheduled_downtime_depth': string
    'Servicestatus.active_checks_enabled': string
    'Servicestatus.notifications_enabled': string
}

export function getDefaultServicesIndexFilterApiRequest(): ServicesIndexFilterApiRequest {
    return {
        'Hosts.id': [],
        'Hosts.name': '',
        'Hosts.name_regex': false,
        'Hosts.satellite_id': [],

        'Services.id': [],
        'Services.service_type': [],
        'servicename': '',
        'servicename_regex': '',
        'servicedescription': '',
        'keywords': [],
        'not_keywords': [],
        'servicepriority': [],

        'Servicestatus.output': '',
        'Servicestatus.current_state': [],
        'Servicestatus.problem_has_been_acknowledged': '',
        'Servicestatus.scheduled_downtime_depth': '',
        'Servicestatus.notifications_enabled': '',
        //'Servicestatus.is_hardstate': '',
        'Servicestatus.active_checks_enabled': '',
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

/**
 * @deprecated
 */
export interface AllService {
    Service: ServiceObject
    Host: ServiceHostObject
    Hoststatus: HoststatusObject
    Servicestatus: ServicestatusObject
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
    usageFlag?: number
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

export interface ServiceEntity {
    id?: number
    uuid?: string
    servicetemplate_id?: number
    host_id?: number
    name?: string
    description?: string
    command_id?: number
    check_command_args?: string
    eventhandler_command_id?: number
    notify_period_id?: number
    check_period_id?: number
    check_interval?: number
    retry_interval?: number
    max_check_attempts?: number
    first_notification_delay?: number
    notification_interval?: number
    notify_on_warning?: number
    notify_on_unknown?: number
    notify_on_critical?: number
    notify_on_recovery?: number
    notify_on_flapping?: number
    notify_on_downtime?: number
    is_volatile?: number
    flap_detection_enabled?: number
    flap_detection_on_ok?: number
    flap_detection_on_warning?: number
    flap_detection_on_unknown?: number
    flap_detection_on_critical?: number
    low_flap_threshold?: number
    high_flap_threshold?: number
    process_performance_data?: number
    freshness_checks_enabled?: number
    freshness_threshold?: number
    passive_checks_enabled?: number
    event_handler_enabled?: number
    active_checks_enabled?: number
    notifications_enabled?: number
    notes?: string
    priority?: number
    tags?: string
    own_contacts?: number
    own_contactgroups?: number
    own_customvariables?: number
    service_url?: string
    sla_relevant?: boolean
    service_type?: number
    disabled?: number
    usage_flag?: number
    created?: string
    modified?: string
    servicetemplate?: ServicetemplateEntity
    host?: HostEntity
    servicename?: string
    is_sla_relevant?: boolean
}

/**
 * @deprecated use ServicestatusObject instead
 */
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

export interface ServicestatusObject {
    currentState?: number
    lastHardState?: string
    isFlapping?: boolean
    problemHasBeenAcknowledged?: boolean
    scheduledDowntimeDepth?: number
    lastCheck?: string // "5 minutes ago"
    nextCheck?: string // "1 hour, 54 minutes"
    activeChecksEnabled?: number
    lastHardStateChange?: string
    last_state_change?: string
    processPerformanceData?: boolean
    state_type?: number
    acknowledgement_type?: number
    flap_detection_enabled?: boolean
    notifications_enabled?: boolean
    current_check_attempt?: number
    output?: string
    long_output?: string
    perfdata?: string
    latency?: number
    max_check_attempts?: number
    last_time_ok?: string
    lastHardStateChangeInWords?: string
    last_state_change_in_words?: string
    lastCheckInWords?: string // "5 minutes ago"
    nextCheckInWords?: string // "1 hour, 54 minutes"
    isHardstate?: boolean
    isInMonitoring?: boolean
    humanState?: string // "ok"
    cssClass?: string // "bg-ok"
    textClass?: string // "ok"
    outputHtml?: string
    longOutputHtml?: string
    lastHardStateChangeUser?: string, // "09:31:53 - 11.07.2024"
    last_state_change_user?: string, // "09:31:53 - 11.07.2024"
    lastCheckUser?: string, // "09:31:53 - 11.07.2024"
    nextCheckUser?: string, // "09:31:53 - 11.07.2024"
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
    'filter[servicename]': string,
    'filter[Services.disabled]'?: number,
    'selected[]': number[],
    'includeDisabled': boolean,
    'containerId'?: number,
    'resolveContainerIds'?: boolean
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

/****************************
 *  Service Browser Menu    *
 ****************************/
export interface ServiceBrowserMenu {
    hostId: number
    serviceId: number
    serviceUuid: string
    hostName: string
    serviceName: string
    hostAddress: string
    docuExists: boolean
    serviceUrl: string | null
    allowEdit: boolean
    includeServicestatus: boolean,
    Servicestatus: ServicestatusObject,
    includeHoststatus: boolean,
    Hoststatus: HoststatusObject
}


/**************************
 * Service Browser action  *
 ***************************/

export interface ServiceBrowserPerfdata {
    current: string
    unit: string
    warning: string
    critical: string
    min: string
    max: any
    metric: string
}

export interface MergedService extends ServiceEntity {
    servicecommandargumentvalues: ServiceCommandArgument[],
    serviceeventcommandargumentvalues: ServiceCommandArgument[],
    customvariables: Customvariable[],
    servicegroups: ServicegroupEntityWithJoinData[]
    contacts: ContactEntity[],
    contactgroups: ContactgroupEntity[],
    service_url_replaced: string
    serviceCommandLine: string
    checkIntervalHuman: string
    retryIntervalHuman: string
    notificationIntervalHuman: string
    allowEdit: boolean
    has_graph: boolean
    Perfdata: {
        [key: string]: ServiceBrowserPerfdata
    }
}


export interface ServiceBrowserResult {
    mergedService: MergedService
    serviceType: HostOrServiceType
    host: HostObjectCake2
    areContactsFromService: boolean
    areContactsInheritedFromHosttemplate: boolean
    areContactsInheritedFromHost: boolean
    areContactsInheritedFromServicetemplate: boolean
    hoststatus: HoststatusObject
    servicestatus: ServicestatusObject
    acknowledgement?: AcknowledgementObject
    downtime?: DowntimeObject
    hostDowntime?: DowntimeObject
    hostAcknowledgement?: AcknowledgementObject
    checkCommand: CheckCommandCake2
    checkPeriod: TimeperiodEnity
    notifyPeriod: TimeperiodEnity
    canSubmitExternalCommands: boolean
    mainContainer: GenericIdAndName[],
    sharedContainers: {
        [key: number]: GenericIdAndName[]
    },
    objects: {
        Servicegroups: GenericIdAndName[],
        Instantreports: GenericIdAndName[],
        Autoreports: GenericIdAndName[],
        Eventcorrelations: GenericIdAndName[],
        Maps: GenericIdAndName[],
    },
    usageFlag: number
    username: string
    blurryCommandLine: boolean
    masterInstanceName: string

    _csrfToken: string
}

// Both are the same
export interface ServiceBrowserSlaOverview extends HostBrowserSlaOverview {

}


/**********************
 *    Used By action  *
 **********************/
export interface ServiceUsedByRoot {
    service: ServiceEntity
    objects: ServiceUsedByObjects
    total: number
}

export interface ServiceUsedByObjects {
    Servicegroups: GenericIdAndName[]
    Instantreports: GenericIdAndName[]
    Autoreports: GenericIdAndName[]
    Eventcorrelations: GenericIdAndName[]
    Maps: GenericIdAndName[]
}

export interface ServicesLoadServicesByContainerIdResponse {
    key: number,
    value: {
        Service: {
            id: number,
            name: string | null, // null if name is from service template
            servicename: string, // name of the service use this
            disabled: number // 0 or 1
        },
        Host: {
            id: number,
            name: string
        },
        Servicetemplate: {
            name: string
        }
    }
}
