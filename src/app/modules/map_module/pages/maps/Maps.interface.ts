import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface MapsIndexRoot extends PaginateOrScroll {
    all_maps: Map[]
    _csrfToken: string
}

export interface Map {
    id: number
    name: string
    title: string
    background: any
    refresh_interval: number
    json_data: any
    created: string
    modified: string
    containers: Container[]
    allowEdit: boolean
    allowCopy: boolean
}

export interface Container {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    container_id: number
    map_id: number
}


export interface MapsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Maps.name]': string,
    'filter[Maps.title]': string,
}

export function getDefaultMapsIndexParams(): MapsIndexParams {
    return {
        angular: true,
        scroll: false,
        sort: 'Maps.name',
        page: 1,
        direction: 'asc',
        'filter[Maps.name]': "",
        'filter[Maps.title]': "",
    }
}

