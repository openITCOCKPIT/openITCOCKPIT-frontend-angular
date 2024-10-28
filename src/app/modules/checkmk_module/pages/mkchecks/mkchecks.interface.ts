import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ServicetemplateEntity } from '../../../../pages/servicetemplates/servicetemplates.interface';

/**********************
 *    Index action    *
 **********************/
export interface MkchecksIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Mkchecks.name]': string
    'filter[Servicetemplates.name]': string
}

export function getDefaultMkchecksIndexParams(): MkchecksIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Mkchecks.name',
        page: 1,
        direction: 'asc',
        'filter[Mkchecks.name]': '',
        'filter[Servicetemplates.name]': ''
    }
}

export interface MkchecksIndexRoot extends PaginateOrScroll {
    mkchecks: Mkcheck[]
    _csrfToken: string
}

export interface Mkcheck {
    id: number
    name: string
    servicetemplate_id: number
    created: string
    modified: string
    servicetemplate: ServicetemplateEntity
}
