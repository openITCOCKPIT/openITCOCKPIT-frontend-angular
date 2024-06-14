import {PaginateOrScroll} from "../../layouts/coreui/paginator/paginator.interface";
import {GenericValidationError} from "../../generic-responses";

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

// COPY POST
export interface HostgroupsCopyPostRoot {
    result: HostgroupsCopyPostResult[]
    _csrfToken: string
}

export interface HostgroupsCopyPostResult {
    Source: HostgroupsCopyPostSource
    Hostgroup: HostgroupsCopyPostHostgroup
    Error: GenericValidationError | null
}

export interface HostgroupsCopyPostSource {
    id: number
    name: string
}

export interface HostgroupsCopyPostHostgroup {
    container: HostgroupsCopyPostContainer
    description: string
    id: number
}

export interface HostgroupsCopyPostContainer {
    name: string
}

// EDIT GET
export interface HostgroupsEditGet {
    hostgroup: HostgroupsEditGetHostgroups
    _csrfToken: string
}

export interface HostgroupsEditGetHostgroups {
    Hostgroup: HostgroupsEditGetHostgroup2
}

export interface HostgroupsEditGetHostgroup2 {
    id: number
    uuid: string
    container_id: number
    description: string
    hostgroup_url: string
    container: HostgroupsEditGetContainer
    hosttemplates: HostgroupsEditGetHosttemplates
    hosts: HostgroupsEditGetHosts
}

export interface HostgroupsEditGetContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

export interface HostgroupsEditGetHosttemplates {
    _ids: number[]
}

export interface HostgroupsEditGetHosts {
    _ids: any[]
}


// EDIT POST
export interface HostgroupsEditPost {
    Hostgroup: HostgroupsEditPostHostgroup
}

export interface HostgroupsEditPostHostgroup {
    container: HostgroupsEditPostContainer
    container_id: number
    description: string
    hostgroup_url: string
    hosts: HostgroupsEditPostHosts
    hosttemplates: HostgroupsEditPostHosttemplates
    id: number
    uuid: string
}

export interface HostgroupsEditPostContainer {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}

export interface HostgroupsEditPostHosts {
    _ids: any[]
}

export interface HostgroupsEditPostHosttemplates {
    _ids: number[]
}

// LOAD CONTAINERS GET
export interface LoadContainersRoot {
    containers: LoadContainersContainer[]
    _csrfToken: string
}

export interface LoadContainersContainer {
    key: number
    value: string
}

// LOAD HOSTS REQUEST
export interface LoadHostsRequest {
    containerId: number
    filter: LoadHostsRequestFilter
    selected: any[]
}

export interface LoadHostsRequestFilter {
    "Hosts.name": string
}


// LOAD HOSTS RESPONSE
export interface LoadHostsResponse {
    hosts: LoadHostsResponseHost[]
    _csrfToken: string
}

export interface LoadHostsResponseHost {
    key: number
    value: string
}

// LOAD HOSTTEMPLATES RESPONSE
export interface LoadHosttemplates {
    hosttemplates: LoadHosttemplatesHosttemplate[]
    _csrfToken: string
}

export interface LoadHosttemplatesHosttemplate {
    key: number
    value: string
}

// ADD HOSTGROUP POST
export interface AddHostgroupsPost {
    Hostgroup: AddHostgroupsPostHostgroup
}

export interface AddHostgroupsPostHostgroup {
    container: AddHostgroupsPostContainer
    description: string
    hostgroup_url: string
    hosts: AddHostgroupsPostHosts
    hosttemplates: AddHostgroupsPostHosttemplates
}

export interface AddHostgroupsPostContainer {
    name: string
    parent_id: number | null
}

export interface AddHostgroupsPostHosts {
    _ids: number[]
}

export interface AddHostgroupsPostHosttemplates {
    _ids: number[]
}
