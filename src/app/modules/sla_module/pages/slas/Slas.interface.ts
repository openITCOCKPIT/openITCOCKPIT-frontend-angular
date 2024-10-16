import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { GenericIdResponse } from '../../../../generic-responses';
import { HostMappingRulesPost } from '../host-mapping-rules/HostMappingRules.interface';

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
    start_date?: string
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
    timeperiod: Timeperiod
    container: string
    allowEdit: boolean
    status_percent?: number
    fulfill: boolean
    users: Users
    host_mapping_rule: null | HostMappingRulesPost
}

export interface Timeperiod {
    id: number
    name: string
    uuid?: string
    container_id?: number
    description?: string
    calendar_id?: number
    created?: string
    modified?: string
    timeperiod_timeranges?: TimeperiodTimerange[]
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface SlaPost {
    id?: number
    container_id: null | number
    timeperiod_id: null | number
    name: string
    description: string
    minimal_availability: null | string | number
    warning_threshold: null | string | number
    start_date?: null | string
    evaluation_interval: string
    consider_downtimes: number | boolean
    hard_state_only: number
    report_send_interval: string
    report_format: number
    report_evaluation: number
    last_send_date?: string
    created?: string
    modified?: string
    users: Users
    allowEdit?: boolean
}

export interface Users {
    _ids: number[]
}

export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

export interface LoadUsersRoot {
    users: SelectKeyValue[]
    _csrfToken: string
}

export interface LoadUsersParams {
    containerId: number,
    'selected[]': number[]
}

export interface LoadTimeperiodsRoot {
    timeperiods: SelectKeyValue[]
    _csrfToken: string
}

export interface LoadTimeperiodsParams {
    containerId: number,
}


export interface SlaPostResponse extends GenericIdResponse {
    sla: Sla
}

/***************************
 *    hosts action         *
 ***************************/

export interface SlasHostsRoot extends PaginateOrScroll {
    sla: Sla
    hosts: Host[]
    success: boolean
    _csrfToken: string
}

export interface Host {
    id: number
    name: string
    address: string
    sla_id: number
    container_id: number
    container: string
    primary_container: string
    services: Service[]
    hosttemplate: Hosttemplate
    hosts_to_containers_sharing: HostsToContainersSharing[]
    allowEdit: boolean
}

export interface Service {
    id: number
    host_id: number
    servicename: string
    disabled: number
    sla_relevant?: number
    is_sla_relevant: number
    servicetemplate: Servicetemplate
}

export interface Servicetemplate {
    id: number
    template_name: string
    container_id: number
    sla_relevant: number
    allowEdit: boolean
}

export interface Hosttemplate {
    id: number
    name: string
    sla_id: any
    container_id: number
    allowEdit: boolean
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id?: number
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    host_id: number
    container_id: number
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

export interface TimeperiodTimerange {
    id: number
    timeperiod_id: number
    day: number
    start: string
    end: string
    weekday: string
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



