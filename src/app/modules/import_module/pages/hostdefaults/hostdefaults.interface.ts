import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface HostDefaultsIndexRoot extends PaginateOrScroll {
    hostdefaults: Hostdefault[]
    _csrfToken: any
}

export interface Hostdefault {
    id: number
    name: string
    container_id: number
    description: string
    hosttemplate_id: number
    satellite_id: number
    container: string
    allowEdit: boolean
}

export interface HostDefaultsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hostdefaults.id][]': [],
    'filter[Hostdefaults.name]': string
    'filter[Hostdefaults.description]': string
}

export function getDefaultHostDefaultsIndexParams(): HostDefaultsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hostdefaults.name',
        page: 1,
        direction: 'asc',
        'filter[Hostdefaults.id][]': [],
        'filter[Hostdefaults.name]': '',
        'filter[Hostdefaults.description]': ''
    }
}
