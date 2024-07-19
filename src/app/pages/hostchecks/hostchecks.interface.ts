import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Index action    *
 **********************/
export interface HostchecksIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hostchecks.output]': '',
    'filter[Hostchecks.state][]': string[],
    'filter[Hostchecks.state_type]': string | number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultHostchecksIndexParams(): HostchecksIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'Hostchecks.start_time',
        page: 1,
        direction: 'desc',
        'filter[Hostchecks.output]': '',
        'filter[Hostchecks.state][]': [],
        'filter[Hostchecks.state_type]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface HostchecksIndexRoot extends PaginateOrScroll {
    all_hostchecks: {
        Hostcheck: Hostcheck
    }[]
}

export interface Hostcheck {
    command: string
    current_check_attempt: number
    early_timeout: boolean
    end_time: number
    execution_time: number
    is_hardstate: boolean
    latency: number
    long_output: string
    max_check_attempts: number
    output: string
    perfdata: string
    start_time: string
    state: number
    timeout: number
    outputHtml: string
}
