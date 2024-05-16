import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { CalendarApi, EventInput } from '@fullcalendar/core';

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
    container_id: number | null
    name: string
    description: string
    events: CalendarEvent[]
}

export interface CalendarEvent extends EventInput {
    start: string
    title: string
    default_holiday: boolean
    className: string
}

export interface CalendarEditGet {
    calendar: CalendarPost
    events: CalendarEvent[]
}

export interface CalendarContainer {
    key: number
    value: string
}

export interface CountryRoot {
    countries: Countries
    _csrfToken: string
}

export interface Countries {
    [key: string]: string
}

export interface CountriesAndContainers {
    containers: CalendarContainer[]
    countries: Countries
}

export interface AddNewEvent {
    title: string,
    start: string,
    CalendarApi?: CalendarApi
}
