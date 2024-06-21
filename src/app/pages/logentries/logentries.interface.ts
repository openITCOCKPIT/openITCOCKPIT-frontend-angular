import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface LogentriesRoot extends PaginateOrScroll {
    logentries: Logentry[]
    _csrfToken: string
}

export interface Logentry {
    id: number
    logentry_time: string
    entry_time: string
    logentry_type: number
    logentry_data: string
    logentry_type_string: string
    logentry_data_html: string
    logentry_data_angular_html: string
}

export interface LogentryIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Logentries.logentry_data]': '',
    'filter[Logentries.logentry_type]': string [],
    'filter[Hosts.id][]': number[]
}

export function getDefaultLogentriesParams(): LogentryIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'Logentries.entry_time',
        page: 1,
        direction: 'desc',
        'filter[Logentries.logentry_data]': '',
        'filter[Logentries.logentry_type]': [],
        'filter[Hosts.id][]': []
    }
}
