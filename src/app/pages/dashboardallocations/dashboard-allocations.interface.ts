import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface DashboardAllocationsIndex extends PaginateOrScroll {
    all_dashboardtab_allocations: DashboardTabAllocationWithUsersAndUsergroups[]
    _csrfToken: string
}

export interface DashboardTabAllocationWithUsersAndUsergroups {
    id?: number                   // not present when creating
    name: string
    dashboard_tab_id: number
    dashboard_tab: {
        name: string
    }
    container_id: number
    author: string
    user_id?: number            // not present when creating
    pinned: boolean
    created?: string            // not present when creating
    modified?: string           // not present when creating
    usergroups: DashboardTabAllocationToUsergroup[]
    users: DashboardTabAllocationToUser[]
}

export interface DashboardTabAllocationToUser {
    full_name: string
    _joinData: {
        id: number
        user_id: number
        dashboard_tab_allocation_id: number
    }
}

export interface DashboardTabAllocationToUsergroup {
    name: string
    _joinData: {
        id: number
        usergroup_id: number
        dashboard_tab_allocation_id: number
    }
}

export interface TabAllocationsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[DashboardTabAllocations.id][]': number[],
    'filter[DashboardTabAllocations.name]': string
}

export function getDefaultTabAllocationsIndexParams(): TabAllocationsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'DashboardTabAllocations.name',
        page: 1,
        direction: 'asc',
        'filter[DashboardTabAllocations.id][]': [],
        'filter[DashboardTabAllocations.name]': ""
    }
}


export interface DashboardTabAllocationGet {
    allocation: {
        DashboardAllocation: DashboardTabAllocationPost
    }
}


export interface DashboardTabAllocationPost {
    id?: number                   // not present when creating
    name: string
    dashboard_tab_id: number
    container_id: number
    pinned: boolean
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}

export interface DashboardAllocationElements {
    dashboard_tabs: SelectKeyValue[]
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[]
    allocated_dashboard_tabs: AllocatedDashboardTab[]
}

export interface AllocatedDashboardTab {
    id: number
    dashboard_tab_id: number
}
