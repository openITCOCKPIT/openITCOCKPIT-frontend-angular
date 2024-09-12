// This interface is 1:1 the same as the src/itnovum/openITCOCKPIT/Core/Views/Host.php class
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp, RotateProp } from '@fortawesome/fontawesome-svg-core';
import { HostTypesEnum } from './hosts.enum';
import { AcknowledgementTypes } from '../acknowledgements/acknowledgement-types.enum';
import { ContactEntity, Customvariable } from '../contacts/contacts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { HosttemplatePost } from '../hosttemplates/hosttemplates.interface';
import { GenericValidationError } from '../../generic-responses';
import { GenericIdAndName } from '../../generic.interfaces';
import { AcknowledgementObject } from '../acknowledgements/acknowledgement.interface';
import { DowntimeObject } from '../downtimes/downtimes.interface';
import { CheckCommandCake2 } from '../commands/commands.interface';
import { TimeperiodEnity } from '../timeperiods/timeperiods.interface';
import { ContainerWithHostJoinData } from '../containers/containers.interface';
import { HostgroupEntityWithJoinData } from '../hostgroups/hostgroups.interface';
import { ContactgroupEntity } from '../contactgroups/contactgroups.interface';

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

export interface HostEntityWithContainers extends HostEntity {
    is_satellite_host?: boolean
    hosts_to_containers_sharing: {
        _joinData: {
            id: number,
            host_id: number,
            container_id: number
        },
        HostsToContainers: {
            host_id: number,
            container_id: number
        }
    }[],
}

export interface HoststatusObject {
    currentState?: number
    isFlapping?: boolean
    problemHasBeenAcknowledged?: boolean
    scheduledDowntimeDepth?: number
    lastCheck?: string // "5 minutes ago"
    nextCheck?: string  // "1 hour, 54 minutes"
    activeChecksEnabled?: boolean
    lastHardState?: string
    lastHardStateChange?: string
    last_state_change?: string
    output?: string
    long_output?: string
    acknowledgement_type?: AcknowledgementTypes
    state_type?: number
    flap_detection_enabled?: boolean
    notifications_enabled?: boolean
    current_check_attempt?: number
    max_check_attempts?: number
    latency?: number
    last_time_up?: string
    lastHardStateChangeInWords?: string
    last_state_change_in_words?: string
    lastCheckInWords?: string // "5 minutes ago"
    nextCheckInWords?: string // "1 hour, 54 minutes"
    isHardstate?: boolean
    isInMonitoring?: boolean
    humanState?: string // "up"
    cssClass?: string // "bg-up"
    textClass?: string // "up"
    outputHtml?: string
    longOutputHtml?: string
    lastHardStateChangeUser?: string, // "09:31:53 - 11.07.2024"
    last_state_change_user?: string, // "09:31:53 - 11.07.2024"
    lastCheckUser?: string, // "09:31:53 - 11.07.2024"
    nextCheckUser?: string, // "09:31:53 - 11.07.2024"
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
    }[],
    username: string
}

export interface HostsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | ''
    BrowserContainerId?: number
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
    'Hoststatus.active_checks_enabled': string,
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
        'Hoststatus.active_checks_enabled': '',
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

/**********************
 *   Disabled action  *
 **********************/
export interface HostsDisabledParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[Hosts.name_regex]': boolean,
    'filter[Hosts.description]': string,
    'filter[Hosts.address]': string,
    'filter[Hosts.address_regex]': boolean,
    'filter[Hosts.satellite_id][]': number[]
}

export function getDefaultHostsDisabledParams(): HostsDisabledParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': false,
        'filter[Hosts.description]': '',
        'filter[Hosts.address]': '',
        'filter[Hosts.address_regex]': false,
        'filter[Hosts.satellite_id][]': []
    }
}

export interface HostsDisabledRoot extends PaginateOrScroll {
    all_hosts: {
        Host: HostObject
        Hosttemplate: {
            id: number;
            name: string;
        }
        Hoststatus: {
            isInMonitoring: false,
            currentState: number
        }
    }[]
}

/**************************
 *   Not Monitored action  *
 ***************************/
export interface HostsNotMonitoredParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[Hosts.name_regex]': boolean,
    'filter[Hosts.description]': string,
    'filter[Hosts.address]': string,
    'filter[Hosts.address_regex]': boolean,
    'filter[Hosts.satellite_id][]': number[]
}

export function getDefaultHostsNotMonitoredParams(): HostsNotMonitoredParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[Hosts.name_regex]': false,
        'filter[Hosts.description]': '',
        'filter[Hosts.address]': '',
        'filter[Hosts.address_regex]': false,
        'filter[Hosts.satellite_id][]': []
    }
}

export interface HostsNotMonitoredRoot extends PaginateOrScroll {
    all_hosts: {
        Host: HostObject
        Hoststatus: {
            isInMonitoring: false,
            currentState: number
        }
    }[]
}

/**********************
 *    Used By action  *
 **********************/
export interface HostUsedByRoot {
    host: HostEntity
    objects: HostUsedByObjects
    total: number
}

export interface HostUsedByObjects {
    Hostgroups: GenericIdAndName[]
    Instantreports: GenericIdAndName[]
    Autoreports: GenericIdAndName[]
    Eventcorrelations: {
        host_id: number,
        Hosts: {
            name: string
        },
        FilterHost: {
            id: number
        }
    }[]
    Maps: GenericIdAndName[]
}

/*************************
 *  edit_details action  *
 *************************/
