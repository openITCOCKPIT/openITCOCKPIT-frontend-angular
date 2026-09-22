import { GenericIdAndName } from '../../generic.interfaces';

export interface SummaryStateServices {
    state: ServiceSummaryStatesServices
    acknowledged: ServiceSummaryStatesServices
    in_downtime: ServiceSummaryStatesServices
    not_handled: SummaryUnhandledServices
    passive: ServiceSummaryStatesServices
    total: number
}

/**
 * Status summary of all services that share the same tag.
 * The API already provides the cumulated state of the tag.
 */
export interface SummaryStateServicesTag extends SummaryStateServices {
    not_handled: SummaryUnhandledServices
    cumulative_state: number
    serviceIds: number[]
}

export interface SummaryStateServicesExtended extends SummaryStateServices {
    totalServiceIds: number[]
    lastTimeAlwaysOk: {
        count: number
        ids: number[]
    }
    lastTimeAlwaysCritical: {
        count: number
        ids: number[]
    }
    tagsOverview: {
        [key: string]: SummaryStateServicesTag
    }
    failed: {
        count: number
        ids: number[]
    }
    recovered: {
        count: number
        ids: number[]
    }
    statusEvents: ServiceStatusEvents
    buckets: ServiceStatusBuckets
    from: number
    to: number
    userTimezone: string
}

export type ServiceStatusEvents = {
    [key in 'ok' | 'warning' | 'critical' | 'unknown']: StatusEventServiceDetails[];
};


type BucketKeysService = 'ok' | 'warning' | 'critical' | 'unknown';
export type ServiceStatusBuckets = Record<BucketKeysService, StatusBucketServiceDetails[]> & {
    min: number
    max: number
};

export interface StatusEventServiceDetails {
    serviceId: number
    type: string
    timestamp: number
    userDateTime: string
    stateEventMinutes: number
    service: GenericIdAndName
}

export interface StatusBucketServiceDetails {
    0: string
    1: number
    2: number
    3: number
    statusDetails: ServiceStatusDetails[]
}

export interface ServiceStatusDetails {
    id: number
    serviceUuid: string
    name: string
    servicepriority: number
    current_state: number
}

export interface ServiceSummaryStatesServices {
    "0": number
    "1": number
    "2": number
    "3": number
    serviceIds: number[][]
}

export interface SummaryUnhandledServices {
    "0": number
    "1": number
    "2": number
    "3": number
    serviceIds: number[][]
    totalServiceIds: number[]
}

export interface SummaryStateServices {
    state: ServiceSummaryStatesServices
    acknowledged: ServiceSummaryStatesServices
    in_downtime: ServiceSummaryStatesServices
    not_handled: SummaryUnhandledServices
    passive: ServiceSummaryStatesServices
    total: number
}