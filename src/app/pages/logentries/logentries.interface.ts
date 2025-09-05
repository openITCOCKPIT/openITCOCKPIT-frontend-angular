import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { getUserDate } from '../../services/timezone.service';

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
    'filter[Host.id][]': number[],
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultLogentriesParams(): LogentryIndexParams {
    let now: Date = getUserDate();
    return {
        angular: true,
        scroll: true,
        sort: 'Logentries.entry_time',
        page: 1,
        direction: 'desc',
        'filter[Logentries.logentry_data]': '',
        'filter[Logentries.logentry_type]': [],
        'filter[Host.id][]': [],
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 1000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}
