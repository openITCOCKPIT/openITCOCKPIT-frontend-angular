import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../containers/containers.interface';

/**********************
 *    Index action    *
 **********************/
export interface LocationsIndexRoot extends PaginateOrScroll {
    all_locations: AllLocation[]
    _csrfToken: string
}

export interface AllLocation {
    Location: LocationEntityCake2
    Container: Container
}

export interface LocationEntityCake2 {
    id?: number
    uuid: string
    container_id: number
    description: string
    latitude?: number
    longitude?: number
    timezone: string
    created: string
    modified: string
    allowEdit?: boolean
}

export interface LocationsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Containers.name]': string
    'filter[Locations.description]': string
}

export function getDefaultLocationsIndexParams(): LocationsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Containers.name]': '',
        'filter[Locations.description]': ''
    }
}

/**********************
 *     Add action     *
 **********************/
export interface LocationPost {
    id?: number
    description: string
    latitude: null | number
    longitude: null | number
    timezone: string
    container: {
        name: string
        parent_id: number
    }
    created?: string
    modified?: string
}
