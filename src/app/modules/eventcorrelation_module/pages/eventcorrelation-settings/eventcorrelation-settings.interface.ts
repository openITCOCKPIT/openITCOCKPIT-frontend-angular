export interface EventcorrelationSettingsRoot {
    currentEventcorrelationSettings: CurrentEventcorrelationSettings
}

export interface CurrentEventcorrelationSettings {
    id: number
    configuration_option: string
    monitoring_system: string
    status_disabled_service: number
    status_downtime_service: number
    connection_line: string
    created: string
    modified: string
}

export interface EventcorrelationSettingsPost {
    monitoring_system: string
    configuration_option: number
    status_disabled_service: number
    status_downtime_service: number
    connection_line: string
    EVC_CONSIDER_STATETYPE: boolean
    EVC_CONSIDER_STATE_COUNT: boolean
    EVC_REFLECT_CRITICAL_STATE: boolean
    EVC_SHOW_INFO_FOR_DISABLED_SERVICES: boolean
    EVC_ANIMATE_CONNECTIONS: boolean
}
