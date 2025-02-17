import { WidgetTypes } from './widgets/widgets.enum';

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
    id?: number                   // not present when creating
    name: string
    dashboard_tab_id: number
    container_id: number
    user_id?: number            // not present when creating
    pinned: boolean
    created?: string            // not present when creating
    modified?: string           // not present when creating
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}

export interface DashboardWidget {
    type_id: WidgetTypes
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


export interface WidgetsForTabResponse {
    widgets: {
        DashboardTab: DashboardTabTabResponse,
        User: any[], // unclear
        Widget: WidgetGet[]
    },
    _csrfToken: string
}

export interface WidgetGet {
    id: number
    dashboard_tab_id: number
    type_id: WidgetTypes
    host_id?: number | null
    service_id?: number | null
    row: number
    col: number
    width: number
    height: number
    title: string
    color: string
    directive: string
    icon: string
    json_data?: string
    created: string
    modified: string
}

export interface DashboardTabTabResponse {
    id: number
    user_id: number
    position: number
    name: string
    shared: boolean
    source_tab_id?: any | null
    check_for_updates: number
    last_update: number
    locked: boolean
    created: string
    modified: string
    isOwner: boolean
}

// Used by the library to render the dasboards
export interface WidgetGetForRender {
    id: string // has to be a string to be tracked by ngFor
    dashboard_tab_id: number
    type_id: WidgetTypes
    host_id?: number | null
    service_id?: number | null
    row: number
    col: number
    width: number
    height: number
    title: string
    color: string
    directive: string
    icon: string
    json_data?: string
    created: string
    modified: string
}

export interface WidgetSaveGrid {
    Widget: {
        id: number,
        dashboard_tab_id: number
        col: number,
        row: number,
        title: string,
        width: number,
        height: number
        color: string
    }
}

export interface SharedTab {
    id: number
    position: number
    name: string
    shared: boolean
    source_tab_id: number
    check_for_updates: boolean
    last_update: number
    locked: boolean
}
