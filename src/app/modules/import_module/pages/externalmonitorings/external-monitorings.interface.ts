import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
export interface ExternalMonitoringsIndexRoot extends PaginateOrScroll {
    externalMonitorings: ExternalMonitoring[]
    _csrfToken: any
}
export interface ExternalMonitoring {
    id: number
    name: string
    container_id: number
    description: string
    system_type: string
    container: string
    allowEdit: boolean
}


export interface ExternalMonitoringsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ExternalMonitorings.id][]': [],
    'filter[ExternalMonitorings.name]': string
    'filter[ExternalMonitorings.description]': string
    'filter[ExternalMonitorings.api_url]': boolean
}

export function getDefaultExternalMonitoringsIndexParams(): ExternalMonitoringsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ExternalMonitorings.name',
        page: 1,
        direction: 'asc',
        'filter[ExternalMonitorings.id][]': [],
        'filter[ExternalMonitorings.name]': '',
        'filter[ExternalMonitorings.description]': '',
        'filter[ExternalMonitorings.api_url]': false
    }
}
