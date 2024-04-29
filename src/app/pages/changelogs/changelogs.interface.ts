/**********************
 *    Entity / Index action    *
 **********************/
import { ObjectTypesEnum } from './object-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ChangelogsIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
    'filter[Changelogs.objecttype_id]': ObjectTypesEnum[]
    'filter[Changelogs.action][]': string[],
    'filter[ShowServices]': number
}

export interface ChangelogsEntityParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
    'filter[Changelogs.object_id]': any,
    'filter[Changelogs.objecttype_id]': ObjectTypesEnum[]
    'filter[Changelogs.action][]': string[],
    'filter[ShowServices]': number
}

export function getDefaultChangelogsIndexParams(): ChangelogsIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Changelogs.action][]': [],
    }
}

export function getDefaultChangelogsEntityParams(): ChangelogsEntityParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
        'filter[Changelogs.object_id]': null,
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Changelogs.action][]': [],
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
    ngState: string,
    routerLink: [],
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

// Raw API result which has a lot of dynamic keys and is not very Angular friendly
export interface DataUnserializedRaw {
    [key: string]: {
        data: any,
        isArray: boolean
    }
}

export interface ChangelogArrayFalseOldNew {
    old: string,
    new: string
}

export interface ChangelogEntry {
    controllerName: string,
    changes: ChangelogEntryChange[]
}

export interface ChangelogEntryChange {
    hasOld: boolean,
    hasNew: boolean,
    old: ChangelogFieldValue[],
    new: ChangelogFieldValue[],
}

export interface ChangelogFieldValue {
    field: string,
    value: string
}
