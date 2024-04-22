/**********************
 *    Entity / Index action    *
 **********************/
import { ObjectTypesEnum } from './object-types.enum';
import { formatDate } from '@angular/common';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

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
    'filter[from]': string
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

export function getDefaultChangelogsEntityParams(): ChangelogsEntityParams{
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[from]': formatDate(now.getTime() - (3600 * 24 * 3000 * 500), 'dd.MM.y HH:mm', 'en-US'),
        'filter[to]': formatDate(now.getTime() + (3600 * 24 * 5), 'dd.MM.y HH:mm', 'en-US'),
        'filter[Changelogs.object_id]': null,
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Action]': []
    }
}

class ChangelogIndex {
}

export interface ChangelogIndexRoot extends PaginateOrScroll {
    all_changes: ChangelogIndex[]
    _csrfToken: string
}
