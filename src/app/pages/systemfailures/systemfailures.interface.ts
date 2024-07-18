import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface SystemfailureIndexRoot extends PaginateOrScroll {
    all_systemfailures: Systemfailure[]
    _csrfToken: string
}

export interface Systemfailure {
    id: number
    start_time: string
    end_time: string
    comment: string
    user_id: number
    created: string
    modified: string
    full_name: string
    user: SystemfailureUser
}

export interface SystemfailureUser {
    id: number
    firstname: string
    lastname: string
}

export interface SystemfailureIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Systemfailures.comment]': '',
    'filter[full_name]': ''
}

export function getDefaultSystemfailuresParams(): SystemfailureIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Systemfailures.start_time',
        page: 1,
        direction: 'asc',
        'filter[Systemfailures.comment]': '',
        'filter[full_name]': ''
    }
}
