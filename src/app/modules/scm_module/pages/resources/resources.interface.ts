import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Resourcegroup } from '../resourcegroups/resourcegroups.interface';

export interface ResourcesIndex extends PaginateOrScroll {
    all_resources: ResourceEntity[]
    myResourceGroupIds: number[]
    settings: ScmSettings
    _csrfToken: string
}

export interface ResourceEntity {
    id: number
    name: string
    description: string
    comment?: string
    resourcegroup_id: number
    status: number
    last_update: string
    modified: string
    is_expired: boolean
    user: {
        id: number
        firstname: string
        lastname: string
    } | null
    resourcegroup: Resourcegroup
    allow_edit: boolean
    allow_set_status: boolean
    my_resource: boolean
    human_last_updated: string
}

export interface Resource {
    id: number
    resourcegroup_id: number
    user_id: number
    name: string
    description: string
    status: number
    comment: any
    last_update: string
    status_log_id: number
    created: string
    modified: string
}

export interface Settings {
    deadline: string
    reminder_time: number
    allow_overwriting: number
    require_user_assigment: number
    id: number
}


export interface ScmSettings {
    deadline: string
    reminder_time: number
    allow_overwriting: number
    require_user_assigment: number
    id: number
}

export interface ResourcesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Resources.id][]': [],
    'filter[Resources.name]': string
    'filter[Resources.description]': string
    'filter[Resources.resourcegroup_id][]': number[]
    'filter[status][]': number[]
}


export function getResourcesIndexParams(): ResourcesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Resources.name',
        page: 1,
        direction: 'asc',
        'filter[Resources.id][]': [],
        'filter[Resources.name]': '',
        'filter[Resources.description]': '',
        'filter[Resources.resourcegroup_id][]': [],
        'filter[status][]': []
    }
}

export interface ResourceStatus {
    unconfirmed: number
    ok: number
    warning: number
    critical: number
}

export function getResourceStatusForApi(reasonType: ResourceStatus): number[] {
    let result = [];
    if (reasonType.unconfirmed) {
        result.push(0);
    }
    if (reasonType.ok) {
        result.push(1);
    }
    if (reasonType.warning) {
        result.push(2);
    }
    if (reasonType.critical) {
        result.push(3);
    }
    return result;
}

export interface ResourcesPost {
    id?: number
    name: string
    description: string
    resourcegroup_id: number
}


export interface ResourcesGet {
    resource: {
        Resource: ResourcesPost
    }
}

export interface StatuslogParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | ''
}


export function getStatuslogParams(): StatuslogParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ResourceStatusLog.id',
        page: 1,
        direction: 'desc'
    }
}

export interface StatuslogResponse extends PaginateOrScroll {
    resource: Resource
    statuslog: Statuslog[]
    success: boolean
    _csrfToken: any
}

export interface Statuslog {
    state_time: string
    timeAgoInWords: string
    user: {
        id: number
        firstname: string
        lastname: string
    }
    comment?: string
    status: number
}

export interface SetStatusItem {
    id: number | string,           // ID of the item to set status
    resource: ResourceEntity
}
