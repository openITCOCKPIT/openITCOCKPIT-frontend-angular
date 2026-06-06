import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface MailinglistsIndex extends PaginateOrScroll {
    all_mailinglists: Mailinglist[]
    _csrfToken: string
}


export interface Mailinglist {
    id: number
    container_id: number
    name: string
    description: string
    department: string
    allow_edit: boolean
    mailinglist_recipients?: MailinglistRecipient[]
}

export interface MailinglistsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Mailinglists.id][]': number[],
    'filter[Mailinglists.name]': string
    'filter[Mailinglists.description]': string
}

export interface MailinglistPost {
    id?: number
    container_id: number | null
    name: string
    description: string
    department: string,
    mailinglist_recipients: MailinglistRecipient[]
}

export interface MailinglistRecipient {
    id?: number
    mailinglist_id?: number
    name: string
    email: string
}

export function getMailinglistsIndexParams(): MailinglistsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Mailinglists.name',
        page: 1,
        direction: 'asc',
        'filter[Mailinglists.id][]': [],
        'filter[Mailinglists.name]': '',
        'filter[Mailinglists.description]': ''
    }
}
