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
