import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface CalendarsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Calendars.id][]': number[],
    'filter[Calendars.name]': string
    'filter[Calendars.description]': string
}

export function getDefaultCalendarsIndexParams(): CalendarsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Calendars.name',
        page: 1,
        direction: 'asc',
        'filter[Calendars.id][]': [],
        'filter[Calendars.name]': '',
        'filter[Calendars.description]': ''
    }
}


export interface CalendarIndexRoot extends PaginateOrScroll {
    all_calendars: CalendarIndex[]
    _csrfToken: string
}

export interface CalendarIndex {
    id: number
    name: string
    description: string
    container_id: number
    allowEdit: boolean
}

export interface CalendarPost {
    id?: number
    name: string
    description: string
}

export interface CalendarEditGet {
    calendar: CalendarPost
}
