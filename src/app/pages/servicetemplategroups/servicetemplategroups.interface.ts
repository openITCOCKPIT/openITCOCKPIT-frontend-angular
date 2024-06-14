import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';

export interface ServiceTemplateGroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[Servicetemplategroups.description]': string,
    'filter[Containers.name]': string,
}

export function getDefaultServicetemplategroupsIndexParams(): ServiceTemplateGroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Servicetemplategroups.description]': "",
        'filter[Containers.name]': ""
    }
}


/* INDEX */
export interface ServiceTemplateGroupsIndexRoot extends PaginateOrScroll {
    all_servicetemplategroups: ServiceTemplateGroupsIndex[]
    _csrfToken: string
}

export interface ServiceTemplateGroupsIndex {
    id: number
    uuid: string
    container_id: number
    description: string
    created: string
    modified: string
    container: ServiceTemplateGroupsIndexContainer
    allow_edit: boolean
}

export interface ServiceTemplateGroupsIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

/* EDIT GET */
export interface ServiceTemplateGroupsGetEditRoot {
    servicetemplategroup: ServiceTemplateGroupsGetEditServicetemplategroup
    _csrfToken: string
}

export interface ServiceTemplateGroupsGetEditServicetemplategroup {
    Servicetemplategroup: ServiceTemplateGroupsGetEditServicetemplategroup2
}

export interface ServiceTemplateGroupsGetEditServicetemplategroup2 {
    id: number
    uuid: string
    container_id: number
    description: string
    created: string
    modified: string
    servicetemplates: ServiceTemplateGroupsGetEditServicetemplates
    container: ServiceTemplateGroupsGetEditContainer
}

export interface ServiceTemplateGroupsGetEditServicetemplates {
    _ids: number[]
}

export interface ServiceTemplateGroupsGetEditContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

/* EDIT POST */
export interface ServiceTemplateGroupsGetEditPostRoot {
    Servicetemplategroup: ServiceTemplateGroupssGetEditPostServicetemplategroup
}

export interface ServiceTemplateGroupssGetEditPostServicetemplategroup {
    container: ServiceTemplateGroupsGetEditPostContainer
    container_id: number
    created: string
    description: string
    id: number
    modified: string
    servicetemplates: ServiceTemplateGroupssGetEditPostServicetemplates
    uuid: string
}

export interface ServiceTemplateGroupsGetEditPostContainer {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}

export interface ServiceTemplateGroupssGetEditPostServicetemplates {
    _ids: number[]
}

/* ADD */
export interface ServiceTemplateGroupsAddPostRoot {
    Servicetemplategroup: ServiceTemplateGroupsAddPostServicetemplategroup
}

export interface ServiceTemplateGroupsAddPostServicetemplategroup {
    container: ServiceTemplateGroupsAddPostContainer
    description: string
    servicetemplates: ServiceTemplateGroupsAddPostServicetemplates
}

export interface ServiceTemplateGroupsAddPostContainer {
    name: string
    parent_id: number | null
}

export interface ServiceTemplateGroupsAddPostServicetemplates {
    _ids: number[]
}

/* COPY POST */
export interface ServiceTemplateGroupsGetCopyPost {
    data: ServiceTemplateGroupsGetCopyPostData[]
}

export interface ServiceTemplateGroupsGetCopyPostData {
    Servicetemplategroup: ServiceTemplateGroupsGetCopyPostServicetemplategroup
    Source: ServiceTemplateGroupsGetCopyPostSource
    Error: GenericValidationError | null
}

export interface ServiceTemplateGroupsGetCopyPostServicetemplategroup {
    container: ServiceTemplateGroupsGetCopyPostContainer
    description: string
}

export interface ServiceTemplateGroupsGetCopyPostContainer {
    name: string
}

export interface ServiceTemplateGroupsGetCopyPostSource {
    id: number
    name: string
}

/* COPY GET */
export interface ServiceTemplateGroupssGetCopyGetRoot {
    servicetemplategroups: ServiceTemplateGroupsGetCopyGetServicetemplategroup[]
    _csrfToken: string
}

export interface ServiceTemplateGroupsGetCopyGetServicetemplategroup {
    id: number
    uuid: string
    container_id: number
    description: string
    created: string
    modified: string
    container: ServiceTemplateGroupsGetCopyGetContainer
}

export interface ServiceTemplateGroupsGetCopyGetContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

