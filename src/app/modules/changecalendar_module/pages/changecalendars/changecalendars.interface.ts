// INDEX PARAMS
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { CalendarEvent } from '../../../../pages/calendars/calendars.interface';

export interface ChangeCalendarsIndexParams {
// &filter%5BChangecalendars.description%5D=b&filter%5BChangecalendars.name%5D=a&page=1&scroll=true&sort=Changecalendars.name
    angular: boolean
    direction: 'asc' | 'desc' | '', // asc or desc
    page: number
    scroll: boolean
    sort: string

    'filter[Changecalendars.name]': string,
    'filter[Changecalendars.description]': string
}

export function getDefaultChangeCalendarsIndexParams(): ChangeCalendarsIndexParams {
    return {
        angular: true,
        direction: 'asc',
        page: 1,
        scroll: true,
        sort: 'Changecalendars.name',
        'filter[Changecalendars.name]': '',
        'filter[Changecalendars.description]': ''
    }
}

export interface ChangeCalendarsIndex extends PaginateOrScroll {
    all_changecalendars: AllChangecalendar[]
    _csrfToken: any
}

export interface AllChangecalendar {
    id: number
    name: string
    description: string
    colour: string
    container_id: number
    user_id: number
    created: string
    modified: string
    allowEdit: boolean
}

// ADD
export interface AddChangeCalendar {
    Changecalendar: Changecalendar
}

export interface Changecalendar {
    colour: string
    container_id: number
    description: string
    name: string
}

// EDIT
export interface EditChangecalendarRoot {
    changeCalendar: EditableChangecalendar
}

export interface EditChangecalendar extends EditChangecalendarRoot{
    events: CalendarEvent[]
}

export interface EditableChangecalendar extends Changecalendar {
    id: number
    user_id: number
    created: string
    modified: string
    changecalendar_events: ChangecalendarEvent[]
}

export interface ChangecalendarEvent {
    id: number | null
    title: string
    description: string
    start: string
    end: string
    uid: any
    context: any
    created: string
    modified: string
    changecalendar_id: number
    user_id: number
}

export interface Updatechangecalendar {
    changeCalendar: EditableChangecalendar,
    events: ChangecalendarEvent[]
}
