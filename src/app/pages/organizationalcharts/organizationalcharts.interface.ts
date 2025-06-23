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
        sort: 'OrganizationalCharts.name',
        page: 1,
        direction: 'asc',
        'filter[OrganizationalCharts.name]': '',
        'filter[OrganizationalCharts.description]': ''
    }
}


export interface OrganizationalChartsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[OrganizationalCharts.name]': string
    'filter[OrganizationalCharts.description]': string
}
