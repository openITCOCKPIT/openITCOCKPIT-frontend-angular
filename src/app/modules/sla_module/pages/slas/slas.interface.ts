import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { GenericIdResponse } from '../../../../generic-responses';
import { HostMappingRulesPost } from '../host-mapping-rules/host-mapping-rules.interface';
import { Timeperiod, ViewDetailsTimeperiod } from '../../../../pages/timeperiods/timeperiods.interface';
import { GenericIdAndName } from '../../../../generic.interfaces';
import { ServiceEntity } from '../../../../pages/services/services.interface';
import { HosttemplateEntity } from '../../../../pages/hosttemplates/hosttemplates.interface';
import { HostsToContainersSharing } from '../../../../pages/hosts/hosts.interface';

export interface SlasIndexRoot extends PaginateOrScroll {
    slas: Sla[]
    _csrfToken: string
}

export interface SlasEditRoot {
    sla: Sla
    _csrfToken: string;
}

export interface SlasIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Slas.name]': string,
    'filter[Slas.description]': string,
}

export function getDefaultSlasIndexParams(): SlasIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Slas.name',
        page: 1,
        direction: 'asc',
        'filter[Slas.name]': "",
        'filter[Slas.description]': "",
    }
}

/*******************************
 *    Definition of SLA        *
 ******************************/

export interface Sla {
    id: number
    name: string
    description: string
    container_id: number
    timeperiod_id: number
    start_date?: string | null
    evaluation_interval: string
    consider_downtimes: number | boolean
    hard_state_only: number
    minimal_availability: number
    warning_threshold: number
    report_send_interval: string
    report_format: number
    report_evaluation: number
    last_send_date?: string
    created: string
    modified: string
    timeperiod: ViewDetailsTimeperiod
    container: string
    allowEdit: boolean
    status_percent?: number
    fulfill: boolean
    users: {
        _ids: number[]
    }
    host_mapping_rule: null | HostMappingRulesPost
    main_container?: GenericIdAndName[]
    hostsOverview?: HostsOverview
}

export interface SlaEditGet {
    sla: SlaPost
}


export interface SlaPost {
    id?: number
    container_id: null | number
    timeperiod_id: null | number
    name: string
    description: string
    minimal_availability: null | number
    warning_threshold: null | number
    start_date: null | string
    evaluation_interval: string
    consider_downtimes: number
    hard_state_only: number
    report_send_interval: string
    report_format: number
    report_evaluation: number
    users: {
        _ids: []
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/


export interface SlaPostResponse extends GenericIdResponse {
    sla: Sla
}

/***************************
 *    hosts action         *
 ***************************/

export interface SlasHostsRoot extends PaginateOrScroll {
    sla: Sla
    hosts: SlaHost[]
    success: boolean
    _csrfToken: string
}

export interface SlaHost {
    id: number
    name: string
    address: string
    sla_id: number
    container_id: number
    container: string
    primary_container: string
    services: ServiceEntity[]
    hosttemplate: HosttemplateEntity
    hosts_to_containers_sharing: HostsToContainersSharing[]
    allowEdit: boolean
}


export interface SlasHostsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
}

export function getDefaultSlasHostsParams(): SlasHostsParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': "",
    }
}

/***************************
 *    generate action      *
 ***************************/

export interface SlasGenerateRoot {
    slas: Sla[]
    _csrfToken: string
}

export interface SlasGeneratePost {
    Sla: {
        id: number,
        format: string,
        from_date: Date | string,
        to_date: Date | string,
        evaluation: number
    }
}

export interface SlasGenerateDownloadParams {
    params: {
        'angular': boolean,
        'Sla[id]': number,
        'Sla[evaluation]': number,
        'Sla[from_date]': Date | string,
        'Sla[to_date]': Date | string,
    }
    responseType: 'blob'
}

export interface SlasGeneratePostResponse {
    success: boolean
    sla: Sla
    report: Report
    logoUrl: string
    _csrfToken: string
}

