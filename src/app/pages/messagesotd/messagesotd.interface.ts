import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';


// INDEX RESPONSE
export interface MessagesOtdIndexGet extends PaginateOrScroll {
    messagesOtd: MessageOfTheDay[]
    _csrfToken: string
}

// INDEX REQUEST
export interface MessagesOtdIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[MessagesOtd.date]': string,
    'filter[MessagesOtd.description]': string,
    'filter[MessagesOtd.title]': string,
}

export function getDefaultMessagesOtdIndexParams(): MessagesOtdIndexParams {
    return {
        angular: true,
        scroll: false,
        sort: 'MessagesOtd.date',
        page: 1,
        direction: 'asc',
        'filter[MessagesOtd.date]': '',
        'filter[MessagesOtd.description]': '',
        'filter[MessagesOtd.title]': ''
    }
}

// ADD
export interface AddMessagesOtdRoot {
    MessagesOtd: MessageOfTheDay
}

// EDIT GET
export interface EditMessagesOtdGet {
    messageOtd: EditableMessageOfTheDay
}

// EDIT POST
export interface EditMessagesOtdPost {
    MessagesOtd: EditableMessageOfTheDay
}

// DATA CONTRACT
export interface MessageOfTheDay {
    title: string
    description: string
    content: string
    style: string
    date: string
    expiration_duration: number
    expire: boolean
    name: string // This field seems unused but is transported.
    notify_users: number
    usergroups: {
        _ids: any[]
    }
}

// EDIT EXTENSION OF DATA CONTRACT
export interface EditableMessageOfTheDay extends MessageOfTheDay {
    created: string
    user_id: number
    modified: string
    id: number
}

// FETCH CURRENT MESSAGE OF THE DAY
export interface CurrentMessageOfTheDay {
    messageOtdAvailable: boolean
    messageOtd: MessageOfTheDay
    showMessageAfterLogin: boolean
    _csrfToken: string
}