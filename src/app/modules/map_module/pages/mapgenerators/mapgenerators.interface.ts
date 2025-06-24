import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../../../../pages/containers/containers.interface';
import { Map } from '../maps/maps.interface';

export interface MapgeneratorsIndexRoot extends PaginateOrScroll {
    all_mapgenerators: Mapgenerator[]
    _csrfToken: string
}

/*********************************
 *    Definition of Mapgenerator *
 ********************************/

export interface Mapgenerator {
    id: number
    name: string
    interval: number
    type: number
    maps_generated?: number
    created: string
    modified: string
    containers: MapgeneratorContainer[]
    start_containers?: MapgeneratorContainer[]
    maps?: Map[]
    allowEdit?: boolean
}

export interface MapgeneratorContainer extends Container {
    _joinData: MapgeneratorContainerJoinData
}

export interface MapgeneratorContainerJoinData {
    id: number
    container_id: number
    mapgenerator_id: number
}

export interface MapgeneratorsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Mapgenerators.name]': string,
    'filter[maps_generated]': string
}

export function getDefaultMapgeneratorsIndexParams(): MapgeneratorsIndexParams {
    return {
        angular: true,
        scroll: false,
        sort: 'Mapgenerators.name',
        page: 1,
        direction: 'asc',
        'filter[Mapgenerators.name]': "",
        'filter[maps_generated]': ""
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface MapgeneratorPost {
    Mapgenerator: MapgeneratorEdit
}

export interface MapgeneratorEdit {
    name: string
    interval: number
    type: number
    containers: {
        _ids: number[]
    }
    start_containers: {
        _ids: number[]
    }
}

export interface MapgeneratorsEditRoot {
    mapgenerator: Mapgenerator
    _csrfToken: string
}

export interface LoadContainersForMapgeneratorParams {
    'selectedContainers[]': number[],
    loadStartContainers?: boolean
}