export interface Report {
    sla: Sla
    evaluation_time: EvaluationTime
    timeperiod: Timeperiod
    date_ranges: DateRange[]
    hosts: ReportHostParent[][]
}


export interface EvaluationTime {
    start: number
    start_human: string
    end: number
    end_human: string
}

export interface DateRange {
    title: string
    start: number
    end: number
    start_human: string
    end_human: string
}

export interface ReportHostParent {
    host: ReportHost
    sla_log: SlaLogHost
    services: ReportServiceParent[]
}

export interface ReportHost {
    id: number
    name: string
    created: string
}

export interface SlaLogHost {
    last_log_entry: LastLogEntryHost
    outages: any[] | Outage[]
    outages_in_downtime: any[]
}

export interface SlaLogService {
    last_log_entry: LastLogEntryService
    outages: any[] | Outage[]
    outages_in_downtime: any[]
}

export interface ReportServiceParent {
    service: ReportService
    sla_log: SlaLogService
}

export interface ReportService {
    id: number
    servicename: string
}

export interface Outage {
    host_id: number
    service_id: number
    sla_id: number
    sla_availability_status_services_log_id: number
    start_time: number
    end_time: number
    output: string
    is_hardstate: boolean
    in_downtime: boolean
}

export interface LastLogEntryHost {
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
    sla_host_outages: any[]
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    passed: boolean
}

export interface LastLogEntryService {
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
    sla_service_outages: Outage[]
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    passed: boolean
}

export interface ReportError {
    error: boolean
    message: string
    objects: ReportErrorObject[]
}

export interface ReportErrorObject {
    name: string
    services: string[]
}

/***************************
 *    view Details action      *
 ***************************/

export interface SlasViewDetailsParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[Hosts.container_id][]': number[],
    'filter[determined_availability][]': number[],
}

export interface SlaAvailabilityStatusLogIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[from]': string,
    'filter[to]': string,
}


export function getDefaultSlasViewDetailsParams(): SlasViewDetailsParams {
    return {
        angular: true,
        scroll: true,
        sort: 'determined_availability',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': "",
        'filter[Hosts.container_id][]': [],
        'filter[determined_availability][]': [],
    }
}

export interface SlasViewDetailsRoot extends PaginateOrScroll {
    sla: Sla
    slaDetails: SlaDetail[]
    availability: Availability
    _csrfToken: string
}

export interface HostsOverview {
    totalHosts: number
    failed: ObjectsSummary
    warning: ObjectsSummary
    passed: ObjectsSummary
    not_calculated: ObjectsSummary
    top10: Top10[]
}

export interface ObjectsSummary {
    count: number
    percentage: string
    ids: number[]
}


export interface Top10 {
    id: number
    name: string
    determined_availability: number
    state: string
}

export interface SlaDetail {
    host_id: number
    evaluation_total_time: number
    determined_outage_time: number
    evaluation_end: string
    determined_availability_percent: number
    determined_availability_time: number
    determined_availability: number
    sla_availability_status_services: SlaAvailabilityStatusService[]
    host: SlaHost
    _matchingData: SlaHostMatchingData
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    state: string
    state_number: number
    host_state: string
    host_state_number: number
}

export interface SlaHostMatchingData {
    Hosts: {
        id: string
        name: string
        description: string
    }
}

export interface SlaAvailabilityStatusService {
    servicename: string
    host_id: number
    service_id: number
    evaluation_total_time: number
    determined_availability_time: number
    determined_outage_time: number
    evaluation_end: string
    determined_availability_percent: number
    minimal_availability_percent?: number
    determined_number_outages?: number
    Services: GenericIdAndName
    Servicetemplates: GenericIdAndName
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    state: string
}


export interface Hosts {
    id: number
    name: string
    description: any
}

export interface Availability {
    status_percent: number
    fulfill: boolean
}
