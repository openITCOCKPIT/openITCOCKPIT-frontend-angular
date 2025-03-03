import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { formatDate } from '@angular/common';
import { SlaAvailabilityStatusLogIndexParams } from '../slas/slas.interface';
import { Container } from '../../../../pages/containers/containers.interface';


export function getDefaultSlaAvailabilityStatusServicesLogIndexParams(fromParam: number | null, toParam: number | null): SlaAvailabilityStatusLogIndexParams {
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
        sort: 'SlaAvailabilityStatusServicesLog.evaluation_start',
        page: 1,
        direction: 'desc',
        'filter[from]': formatDate(from.getTime(), 'yyyy-MM-ddTHH:mm', 'en-US'),
        'filter[to]': formatDate(to.getTime(), 'yyyy-MM-ddTHH:mm', 'en-US'),
    }
}

export interface SlaAvailabilityStatusServicesLogIndexRoot extends PaginateOrScroll {
    service: Service
    slaServiceStatusLog: SlaServiceStatusLog[]
    _csrfToken: string
}

export interface Service {
    id: number
    name: any
    uuid: string
    servicetemplate_id: number
    servicename: string
    servicetemplate: Servicetemplate
    host: Host
}

export interface Servicetemplate {
    id: number
    name: string
}

export interface Host {
    id: number
    uuid: string
    name: string
    container_id: number
    satellite_id: number
    hosts_to_containers_sharing: HostsToContainersSharing[]
}

export interface HostsToContainersSharing extends Container {
    _joinData: HostsToContainersSharingJoinData
}

export interface HostsToContainersSharingJoinData {
    id: number
    host_id: number
    container_id: number
}

export interface SlaServiceStatusLog {
    id: number
    host_id: number
    service_id: number
    sla_id: number
    evaluation_total_time: number
    total_time: number
    minimal_availability_percent: number
    determined_availability_percent: number
    minimal_availability_time: number
    determined_availability_time: number
    determined_outage_time: number
    determined_number_outages: number
    ok: number
    warning: number
    critical: number
    unknown: number
    evaluation_start: string
    evaluation_end: string
    created: string
    sla_service_outages: SlaServiceOutage[]
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    ok_human_readable: string
    warning_human_readable: string
    critical_human_readable: string
    unknown_human_readable: string
    start: string
    end: string
    state: string
    determined_outage_time_human_readable: string
}

export interface SlaServiceOutage {
    host_id: number
    service_id: number
    sla_id: number
    sla_availability_status_services_log_id: number
    start_time: number
    end_time: number
    output: string
    is_hardstate: boolean
    in_downtime: boolean
    outputHtml: string
    duration: string
    start: string
    end: string
}
