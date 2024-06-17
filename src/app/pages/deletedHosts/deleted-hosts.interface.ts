import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Index action    *
 **********************/
export interface DeletedHostsIndexRoot extends PaginateOrScroll {
    deletedHosts: DeletedHost[]
}

export interface DeletedHost {
    DeletedHost: {
        id: number
        uuid: string
        hosttemplateId: number
        hostId: number
        name: string
        description?: string
        perfdataDeleted: boolean
        created: string
        modified: string
    }
}

export interface DeletedHostsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[DeletedHosts.name]': string,
    'filter[DeletedHosts.name_regex]': boolean
}

export function getDefaultDeletedHostsIndexParams(): DeletedHostsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'DeletedHosts.created',
        page: 1,
        direction: 'desc',
        'filter[DeletedHosts.name]': "",
        'filter[DeletedHosts.name_regex]': false
    }
}
