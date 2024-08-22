import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface EventlogsIndex extends PaginateOrScroll {
    all_events: Eventlog[],
    logTypes: string[]
    typeTranslations: TypeTranslations
    typeIconClasses: TypeIconClasses
    _csrfToken: string
    scroll: Scroll
}

export interface EventlogsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'types[]': string[],
    'filter[name]': string,
    'filter[user_email]': string,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
    'filter[Eventlogs.type][]': string[],
}

export function getDefaultEventlogsIndexParams(): EventlogsIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'Eventlogs.id',
        page: 1,
        direction: 'desc',
        'types[]': [],
        'filter[name]': '',
        'filter[user_email]': '',
        'filter[Eventlogs.type][]': [],
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 30 * 4 * 1000)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5 * 1000)),
    }
}


export interface Eventlog {
    id: number
    model: string
    type: string
    object_id: number
    name: string
    user_email: string
    data: Data
    created: string
    containers: Container[]
    time: string
    recordExists: boolean
}

export interface Data {
    user_email: string
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
    eventlog_id: number
    container_id: number
}

export interface TypeTranslations {
    [key: string]: string;
}

export interface TypeIconClasses {
    [key: string]: {
        icon: IconProp;
        iconPdf: string;
        className: string;
    }
}

export interface Scroll {
    page: number
    limit: number
    offset: number
    hasPrevPage: boolean
    prevPage: number
    nextPage: number
    current: number
    hasNextPage: boolean
}



