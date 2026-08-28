import { SummaryStateHosts } from '../../../hosts/summary_state.interface';

export interface HostOperationsSummaryConfig {
    Host: {
        name: string
        name_regex: boolean
        address: string
        address_regex: boolean
        keywords: string
        not_keywords: string
    }
    Hostgroup: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    Container: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    hostpriority: string[],
}

export interface HostOperationsSummaryResponse {
    config: HostOperationsSummaryConfig
    hoststatusSummary: SummaryStateHosts
    _csrfToken: string
}