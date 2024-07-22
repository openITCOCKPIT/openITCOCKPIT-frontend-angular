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

export interface SystemfailuresPost {
    from_date: Date | string
    from_time: Date | string
    to_date: Date | string
    to_time: Date | string
    comment: string
    author: {
        id?: number
        fullname: string
    }
}

export interface SystemfailuresGet {
    defaultValues: {
        js_from: string
        js_to: string
        from_date: string
        from_time: string
        to_date: string
        to_time: string
        comment: string
    }
    author: {
        id: number
        fullname: string
    }
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
