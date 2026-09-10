import { GenericIdAndName } from '../../generic.interfaces';
import { SummaryStateServices } from '../services/summary_state.interface';

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
    not_handled: SummaryUnhandledHosts
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
    failed: {
        count: number
        ids: number[]
    }
    recovered: {
        count: number
        ids: number[]
    }
    statusEvents: HostStatusEvents
    buckets: HostStatusBuckets
    from: number
    to: number
    userTimezone: string
}

export type HostStatusEvents = {
    [key in 'up' | 'down' | 'unreachable']: StatusEventHostDetails[];
};


type BucketKeysHost = 'up' | 'down' | 'unreachable';
export type HostStatusBuckets = Record<BucketKeysHost, StatusBucketHostDetails[]> & {
    min: number
    max: number
};

export interface StatusEventHostDetails {
    hostId: number
    type: string
    timestamp: number
    userDateTime: string
    stateEventMinutes: number
    host: GenericIdAndName
}

export interface StatusBucketHostDetails {
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