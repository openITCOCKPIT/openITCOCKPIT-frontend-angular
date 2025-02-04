// INDEX PARAMS
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

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