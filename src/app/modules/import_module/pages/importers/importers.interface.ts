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
