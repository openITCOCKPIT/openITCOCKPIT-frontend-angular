import { PaginatedRequest, PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface SystemHealthUsersIndex extends PaginateOrScroll {
    all_users: SystemHealthUser[]
}

export interface SystemHealthUsersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Users.email]': string,
    'filter[full_name]': string,
}

export function getDefaultSystemHealthUsersParams(): SystemHealthUsersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'full_name',
        page: 1,
        direction: 'asc',
        'filter[Users.email]': '',
        'filter[full_name]': '',
    }
}


export interface SystemHealthUser {
    id: number
    email: string
    full_name: string
    usercontainerroles: any[]
    containers: {
        id: number
        containertype_id: number
        name: string
        parent_id: any
        lft: number
        rght: number
        _joinData: {
            id: number
            user_id: number
            container_id: number
            permission_level: number
        }
    }[]
    system_health_user: {
        id: number
        user_id: number
        notify_on_warning: number
        notify_on_critical: number
        notify_on_recovery: number
        created: string
        modified: string
    }
    _matchingData: {
        SystemHealthUsers: {
            id: number
            notify_on_warning: number
            notify_on_critical: number
            notify_on_recovery: number
        }
    }
    allow_edit: boolean
}

export interface LoadUsersRoot {
    users: User[]
    _csrfToken: string
}

export interface User {
    id: number
    key: number
    value: string
    usercontainerroles: any[]
    containers: {
        id: number
        containertype_id: number
        name: string
        parent_id: any
        lft: number
        rght: number
        _joinData:  {
            id: number
            user_id: number
            container_id: number
            permission_level: number
        }
    }[]
    system_health_user: any
}




export interface SystemHealthUserAddRoot {
    SystemHealthUser: SystemHealthUserAdd
}

export interface SystemHealthUserAdd {
    notify_on_critical: number
    notify_on_recovery: number
    notify_on_warning: number
    user_ids?: number[]
    user_id?: number
}

export interface SystemHealthUserEditGet {
    systemHealthUser: SystemHealthUserAdd
    user: SystemHealthUserDetails
    _csrfToken: string
}

export interface SystemHealthUserDetails {
    email: string
    firstname: string
    lastname: string
}
export interface SystemHealthUserEditPost {
    SystemHealthUser: SystemHealthUserAdd
    User: SystemHealthUserDetails
    id: number
}


