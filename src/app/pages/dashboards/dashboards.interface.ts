export interface DashboardsIndexResponse {
    tabs: DashboardTab[]
    widgets: DashboardWidget[]
    tabRotationInterval: number
    askForHelp: boolean
    _csrfToken: string
}

export interface DashboardTab {
    id: number
    position: number
    name: string
    shared: boolean
    source_tab_id: number
    check_for_updates: boolean
    last_update: number
    locked: boolean
    pinned: boolean
    isOwner: boolean
    dashboard_tab_allocation?: DashboardTabAllocation
}

export interface DashboardTabAllocation {
    id: number
    name: string
    dashboard_tab_id: number
    container_id: number
    user_id: number
    pinned: boolean
    created: string
    modified: string
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}

export interface DashboardWidget {
    type_id: number
    title: string
    icon: string
    directive: string
    width: number
    height: number
    default?: {
        row: number
        col: number
    }
}
