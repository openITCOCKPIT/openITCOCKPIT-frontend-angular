import { PaginateOrScroll } from "../../layouts/coreui/paginator/paginator.interface";
import { GenericValidationError } from "../../generic-responses";
import { SelectKeyValue } from "../../layouts/primeng/select.interface";

/** INDEX PARAMS **/
export interface ServicegroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[Servicegroups.description]': string,
    'filter[Containers.name]': string,
}

export function getDefaultServicegroupsIndexParams(): ServicegroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Servicegroups.description]': "",
        'filter[Containers.name]': ""
    }
}

/** EXTENDED VIEW PARAMS **/
export interface ServicegroupsExtendedParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    page: number,

    selected: number;
    'filter[Services.name]': string,
    'filter[servicename]': string,
    'filter[Servicestatus.current_state][]': string[]
}

export function getDefaultServicegroupsExtendedParams(): ServicegroupsExtendedParams {
    return {
        angular: true,
        scroll: true,
        page: 1,

        selected: 0,
        "filter[Services.name]": '',
        "filter[servicename]": '',
        "filter[Servicestatus.current_state][]": [],
    }
}

/** EXTENDED VIEW SERVICE LIST PARAMS **/
export interface ServicegroupsExtendedServiceListParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    page: number,

    'filter[Services.id]': number,
    'filter[servicename]': string,
    'filter[Servicestatus.current_state][]': string[],
}

export function getDefaultServicegroupsExtendedServiceListParams(): ServicegroupsExtendedServiceListParams {
    return {
        angular: true,
        scroll: true,
        page: 1,

        "filter[Services.id]": 0,
        "filter[servicename]": '',
        "filter[Servicestatus.current_state][]": [],
    }
}

/** INDEX RESPONSE **/
export interface ServicegroupsIndexRoot extends PaginateOrScroll {
    all_servicegroups: ServicegroupsIndexServicegroup[]
    _csrfToken: string
}

export interface ServicegroupsIndexServicegroup {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url: string
    container: ServicegroupsIndexContainer
    allow_edit: boolean
}

export interface ServicegroupsIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

// COPY GET
export interface ServicegroupsCopyGet {
    servicegroups: ServicegroupsCopyGetServicegroup[]
    _csrfToken: string
}

export interface ServicegroupsCopyGetServicegroup {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url: string
    container: ServicegroupsCopyGetContainer
    Error: GenericValidationError | null
}

export interface ServicegroupsCopyGetContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}


export interface ServicegroupsCopyPostResult {
    Source: {
        id: number
        name: string
    }
    Servicegroup: {
        container: {
            name: string
        }
        description: string
        id: number
    }
    Error: GenericValidationError | null
}


// EDIT GET
export interface ServicegroupsEditGet {
    servicegroup: {
        Servicegroup: Servicegroup
    }
    _csrfToken: string
}

// EDIT POST
export interface Servicegroup {
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
    servicegroup_url: string
    services: {
        _ids: number[]
    }
    servicetemplates: {
        _ids: number[]
    }
}


// LOAD CONTAINERS GET
export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

// LOAD SERVICES REQUEST
export interface LoadServicesRequest {
    containerId: number
    filter: {
        "servicename": string
    }
    selected: any[]
}


// LOAD SERVICES RESPONSE
export interface LoadServicesResponse {
    services: ServicesListService[]
    _csrfToken: string
}

export interface ServicesListService {
    key: number
    value: {
        servicename: string,
        id: number,
        disabled: number
    }
}

// LOAD SERVICETEMPLATES RESPONSE
export interface LoadServicetemplates {
    servicetemplates: SelectKeyValue[]
    _csrfToken: string
}

// ADD SERVICEGROUP POST
export interface AddServicegroupsPost {
    Servicegroup: Servicegroup
}

/**********************
 *     Global action    *
 **********************/
// LOAD SERVICE GROUPS BY NAME
export interface ServicegroupsLoadServicegroupsByStringParams {
    'angular': true,
    'filter[Containers.name]': string,
    'selected[]'?: number[]
}
// EXTENDED VIEW
export interface ServiceGroupExtendedRoot extends PaginateOrScroll {
    servicegroup: {
        Servicegroup: Servicegroup
        Services: Service[]
        StatusSummary: StatusSummary
    }
    username: string
    _csrfToken: string
}


export interface Service {
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
    Host:  {
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
    }
    Hoststatus: {
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
}



export interface StatusSummary {
    ok: number
    warning: any
    critical: any
    unknown: any
}


// LOAD SERVICES FOR SERVICES
export interface LoadServicesForServices extends PaginateOrScroll {
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
        address: string
        description: any
        servicetemplate_id: any
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
        is_satellite_service: boolean
        name: string
        satelliteName: string
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

export interface ServicegroupAppend {
    Servicegroup: {
        services: {
            _ids: number[]
        }
        id: number
    }
}
