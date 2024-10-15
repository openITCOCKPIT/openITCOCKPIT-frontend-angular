import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Host action    *
 **********************/
export interface StatehistoryHostParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[StatehistoryHosts.output]': '',
    'filter[StatehistoryHosts.state][]': string[],
    'filter[StatehistoryHosts.state_type]': string | number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultStatehistoryHostParams(): StatehistoryHostParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'StatehistoryHosts.state_time',
        page: 1,
        direction: 'desc',
        'filter[StatehistoryHosts.output]': '',
        'filter[StatehistoryHosts.state][]': [],
        'filter[StatehistoryHosts.state_type]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface StatehistoriesHostRoot extends PaginateOrScroll {
    all_statehistories: {
        StatehistoryHost: StatehistoryHost
    }[]
}

export interface StatehistoryHost {
    current_check_attempt: number
    last_hard_state: number
    last_state: number
    long_output: string
    max_check_attempts: number
    output: string
    state: number
    state_change: boolean
    state_time: string
    is_hardstate: boolean
    outputHtml: string
}

/**********************
 *    Service action    *
 **********************/
export interface StatehistoryServiceParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[StatehistoryServices.output]': '',
    'filter[StatehistoryServices.state][]': string[],
    'filter[StatehistoryServices.state_type]': string | number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultStatehistoryServiceParams(): StatehistoryServiceParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'StatehistoryServices.state_time',
        page: 1,
        direction: 'desc',
        'filter[StatehistoryServices.output]': '',
        'filter[StatehistoryServices.state][]': [],
        'filter[StatehistoryServices.state_type]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface StatehistoriesServiceRoot extends PaginateOrScroll {
    all_statehistories: {
        StatehistoryService: StatehistoryService
    }[]
}

export interface StatehistoryService {
    current_check_attempt: number
    last_hard_state: number
    last_state: number
    long_output: string
    max_check_attempts: number
    output: string
    state: number
    state_change: boolean
    state_time: string
    is_hardstate: boolean
    outputHtml: string
}
