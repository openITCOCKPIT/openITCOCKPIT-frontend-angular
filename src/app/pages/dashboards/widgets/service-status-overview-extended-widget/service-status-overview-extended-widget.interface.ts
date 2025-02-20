export interface ServiceStatusOverviewExtendedWidgetResponse {
    config: ServiceStatusOverviewExtendedWidgetConfig
    statusCount: string
    serviceIds: number[]
    _csrfToken: string
}

export interface ServiceStatusOverviewExtendedWidgetConfig {
    Servicestatus: ServicestatusExtendedWidgetConfig
    Host: {
        name: string
        name_regex: boolean
        keywords: string
        not_keywords: string
    }
    Service: {
        servicename: string
        servicename_regex: boolean
        address: string
        address_regex: boolean
        keywords: string
        not_keywords: string
    }
    Servicegroup: {
        _ids: string
    }
}

export interface ServicestatusExtendedWidgetConfig {
    current_state: number
    acknowledged: boolean
    not_acknowledged: boolean
    in_downtime: boolean
    not_in_downtime: boolean
    state_older_than: null | number
    state_older_than_unit: string
}
