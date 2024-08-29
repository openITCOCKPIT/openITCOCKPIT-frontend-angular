import { PaginateOrScroll } from "../../layouts/coreui/paginator/paginator.interface";
import { GenericValidationError } from "../../generic-responses";
import { SelectKeyValue } from "../../layouts/primeng/select.interface";
import { HoststatusObject } from '../hosts/hosts.interface';

/** INDEX PARAMS **/
export interface HostgroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[Hostgroups.description]': string,
    'filter[Containers.name]': string,
}

export function getDefaultHostgroupsIndexParams(): HostgroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Hostgroups.description]': "",
        'filter[Containers.name]': ""
    }
}

/** EXTENDED VIEW PARAMS **/
export interface HostgroupsExtendedParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    page: number,

    selected: number;
    'filter[Hosts.name]': string,
    'filter[Hoststatus.current_state][]': string[]
}

export function getDefaultHostgroupsExtendedParams(): HostgroupsExtendedParams {
    return {
        angular: true,
        scroll: true,
        page: 1,

        selected: 0,
        "filter[Hosts.name]": '',
        "filter[Hoststatus.current_state][]": [],
    }
}

/** EXTENDED VIEW SERVICE LIST PARAMS **/
export interface HostgroupsExtendedServiceListParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    page: number,

    'filter[Hosts.id]': number,
    'filter[servicename]': string,
    'filter[Servicestatus.current_state][]': string[],
}

export function getDefaultHostgroupsExtendedServiceListParams(): HostgroupsExtendedServiceListParams {
    return {
        angular: true,
        scroll: true,
        page: 1,

        "filter[Hosts.id]": 0,
        "filter[servicename]": '',
        "filter[Servicestatus.current_state][]": [],
    }
}

/** INDEX RESPONSE **/
export interface HostgroupsIndexRoot extends PaginateOrScroll {
    all_hostgroups: HostgroupsIndexHostgroup[]
    _csrfToken: string
}

export interface HostgroupsIndexHostgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url: string
    container: HostgroupsIndexContainer
    allowEdit: boolean
    hasSLAHosts: boolean
    additionalInformationExists: boolean
}

export interface HostgroupsIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

// COPY GET
export interface HostgroupsCopyGet {
    hostgroups: HostgroupsCopyGetHostgroup[]
    _csrfToken: string
}

export interface HostgroupsCopyGetHostgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url: string
    container: HostgroupsCopyGetContainer
    Error: GenericValidationError | null
}

export interface HostgroupsCopyGetContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}


export interface HostgroupsCopyPostResult {
    Source: {
        id: number
        name: string
    }
    Hostgroup: {
        container: {
            name: string
        }
        description: string
        id: number
    }
    Error: GenericValidationError | null
}


// EDIT GET
export interface HostgroupsEditGet {
    hostgroup: {
        Hostgroup: Hostgroup
    }
    _csrfToken: string
}

// EDIT POST
export interface Hostgroup {
    id?: number
    uuid?: string
    container_id?: number
    container: {
        containertype_id?: number
        id?: number
        lft?: number
        parent_id?: number
        rght?: number
        name: string
    }
    description: string
    hostgroup_url: string
    hosts: {
        _ids: number[]
    }
    hosttemplates: {
        _ids: number[]
    }
}


// LOAD CONTAINERS GET
export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

// LOAD HOSTS REQUEST
export interface LoadHostsRequest {
    containerId: number
    filter: {
        "Hosts.name": string
    }
    selected: any[]
}


// LOAD HOSTS RESPONSE
export interface LoadHostsResponse {
    hosts: SelectKeyValue[]
    _csrfToken: string
}

// LOAD HOSTTEMPLATES RESPONSE
export interface LoadHosttemplates {
    hosttemplates: SelectKeyValue[]
    _csrfToken: string
}

// ADD HOSTGROUP POST
export interface AddHostgroupsPost {
    Hostgroup: Hostgroup
}

/**********************
 *     Global action    *
 **********************/
// LOAD HOST GROUPS BY NAME
export interface HostgroupsLoadHostgroupsByStringParams {
    'angular': true,
    'filter[Containers.name]': string,
    'selected[]'?: number[]
}

// EXTENDED VIEW
export interface HostgroupExtendedRoot extends PaginateOrScroll {
    hostgroup: HostgroupExtended
    username: string
    _csrfToken: string
}

export interface HostgroupExtended {
    Hostgroup: {
        id: number
        uuid: string
        container_id: number
        description: string
        hostgroup_url: string
        container: {
            id: number
            containertype_id: number
            name: string
            parent_id: number
            lft: number
            rght: number
        }
        allowEdit: boolean
    }
    Hosts: HostGroupExtendedHost[]
    StatusSummary: {
        up: number
        down: any
        unreachable: any
    }
    hasSLAHosts: boolean
}

export interface HostGroupExtendedHost {
    Host: {
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
        usageFlag: any
        allow_edit: boolean
        disabled: boolean
        priority: number
        notes: string
        is_satellite_host: boolean
        name: string
    }
    Hoststatus: HoststatusObject,

    ServicestatusSummary: {
        state: {
            ok: number
            warning: number
            critical: number
            unknown: number
        }
        total: number
        cumulatedState: number
    },
    services: ServicesList[] | undefined,
    servicesRoot: LoadServicesForHosts | undefined,
    serviceParams: HostgroupsExtendedServiceListParams,
    Servicestatus: {
        current_state: {
            ok: false,
            warning: false,
            critical: false,
            unknown: false
        }
    }
}


// LOAD SERVICES FOR HOSTS
export interface LoadServicesForHosts extends PaginateOrScroll {
    all_services: ServicesList[]
    username: string
    satellites: SelectKeyValue[]
    _csrfToken: string

}

export interface ServicesList {
    Service: {
        id: number
        uuid: string
        servicename: string
        hostname: string
        description: any
        active_checks_enabled: boolean
        tags: any
        host_id: number
        allow_edit: boolean
        disabled: boolean
        serviceType: number
        priority: number
        has_graph: boolean
    }
    Host: {
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
        tags: any
        usageFlag: any
        allow_edit: boolean
        disabled: boolean
        priority: any
        notes: any
        is_satellite_host: boolean
        name: string
        satelliteName: string
    }

    Hoststatus: {
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
    Servicestatus: {
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
    ServiceType: {
        title: string
        color: string
        class: string
        icon: string
    }
    Downtime: any[]
    Acknowledgement: any[]
}

export interface HostgroupEntityWithJoinData {
    id: number,
    uuid: string,
    container_id: number,
    description: string,
    hostgroup_url: string,
    _joinData: {
        id: number,
        host_id: number,
        hostgroup_id: number,
    }
}

export interface HostgroupAppend {
    Hostgroup: {
        hosts: {
            _ids: number[]
        }
        id: number
    }
}

export interface HostgroupAdditionalInformation {
    AdditionalInformationExists: boolean
    _csrfToken: string
}
