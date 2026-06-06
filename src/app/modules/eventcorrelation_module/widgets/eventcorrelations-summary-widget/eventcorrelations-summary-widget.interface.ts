import { ServicestatusObject } from '../../../../pages/services/services.interface';

export interface EventcorrelationsSummaryWidgetConfigRootResponse {
    _csrfToken: string | null
    config: EventcorrelationsSummaryWidgetConfig
    summary: EvcsSummary
}

export interface EvcsSummary {
    service_id: number
    host_id: number
    hostname: string
    host_uuid: string
    service_uuid: string
    servicename: string
    Servicestatus: ServicestatusObject
}

export interface EventcorrelationsSummaryWidgetConfig {
    Host: EvcsSummaryHostConfig
    Service: EvcsSummaryServiceConfig
    Hostgroup: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    Servicegroup: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    servicepriority: number[]
}


export interface EvcsSummaryHostConfig {
    name: string
    name_regex: boolean
    address: string
    address_regex: boolean
    keywords: string
    not_keywords: string
}

export interface EvcsSummaryServiceConfig {
    servicename: string
    servicename_regex: boolean
    keywords: string
    not_keywords: string
}
