import { SummaryStateServices } from '../../../hosts/summary_state.interface';

export interface TacticalOverviewServicesResponse {
    config: TacticalOverviewServicesConfig
    servicestatusSummary: SummaryStateServices
    servicestatusCountPercentage: number[]
    _csrfToken: string
}

export interface TacticalOverviewServicesConfig {
    Host: TacticalOverviewHostConfig
    Service: TacticalOverviewServiceConfig
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
