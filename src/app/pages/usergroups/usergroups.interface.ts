import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

/* INDEX POST */
export interface UsergroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[Usergroups.description]': string,
    'filter[Usergroups.name]': string,
}

export function getdefaultUsergroupsIndexParams(): UsergroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Usergroups.name',
        page: 1,
        direction: 'asc',
        'filter[Usergroups.description]': "",
        'filter[Usergroups.name]': ""
    }
}

/* INDEX */

export interface UsergroupsIndexRoot extends PaginateOrScroll {
    allUsergroups: UsergroupIndex[]
    _csrfToken: string
}

export interface UsergroupIndex {
    id: number
    name: string
    description: string
    created: string
    modified: string
    users: {
        id: number
        usergroup_id: number
    }[]
}


/* ADD */
export interface UsergroupsAddRoot {
    Acos: {
        [key: number]: number
    }
    Usergroup: UsergroupAdd
}

export interface UsergroupAdd {
    description: string
    ldapgroups: {
        _ids: any[]
    }
    name: string
}

/* EDIT GET */
export interface UsergroupsEditGetRoot {
    usergroup: Usergroup
    acos: {
        [key: number]: number
    }
    _csrfToken: string
}

// Cleanup . This looks really awful!
/* EDIT POST */
export interface UsergroupsEditPostRoot {
    Acos: {
        [key: number]: number
    }
    Usergroup: Usergroup
}

// Usergroup definition
export interface Usergroup {
    acos: { [key: number]: child }
    created: string
    description: string
    id: number
    ldapgroups: {
        _ids: number[]
    }

    modified: string
    name: string
}


/* COPY GET */
export interface UsergroupsCopyGetRoot {
    usergroups: {
        id: number
        name: string
        description: string
    }[]
}

/* COPY POST */
export interface UsergroupsCopyPostRoot {
    data: {
        Source: {
            id: number
            name: string
        }
        Usergroup: {
            description: string
            name: string
        },
        Error: GenericValidationError | undefined
    }[]
}

/* LDAP GROUPS */
export interface LoadLdapgroups {
    ldapgroups: SelectKeyValue[]
    isLdapAuth: boolean
    _csrfToken: string
}

/* ACOs */
export interface AcoRoot {
    acos: { [key: number]: child }
    _csrfToken: string
}

export interface child {
    id: number
    parent_id: number
    model:  any
    foreign_key: any
    alias: string
    lft: number
    rght: number
    children: { [key: number]: child }
}



