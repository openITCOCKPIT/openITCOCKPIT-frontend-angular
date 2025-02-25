import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { UserIdAndUsername } from '../../../../pages/users/users.interface';
import { ContainerEntity } from '../../../../pages/containers/containers.interface';

export interface ResourcegroupsIndex extends PaginateOrScroll {
    all_resourcegroups: Resourcegroup[]
    _csrfToken: string
}

export interface Resourcegroup{
    id: number
    container_id: number
    description: string
    last_state: number
    last_update: string
    last_send_date: string
    last_send_state: number
    created?: string
    modified: string
    resources: Resource[]
    users: UserIdAndUsername[]
    container: ContainerEntity
    allow_edit: boolean
    managers: UserIdAndUsername[]
    region_managers: UserIdAndUsername[]
    resource_count: number
    statesummary: number[]
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

export interface ResourcegroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Resourcegroup.id][]': [],
    'filter[Containers.name]': string
    'filter[Resourcegroups.description]': string
}


export function getResourcegroupsIndexParams(): ResourcegroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Resourcegroup.id][]': [],
        'filter[Containers.name]': '',
        'filter[Resourcegroups.description]': ''
    }
}