export interface HostEditDetailsGet {
    hosts: HostEditDetailsHost[], // Looks like this is unused for now
    contacts: SelectKeyValue[],
    contactgroups: SelectKeyValue[],
    sharingContainers: SelectKeyValue[],
    satellites: SelectKeyValue[]
}

export interface HostEditDetailsHost {
    id: number,
    hosttemplate_id: number,
    container_id: number,
    description: string | null,
    host_url: string | null,
    tags: string | null,
    check_interval: number | null,
    retry_interval: number | null,
    max_check_attempts: number | null,
    notification_interval: number | null,
    notes: string | null,
    priority: number,
    hosttemplate: {
        id: number,
        description: string,
        host_url: string,
        tags: string,
        check_interval: number,
        retry_interval: number,
        max_check_attempts: number,
        notification_interval: number,
        notes: string,
        priority: number,
        contactgroups: {
            id: number,
            _joinData: {
                id: number,
                contactgroup_id: number,
                hosttemplate_id: number
            },
            ContactgroupsToHosttemplates: {
                hosttemplate_id: number,
            }
        }[],
        contacts: {
            id: number,
            _joinData: {
                id: number,
                contact_id: number,
                hosttemplate_id: number
            },
            ContactsToHosttemplates: {
                hosttemplate_id: number,
            }
        }[],
    },
    contactgroups: {
        id: number,
        _joinData: {
            id: number,
            contactgroup_id: number,
            host_id: number
        },
        ContactgroupsToHosts: {
            host_id: number,
        }
    }[],
    contacts: {
        id: number,
        _joinData: {
            id: number,
            contact_id: number,
            hosttemplate_id: number
        },
        ContactsToHosts: {
            host_id: number,
        }
    }[],
    hosts_to_containers_sharing: {
        _joinData: {
            id: number,
            host_id: number,
            container_id: number
        },
        HostsToContainers: {
            host_id: number,
            container_id: number
        }
    }[],
}

export interface HostEditDetailsPost {
    Host: {
        hosts_to_containers_sharing: {
            _ids: number[]
        },
        description: null | string,
        host_url: null | string,
        tags: null | string,

        check_interval: null | number,
        retry_interval: null | number,
        max_check_attempts: null | number,
        notification_interval: null | number,
        notes: null | string,
        priority: null | number,
        satellite_id: null | number,
        contacts: {
            _ids: number[]
        },
        contactgroups: {
            _ids: number[]
        }
    },
    keepSharedContainers: boolean,
    keepContacts: boolean,
    keepContactgroups: boolean,
    editSharedContainers: boolean,
    editDescription: boolean,
    editTags: boolean,
    editPriority: boolean,
    editCheckInterval: boolean,
    editRetryInterval: boolean,
    editMaxNumberOfCheckAttempts: boolean,
    editNotificationInterval: boolean,
    editContacts: boolean,
    editContactgroups: boolean,
    editHostUrl: boolean,
    editNotes: boolean,
    editSatellites: boolean
}

/*************************
 *  Host Browser Menu    *
 *************************/
export interface HostBrowserMenu {
    hostId: number
    hostUuid: string
    hostName: string
    hostAddress: string
    docuExists: boolean
    hostUrl: string
    allowEdit: boolean
    includeHoststatus: boolean,
    Hoststatus: HoststatusObject
}

/*************************
 *     Host Browser      *
 *************************/

export interface MergedHost extends HostEntity {
    hostcommandargumentvalues: HostCommandArgument[],
    hosts_to_containers_sharing: ContainerWithHostJoinData[],
    parenthosts: HostEntity[],
    customvariables: Customvariable[],
    hostgroups: HostgroupEntityWithJoinData[],
    contacts: ContactEntity[],
    contactgroups: ContactgroupEntity[],
    is_satellite_host: boolean,
    allowEdit: boolean,
    showServices: boolean,
    host_url_replaced: string,
    hostCommandLine: string,
    checkIntervalHuman: string,
    retryIntervalHuman: string,
    notificationIntervalHuman: string,
}

export interface HostBrowserResult {
    mergedHost: MergedHost,
    docuExists: boolean,
    areContactsFromHost: boolean,
    areContactsInheritedFromHosttemplate: boolean,
    hoststatus: HoststatusObject,
    mainContainer: GenericIdAndName[],
    sharedContainers: {
        [key: number]: GenericIdAndName[]
    },
    parenthosts: HostEntity[],
    parentHostStatus: {
        [key: string]: HoststatusObject
    },
    acknowledgement?: AcknowledgementObject,
    downtime?: DowntimeObject,
    checkCommand: CheckCommandCake2,
    checkPeriod: TimeperiodEnity,
    notifyPeriod: TimeperiodEnity,
    canSubmitExternalCommands: boolean,
    objects: {
        Hostgroups: GenericIdAndName[],
        Instantreports: GenericIdAndName[],
        Autoreports: GenericIdAndName[],
        Eventcorrelations: {
            host_id: number,
            Hosts: {
                name: string
            },
            FilterHost: {
                id: number
            }
        }[]
        Maps: GenericIdAndName[],
    },
    satelliteId: number,
    mapModule: boolean,
    username: string,
    blurryCommandLine: boolean,
    masterInstanceName: string
}

export interface HostBrowserSlaOverview {
    state: string,
    evaluation_end: number, // could be a unix timestamp or a date string "2024-08-12T00:00:00+02:00"
    determined_availability_percent?: number,
    warning_threshold?: number | null,
    minimal_availability?: number,
}
