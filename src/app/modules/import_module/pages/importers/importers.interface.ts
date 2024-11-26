import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface ImportersIndexRoot extends PaginateOrScroll {
    importers: Importer[]
    _csrfToken: string
}

export interface Importer {
    id: number
    name: string
    container_id: number
    description: string
    hostdefault_id: number
    container: string
    allowEdit: boolean
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}

export function getDefaultImportersIndexParams(): ImportersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Importers.name',
        page: 1,
        direction: 'asc',
        'filter[Importers.id][]': [],
        'filter[Importers.name]': '',
        'filter[Importers.description]': ''
    }
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}
