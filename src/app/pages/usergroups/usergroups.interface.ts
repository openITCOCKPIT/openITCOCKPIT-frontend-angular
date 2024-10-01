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
    usergroup: UsergroupsEdit
    acos: {
        id: number
        parent_id: any
        model: any
        foreign_key: any
        alias: string
        lft: number
        rght: number
        children: {
            id: number
            parent_id: number
            model: any
            foreign_key: any
            alias: string
            lft: number
            rght: number
            children: {
                id: number
                parent_id: number
                model: any
                foreign_key: any
                alias: string
                lft: number
                rght: number
                children: any
            }[]
        }[]
    }[]
    _csrfToken: string
}

// Cleanup . This looks really awful!
export interface UsergroupsEdit {
    id: number
    name: string
    description: string
    created: string
    modified: string
    ldapgroups: {
        _ids: any[]
    }
    aro: {
        id: number
        parent_id: any
        model: string
        foreign_key: number
        alias: any
        lft: number
        rght: number
        acos: {
            id: number
            parent_id: number
            model: any
            foreign_key: any
            alias: string
            lft: number
            rght: number
            _joinData: {
                id: number
                aro_id: number
                aco_id: number
                _create: string
                _read: string
                _update: string
                _delete: string
            }
        }[]
    }
}

/* EDIT POST */
export interface UsergroupsEditPostRoot {
    Acos: {
        [key: number]: number
    }[]
    Usergroup: Usergroup
}

// TIDY THIS UP AS WELL. LOOKS HIDEOUS!!!!!!
export interface Usergroup {
    aro: {
        acos: {
            _joinData: {
                _create: string
                _delete: string
                _read: string
                _update: string
                aco_id: number
                aro_id: number
                id: number
            }
            alias: string
            foreign_key: any
            id: number
            lft: number
            model: any
            parent_id: number
            rght: number
        }[]
        alias: any
        foreign_key: number
        id: number
        lft: number
        model: string
        parent_id: any
        rght: number
    }
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



