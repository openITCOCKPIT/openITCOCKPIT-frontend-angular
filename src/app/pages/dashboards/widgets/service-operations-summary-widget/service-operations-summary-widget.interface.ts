import { SummaryStateServicesExtended } from '../../../services/summary_state.interface';

export interface ServiceOperationsSummaryConfig {
    Host: {
        name: string
        name_regex: boolean
        address: string
        address_regex: boolean
        keywords: string
        not_keywords: string
    }
    Service: {
        servicename: string
        servicename_regex: boolean
        keywords: string
        not_keywords: string
    }
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
    Container: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    servicepriority: string[]
    refresh_key?: number
}

export interface ServiceOperationsSummaryResponse {
    config: ServiceOperationsSummaryConfig
    servicestatusSummary: SummaryStateServicesExtended
    _csrfToken: string
}