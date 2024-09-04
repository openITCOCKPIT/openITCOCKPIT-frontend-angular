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


export interface HostgroupSummaryStateServices {
    state: {
        "0": number
        "1": number
        "2": number
        "3": number
        serviceIds: number[][]
    }
    acknowledged: {
        "0": number
        "1": number
        "2": number
        "3": number
        serviceIds: number[][]
    }
    in_downtime: {
        "0": number
        "1": number
        "2": number
        "3": number
        serviceIds: number[][]
    }
    not_handled: {
        "0": number
        "1": number
        "2": number
        "3": number
        serviceIds: number[][]
    }
    passive: {
        "0": number
        "1": number
        "2": number
        "3": number
        "serviceIds": { // yes - this is an object for some reason
            "0": number[],
            "1": number[],
            "3": number[],
            "2": number[]
        }
    }
    total: number
}
