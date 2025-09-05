import { PaginateOrScroll } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { UserIdAndUsername } from '../../../../../pages/users/users.interface';
import { Container } from '../../../../../pages/containers/containers.interface';
import { GenericIdAndName } from '../../../../../generic.interfaces';

export interface ResourcegroupsSummaryResponse extends PaginateOrScroll {
    resourcegroups: ResourcegroupMap[]
    globalStatusSummary: GlobalStatusSummary
    mapSummary: ResourcegroupsSummaryMap
    _csrfToken: any
}

export interface ResourcegroupMap {
    id: number
    container_id: number
    description: string
    last_state: number
    last_update: string
    last_send_date: string
    last_send_state: number
    created?: string
    modified: string
    resources: ResourceMap[]
    container: Container
    allow_edit: boolean
    users: UserIdAndUsername[]
    managers: UserIdAndUsername[]
    region_managers: UserIdAndUsername[]
    mailinglist_users: GenericIdAndName[]
    mailinglist_managers: GenericIdAndName[]
    mailinglist_region_managers: GenericIdAndName[]
    resource_count: number
    children: ResourcegroupMapChildren[]
    statesummary: number[]
}

export interface ResourceMap {
    id: number
    name: string
    description: string
    resourcegroup_id: number
    current_status: number
    status: number
    last_update: string
    comment?: string
    username?: string
    user?: UserIdAndUsername
}


export interface ResourcegroupsSummaryMap {
    name: string
    color: string
    children: ResourcegroupMapChildren[]
}

export interface ResourcegroupMapChildren {
    id: number
    resourcegroup_id: number
    name: string
    size: number
    state: number
    color: string
    type: string
}

export interface GlobalStatusSummary {
    "0": number
    "1": number
    "2": number
    "3": number
    total: number
}