/* LOAD CONTAINERS */
export interface LoadContainersRoot {
    containers: LoadContainersContainer[]
    _csrfToken: string
}

export interface LoadContainersContainer {
    key: number
    value: string
}


/* LOAD SERVICE TEMPLATES */
export interface LoadServiceTemplatesRoot {
    servicetemplates: LoadServiceTemplatesServicetemplate[]
    _csrfToken: string
}

export interface LoadServiceTemplatesServicetemplate {
    key: number
    value: string
}

/** LOAD SERVICE TEMPLATE GROUPS BY STRING */
export interface LoadServicetemplategroupsByString {
    servicetemplategroups: LoadServicetemplategroupsByStringServicetemplategroup[]
    _csrfToken: string
}

export interface LoadServicetemplategroupsByStringServicetemplategroup {
    key: number
    value: string
}

/** LOAD HOST GROUPS BY STRING */
export interface LoadHostgroupsByString {
    hostgroups: LoadHostGroupsByStringHostgroup[]
    _csrfToken: string
}

export interface LoadHostGroupsByStringHostgroup {
    key: number
    value: string
}

/** ALLOCATE TO HOSTGROUP POST **/
export interface AllocateToHostgroupPost {
    Host: AllocateToHostgroupHost
    Servicetemplates: AllocateToHostgroupServicetemplates
}

export interface AllocateToHostgroupHost {
    id: number|null
}

export interface AllocateToHostgroupServicetemplates {
    _ids: number[]
}

/** ALLOCATE TO HOSTGROUP GET **/
export interface AllocateToHostGroupGet {
    hostsWithServicetemplatesForDeploy: AllocateToHostGroupGetHostsWithServicetemplatesForDeploy[]
    _csrfToken: string
}

export interface AllocateToHostGroupGetHostsWithServicetemplatesForDeploy {
    host: AllocateToHostGroupGetHost
    areAllCreateServiceOnTargetHostTrue: boolean
    services: AllocateToHostGroupGetService[]
}

export interface AllocateToHostGroupGetHost {
    id: number
    uuid: string
    hostname: string
    address: string
    description: any
    hosttemplate_id: number
    active_checks_enabled: any
    satelliteId: number
    containerId: number
    containerIds: any
    tags: any
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

export interface AllocateToHostGroupGetService {
    servicetemplate: AllocateToHostGroupGetServicetemplate
    doesServicetemplateExistsOnTargetHost: boolean
    doesServicetemplateExistsOnTargetHostAndIsDisabled: boolean
    createServiceOnTargetHost: boolean
}

export interface AllocateToHostGroupGetServicetemplate {
    id: number
    name: string
    description: string
    _joinData: AllocateToHostGroupGetJoinData
}

export interface AllocateToHostGroupGetJoinData {
    id: number
    servicetemplate_id: number
    servicetemplategroup_id: number
}

/** ALLOCATE TO HOST GET **/
export interface AllocateToHostGet {
    servicetemplatesForDeploy: AllocateToHostGetServicetemplatesForDeploy[]
    _csrfToken: string
}

export interface AllocateToHostGetServicetemplatesForDeploy {
    servicetemplate: AllocateToHostGetServicetemplate
    doesServicetemplateExistsOnTargetHost: boolean
    doesServicetemplateExistsOnTargetHostAndIsDisabled: boolean
    createServiceOnTargetHost: boolean
}

export interface AllocateToHostGetServicetemplate {
    id: number
    name: string
    description: string
    _joinData: AllocateToHostGetJoinData
}

export interface AllocateToHostGetJoinData {
    id: number
    servicetemplate_id: number
    servicetemplategroup_id: number
}

/** ALLOCATE TO HOST POST **/
export interface AllocateToHostPost {
    Host: AllocateToHostPostHost
    Servicetemplates: AllocateToHostPostServicetemplates
}

export interface AllocateToHostPostHost {
    id: number
}

export interface AllocateToHostPostServicetemplates {
    _ids: number[]
}

/** ALLOCATE TO HOST POST RESPONSE */
export interface AllocateToMatchingHostgroupResponse {
    success: boolean
    message: string
    _csrfToken: string
}

/** LOAD HOSTS BY STRING RESPONSE **/
export interface LoadHostsByStringResponse {
    hosts: LoadHostsByStringResponseHost[]
    _csrfToken: string
}

export interface LoadHostsByStringResponseHost {
    key: number
    value: string
}
