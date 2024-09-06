import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface SlasIndexRoot extends PaginateOrScroll {
    slas: Sla[]
    _csrfToken: any
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
}

export interface Timeperiod {
    id: number
    name: string
}

