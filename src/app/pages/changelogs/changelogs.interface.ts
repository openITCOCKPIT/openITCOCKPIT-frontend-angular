/**********************
 *    Entity / Index action    *
 **********************/
import { ObjectTypesEnum } from './object-types.enum';
import { formatDate } from '@angular/common';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ChangelogsIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[from]': string
    'filter[to]': string
    'filter[Changelogs.objecttype_id]': ObjectTypesEnum[]
    'filter[Action]': [],
    'filter[ShowServices]': number
}

export interface ChangelogsEntityParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[from]': string | Date
    'filter[to]': string
    'filter[Changelogs.object_id]': any,
    'filter[Changelogs.objecttype_id]': ObjectTypesEnum[]
    'filter[Action]': [],
    'filter[ShowServices]': number
}

export function getDefaultChangelogsIndexParams(): ChangelogsIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[from]': formatDate(now.getTime() - (3600 * 24 * 3000 * 4), 'dd.MM.y HH:mm', 'en-US'),
        'filter[to]': formatDate(now.getTime() + (3600 * 24 * 5), 'dd.MM.y HH:mm', 'en-US'),
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Action]': []
    }
}

export function getDefaultChangelogsEntityParams(): ChangelogsEntityParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        //'filter[from]': formatDate(now.getTime() - (3600 * 24 * 3000 * 500), 'dd.MM.y HH:mm', 'en-US'),
        'filter[from]': now,
        'filter[to]': formatDate(now.getTime() + (3600 * 24 * 5), 'dd.MM.y HH:mm', 'en-US'),
        'filter[Changelogs.object_id]': null,
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Action]': []
    }
}

export interface ChangelogIndexRoot extends PaginateOrScroll {
    all_changes: ChangelogIndex[]
    _csrfToken: string
}

export interface ChangelogIndex {
    id: number
    model: string
    action: string
    object_id: number
    objecttype_id: number
    data: string
    name: string
    created: string
    user_id: number
    user?: ChangelogUser
    containers: ChangelogContainer[]
    time: string
    isToday: boolean
    timeAgoInWords: string
    recordExists: boolean
    data_unserialized: any
    ngState: string
    color: string
    icon: string,
    faIcon: IconProp
    includeUser: boolean
}

export interface ChangelogUser {
    id: number
    firstname: string
    lastname: string
    email: string
}

export interface ChangelogContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: {
        id: number
        changelog_id: number
        container_id: number
    }
}

export interface DataUnserialized {
    [key: string]: {
        data: {
            [key: string]: DataIsStrings | DataIsObjectFakeArray
        }
        isArray: boolean // If isArray=false
    } | null
}

export interface DataIsStrings {
    old: string | null,
    new: string | null,
}

export interface DataIsObjectFakeArray {
    old: {
        [key: string]: string | null
    } | null,
    new: {
        [key: string]: string | null
    } | null
}


/*
API response for isArray=true
"Command": {
    "data": {
        "name": {
            "old": "aaa_echo",
            "new": "aaa_echo_new_ new ewnewe"
        },
        "description": {
            "old": "test -a",
            "new": "test -a jede menge text"
        }
    },
    "isArray": false
}


API response for isArray=true 🤯

"Command arguments": {
    "data": {
        "2": {
            "old": "",
            "new": {
                "name": "$ARG3$",
                "human_name": "Und arg 3"
            }
        }
    },
    "isArray": true
}
*/
