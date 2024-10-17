import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { formatDate } from '@angular/common';
import { Outage } from '../slas/Slas.interface';

export interface SlaAvailabilityStatusHostsLogIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[from]': string,
    'filter[to]': string,
}

export function getDefaultSlaAvailabilityStatusHostsLogIndexParams(fromParam: number | null, toParam: number | null): SlaAvailabilityStatusHostsLogIndexParams {
    let now = new Date();
    let from = new Date(now.getTime() - (3600 * 24 * 30 * 1000));
    let to = new Date(now.getTime() + (3600 * 24 * 30 * 2 * 1000));
    if (typeof fromParam !== "undefined" && fromParam !== null) {
        from = new Date(fromParam * 1000);
    }
    if (typeof toParam !== "undefined" && toParam !== null) {
        to = new Date(toParam * 1000);
    }
    from.setSeconds(0);
    to.setSeconds(0);
    return {
        angular: true,
        scroll: true,
        sort: 'SlaAvailabilityStatusHostsLog.evaluation_start',
        page: 1,
        direction: 'desc',
        'filter[from]': formatDate(from.getTime(), 'yyyy-MM-ddTHH:mm', 'en-US'),
        'filter[to]': formatDate(to.getTime(), 'yyyy-MM-ddTHH:mm', 'en-US'),
    }
}


export interface SlaAvailabilityStatusHostsLogIndexRoot extends PaginateOrScroll {
    host: Host
    slaHostStatusLog: SlaHostStatusLog[]
    _csrfToken: string
}

export interface Host {
    id: number
    uuid: string
    name: string
    address: string
    container_id: number
    satellite_id: number
    hosts_to_containers_sharing: HostsToContainersSharing[]
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    host_id: number
    container_id: number
}

export interface SlaHostStatusLog {
    id: number
    host_id: number
    sla_id: number
    evaluation_total_time: number
    total_time: number
    minimal_availability_percent: number
    determined_availability_percent: number
    minimal_availability_time: number
    determined_availability_time: number
    determined_outage_time: number
    determined_number_outages: number
    up: number
    down: number
    unreachable: number
    evaluation_start: string
    evaluation_end: string
    created: string
    sla_host_outages: Outage[]
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    up_human_readable: string
    down_human_readable: string
    unreachable_human_readable: string
    start: string
    end: string
    state: string
    determined_outage_time_human_readable: string
}
