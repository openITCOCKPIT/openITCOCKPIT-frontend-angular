export interface HostStatusOverviewExtendedWidgetResponse {
    config: HostStatusOverviewExtendedWidgetConfig
    statusCount: string
    hostIds: number[]
    _csrfToken: string
}

export interface HostStatusOverviewExtendedWidgetConfig {
    Hoststatus: HoststatusExtendedWidgetConfig
    Host: {
        name: string
        name_regex: boolean
        address: string
        address_regex: boolean
        keywords: string
        not_keywords: string
    }
    Hostgroup: {
        _ids: string
    }
}

export interface HoststatusExtendedWidgetConfig {
    current_state: number
    acknowledged: boolean
    not_acknowledged: boolean
    in_downtime: boolean
    not_in_downtime: boolean
    state_older_than: null | number
    state_older_than_unit: string
}
