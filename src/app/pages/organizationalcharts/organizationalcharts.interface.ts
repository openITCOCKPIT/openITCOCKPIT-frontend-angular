import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Index action    *
 **********************/
export interface OrganizationalChartsIndexRoot extends PaginateOrScroll {
    all_organizationalcharts: OrganizationalChart[]
    _csrfToken: string
}

export interface OrganizationalChart {
    OrganizationalChart: OrganizationalChartEntity
}

export interface OrganizationalChartEntity {
    id?: number
    name: number
    description: string
    created: string
    modified: string
    allowEdit?: boolean
}


export function getDefaultOrganizationalChartsIndexParams(): OrganizationalChartsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Organizationalcharts.name',
        page: 1,
        direction: 'asc',
        'filter[Organizationalcharts.name]': '',
        'filter[Organizationalcharts.description]': ''
    }
}


export interface OrganizationalChartsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Organizationalcharts.name]': string
    'filter[Organizationalcharts.description]': string
}
