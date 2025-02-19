export interface ServiceStatusOverviewWidgetResponse {
    config: ServiceStatusOverviewWidgetConfig
    statusCount: string
    _csrfToken: string
}

export interface ServiceStatusOverviewWidgetConfig {
    Servicestatus: ServicestatusWidgetConfig
    Host: {
        name: string
    }
    Service: {
        name: string
    }
}

export interface ServicestatusWidgetConfig {
    current_state: number
    acknowledged: boolean
    not_acknowledged: boolean
    in_downtime: boolean
    not_in_downtime: boolean
}
