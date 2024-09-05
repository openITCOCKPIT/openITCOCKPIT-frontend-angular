export interface SummaryState {
    state: number[]
    acknowledged: number[]
    in_downtime: number[]
    not_handled: number[]
    passive: number[]
    total: number
}

export interface HostgroupSummaryState {
    hosts: HostgroupSummaryStateHosts
    services: HostgroupSummaryStateServices
}

export interface HostgroupSummaryStatesHosts {
    "0": number
    "1": number
    "2": number
    hostIds: number[][]
}

export interface HostgroupSummaryStateHosts {
    state: HostgroupSummaryStatesHosts
    acknowledged: HostgroupSummaryStatesHosts
    in_downtime: HostgroupSummaryStatesHosts
    not_handled: HostgroupSummaryStatesHosts
    passive: HostgroupSummaryStatesHosts
    total: number
}

export interface HostgroupSummaryStatesServices {
    "0": number
    "1": number
    "2": number
    "3": number
    serviceIds: number[][]
}


export interface HostgroupSummaryStateServices {
    state: HostgroupSummaryStatesServices
    acknowledged: HostgroupSummaryStatesServices
    in_downtime: HostgroupSummaryStatesServices
    not_handled: HostgroupSummaryStatesServices
    passive: HostgroupSummaryStatesServices
    total: number
}
