import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface StatuspagegroupsIndex extends PaginateOrScroll {
    all_statuspagegroups: Statuspagegroup[]
    _csrfToken: string
}

export interface Statuspagegroup {
    id: number
    container_id: number
    name: string
    description: string
    created?: string
    modified: string
    allow_edit: boolean
}

export interface StatuspagegroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Statuspagegroups.id][]': number[],
    'filter[Statuspagegroups.name]': string
    'filter[Statuspagegroups.description]': string
}


export function getStatuspagegroupsIndexParams(): StatuspagegroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Statuspagegroups.name',
        page: 1,
        direction: 'asc',
        'filter[Statuspagegroups.id][]': [],
        'filter[Statuspagegroups.name]': '',
        'filter[Statuspagegroups.description]': ''
    }
}
