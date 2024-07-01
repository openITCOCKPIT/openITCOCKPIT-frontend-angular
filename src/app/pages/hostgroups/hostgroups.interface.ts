import {PaginateOrScroll} from "../../layouts/coreui/paginator/paginator.interface";
import {GenericValidationError} from "../../generic-responses";
import {SelectKeyValue} from "../../layouts/primeng/select.interface";

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

