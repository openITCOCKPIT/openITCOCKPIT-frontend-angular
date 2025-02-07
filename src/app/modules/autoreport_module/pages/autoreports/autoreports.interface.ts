import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';


export interface AutoreportsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Autoreports.name]': string,
    'filter[Autoreports.description]': string
}

export function getDefaultAutoreportsIndexParams(): AutoreportsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Autoreports.name',
        page: 1,
        direction: 'asc',
        'filter[Autoreports.name]': '',
        'filter[Autoreports.description]': ''
    }
}

export interface AutoreportsIndexRoot extends PaginateOrScroll {
    autoreports: AutoreportIndex[];
    _csrfToken: string
}

export interface AutoreportIndex {
        id: number,
        name: string,
        description: string,
        container_id: number,
        report_interval: string,
        report_send_interval: string,
        min_availability: number | null,
        max_number_of_outages: number | null,
        allowEdit: boolean
}

export interface AutoreportPost {
    Autoreport: {
        container_id: number | null,
        name: string | null,
        description: string | null,
        use_start_time: number,
        report_start_date: string,
        timeperiod_id: number | null,
        report_interval: string| null,
        report_send_interval: string | null,
        min_availability_percent: boolean,
        min_availability: string | null,
        max_number_of_outages: number | null,
        show_time: string, //SLA Graph - if true -> show availability in hours
        check_hard_state: string, // if true -> consider only hard states from state history
        consider_downtimes: number,
        consider_holidays: number,
        calendar_id: number | null,
        users: {
            _ids: number[]
        }
    }
}

export interface CalendarParams {
    angular: boolean,
    containerId: number,
    'filter[Calendar.name]': string
}

export function getDefaultCalendarParams(): CalendarParams {
    return {
        angular: true,
        containerId: 0,
        'filter[Calendar.name]': ''
    }
}
