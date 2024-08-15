import { PaginatedRequest, PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface SystemHealthUsersIndex extends PaginateOrScroll {
    all_users: SystemHealthUser[]
}

export interface SystemHealthUsersIndexParams extends PaginatedRequest {
    'filter[Users.email]': string,
    'filter[full_name]': string,
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






