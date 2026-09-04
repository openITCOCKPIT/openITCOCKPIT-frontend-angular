import { GenericIdAndName } from '../../generic.interfaces';
import { HoststatusObject } from './hosts.interface';

export interface SummaryState {
    state: number[]
    acknowledged: number[]
    in_downtime: number[]
    not_handled: number[]
    passive: number[]
    total: number
}

export interface StatusSummaryState {
    hosts: SummaryStateHosts
    services: SummaryStateServices
}


export interface SummaryStatesHosts {
    "0": number
    "1": number
    "2": number
    hostIds: number[][]
}

export interface SummaryUnhandledHosts {
    "0": number
    "1": number
    "2": number
    hostIds: number[][]
    totalHostIds: number[]
}


export interface SummaryStateHosts {
    state: SummaryStatesHosts
    acknowledged: SummaryStatesHosts
    in_downtime: SummaryStatesHosts
    not_handled: SummaryStatesHosts
    passive: SummaryStatesHosts
    total: number
}

/**
 * Status summary of all hosts that share the same tag.
 * The API already provides the cumulated state of the tag.
 */
export interface SummaryStateHostsTag extends SummaryStateHosts {
    not_handled: SummaryUnhandledHosts
    cumulative_state: number
    hostIds: number[]
}

export interface SummaryStateHostsExtended extends SummaryStateHosts {
    totalHostIds: number[]
    lastTimeAlwaysUp: {
        count: number
        ids: number[]
    }
    lastTimeAlwaysDown: {
        count: number
        ids: number[]
    }
    tagsOverview: {
        [key: string]: SummaryStateHostsTag
    }
    statusEvents: StatusEvents
    buckets: StatusBuckets
}

export type StatusEvents = {
    [key in 'up' | 'down' | 'unreachable']: StatusEventDetails[];
};


type BucketKeys = 'up' | 'down' | 'unreachable';
export type StatusBuckets = Record<BucketKeys, StatusBucketDetails[]> & {
    min: number
    max: number
};

export interface StatusEventDetails {
    hostId: number
    type: string
    timestamp: number
    userDateTime: string
    stateEventMinutes: number
    host: GenericIdAndName
}

export interface StatusBucketDetails {
    0: string
    1: number
    2: number
    statusDetails: HostStatusDetails[]
}

export interface HostStatusDetails {
    id: number
    hostUuid: string
    name: string
    hostpriority: number
    current_state: number
}

export interface HostDetails {
    id: number
    name: string
    Hoststatus: HoststatusObject
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
    not_handled: ServiceSummaryStatesServices
    passive: ServiceSummaryStatesServices
    total: number
}