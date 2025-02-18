export interface HostStatusOverviewWidgetResponse {
    config: HostStatusOverviewWidgetConfig
    statusCount: string
    _csrfToken: string
}

export interface HostStatusOverviewWidgetConfig {
    Hoststatus: HoststatusWidgetConfig
    Host: {
        name: string
    }
}

export interface HoststatusWidgetConfig {
    current_state: number
    acknowledged: boolean
    not_acknowledged: boolean
    in_downtime: boolean
    not_in_downtime: boolean
}
