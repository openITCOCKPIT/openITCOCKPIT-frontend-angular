import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface TimeperiodsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Timeperiods.id][]': number[],
    'filter[Timeperiods.name]': string
    'filter[Timeperiods.description]': string
}

export function getDefaultTimeperiodsIndexParams(): TimeperiodsIndexParams {
    return {
        'angular': true,
        'scroll': true,
        'sort': 'Timeperiods.name',
        'page': 1,
        'direction': 'asc',
        'filter[Timeperiods.id][]': [],
        'filter[Timeperiods.name]': "",
        'filter[Timeperiods.description]': ""
    }
}

export interface TimeperiodIndexRoot extends PaginateOrScroll {
    all_timeperiods: TimeperiodIndex[]
    _csrfToken: string
}

/**********************
 *    Index action    *
 **********************/

export interface TimeperiodIndex {
    Timeperiod: {
        id: number,
        uuid: string,
        container_id: number,
        name: string,
        description: string,
        calendar_id: number,
        created: string,
        modified: string,
        allow_edit: boolean
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface TimeperiodPost {
    Timeperiod: {
        container_id: number,
        name: string,
        calendar_id: number,
        timeperiod_timeranges: TimeperiodRange[],
        validate_timeranges: true,
        description: string
    }
}

export interface TimeperiodRange {
    day: number,
    start: string,
    end: string,
    timeperiod_id?: number,
    id?: number
}

export interface InternalRange {
    id: number,
    day: number,
    start: string,
    end: string,
    index: number
}

export interface Container {
    key: number,
    value: string
}
