import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { GenericIdResponse } from '../../../../generic-responses';
import { HostMappingRulesPost } from '../host-mapping-rules/HostMappingRules.interface';

export interface SlasIndexRoot extends PaginateOrScroll {
    slas: Sla[]
    _csrfToken: any
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
    consider_downtimes: number
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


