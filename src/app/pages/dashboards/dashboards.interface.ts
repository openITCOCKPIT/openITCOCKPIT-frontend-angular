import { WidgetTypes } from './widgets/widgets.enum';
import { HoststatusObject } from '../hosts/hosts.interface';
import { HostgroupSummaryStateHosts } from '../hosts/summary_state.interface';

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

export interface ParentOutagesResponse {
    parent_outages: ParentOutage[]
    _csrfToken: string
}

export interface ParentOutage {
    id: number
    uuid: string
    name: string
    Hoststatus: HoststatusObject
}

export interface CalendarResponse {
    dateDetails: CalendarDateDetails
    _csrfToken: string
}

export interface CalendarDateDetails {
    dayNumber: number
    weekday: string
    monthName: string
    start: string
    end: string
    today_timestamp: number
    yesterday_timestamp: number
    start_timestamp: number
    end_timestamp: number
    days: CalendarDay[]
    weekdayNames: {
        [key: string]: string
    }
}

export interface CalendarDay {
    cw: string
    days: CalendarDayDetails[]
}

export interface CalendarDayDetails {
    day?: number
    weekday?: number
    timestamp?: number
}

export interface TacticalOverviewHostsResponse {
    config: TacticalOverviewHostsConfig
    hoststatusSummary: HostgroupSummaryStateHosts
    servicestatusSummary: any[]
    _csrfToken: string
}

export interface TacticalOverviewHostsConfig {
    Host: TacticalOverviewHostConfig
    Service: TacticalOverviewServiceConfig
    Hostgroup: {
        _ids: number[]
    }
    Servicegroup: {
        _ids: number[]
    }
}

export interface TacticalOverviewHostConfig {
    name: string
    name_regex: boolean
    address: string
    address_regex: boolean
    keywords: string
    not_keywords: string
}

export interface TacticalOverviewServiceConfig {
    servicename: string
    servicename_regex: boolean
    keywords: string
    not_keywords: string
}

export interface TacticalOverviewHostsFilter {
    Host: {
        name: string
        name_regex: boolean
        keywords: string
        not_keywords: string
        address: string
        address_regex: boolean
    },
    Hostgroup: {
        _ids: number[]
    }
}

export function getTacticalOverviewHostsFilter(): TacticalOverviewHostsFilter {
    return {
        Host: {
            name: '',
            name_regex: false,
            keywords: '',
            not_keywords: '',
            address: '',
            address_regex: false
        },
        Hostgroup: {
            _ids: []
        }
    }
}
