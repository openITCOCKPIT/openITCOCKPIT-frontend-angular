import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { Container } from '../containers/containers.interface';

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
    container: Container
    allow_edit: boolean
}

/* EDIT GET */
export interface ServiceTemplateGroupsGetEditRoot {
    servicetemplategroup: {
        Servicetemplategroup: {
            id: number
            uuid: string
            container_id: number
            description: string
            created: string
            modified: string
            servicetemplates: {
                _ids: number[]
            }
            container: Container
        }
    }
    _csrfToken: string
}

/* EDIT POST */
export interface ServiceTemplateGroupssGetEditPostServicetemplategroup {
    container: Container
    container_id: number
    created: string
    description: string
    id: number
    modified: string
    servicetemplates: {
        _ids: number[]
    }
    uuid: string
}


/* ADD */
export interface ServiceTemplateGroupsAddPostRoot {
    Servicetemplategroup: ServiceTemplateGroupsAddPostServicetemplategroup
}

export interface ServiceTemplateGroupsAddPostServicetemplategroup {
    container: {
        name: string
        parent_id: number | null
    }
    description: string
    servicetemplates: {
        _ids: number[]
    }
}

/* COPY POST */
export interface ServiceTemplateGroupsGetCopyPost {
    data: ServiceTemplateGroupsGetCopyPostData[]
}

export interface ServiceTemplateGroupsGetCopyPostData {
    Servicetemplategroup: {
        container: {
            name: string
        }
        description: string
    },
    Source: {
        id: number
        name: string
    }
    Error: GenericValidationError | null
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
    container: Container
}

/* LOAD CONTAINERS */
export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

/* LOAD SERVICE TEMPLATES */
export interface LoadServiceTemplatesRoot {
    servicetemplates: SelectKeyValue[]
    _csrfToken: string
}

/** LOAD SERVICE TEMPLATE GROUPS BY STRING */
export interface LoadServicetemplategroupsByString {
    servicetemplategroups: SelectKeyValue[]
    _csrfToken: string
}

/** LOAD HOST GROUPS BY STRING */
export interface LoadHostgroupsByString {
    hostgroups: SelectKeyValue[]
    _csrfToken: string
}

/** ALLOCATE TO HOSTGROUP POST **/
export interface AllocateToHostgroupPost {
    Host: {
        id: number | null
    }
    Servicetemplates: {
        _ids: number[]
    }
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
    _joinData: {
        id: number
        servicetemplate_id: number
        servicetemplategroup_id: number
    }
}

/** ALLOCATE TO HOST POST **/
export interface AllocateToHostPost {
    Host: {
        id: number
    }
    Servicetemplates: {
        _ids: number[]
    }
}

/** ALLOCATE TO HOST POST RESPONSE */
export interface AllocateToMatchingHostgroupResponse {
    success: boolean
    message: string
    _csrfToken: string
}

/** LOAD HOSTS BY STRING RESPONSE **/
export interface LoadHostsByStringResponse {
    hosts: SelectKeyValue[]
    _csrfToken: string
}

/** Servicetemplategroups append **/
export interface ServicetemplategroupsAppendPost {
    Servicetemplategroup: {
        id: number,
        servicetemplates: {
            _ids: number[]
        }
    }
}
