// INDEX PARAMS
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';
import { GenericIdAndName } from '../../generic.interfaces';

export interface UserContainerRolesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    "filter[Usercontainerroles.name]": string
    //https://master/usercontainerroles/index.json?angular=true&direction=asc&filter%5BUsercontainerroles.name%5D=&page=1&scroll=true&sort=Usercontainerroles.name
}


export function getDefaultContainerRolesIndexParams(): UserContainerRolesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Usercontainerroles.name',
        page: 1,
        direction: 'asc',
        "filter[Usercontainerroles.name]": ''
    }
}

// INDEX RESPONSE
export interface UserContainerRolesIndexRoot extends PaginateOrScroll {
    all_usercontainerroles: UserContainerRolesIndex[]
    _csrfToken: string
}

export interface UserContainerRolesIndex {
    id: number
    name: string
    users: {
        id: number
        firstname: string
        lastname: string
        full_name: string
        allow_edit: boolean,
        _joinData?: {
            through_ldap: any
        }
    }[]
    allow_edit: boolean
}


// COPY GET
export interface CopyUserContainerRolesRequest {
    usercontainerroles: GenericIdAndName[]
    _csrfToken: string
}

export interface CopyUserContainerRoleDatum {
    Source: {
        id: number
        name: string
    }
    Usercontainerrole: {
        name: string
    }
    Error: GenericValidationError | null
}


// ADD

export interface AddUserContainerRole {
    Usercontainerrole: UserContainerRole
}

export interface UserContainerRole {
    ContainersUsercontainerrolesMemberships: {
        [key: string]: string
    }
    ldapgroups: {
        _ids: number[]
    }
    name: string
}

export interface EditableUserContainerRole extends UserContainerRole {
    id: number
    containers?: {
        _ids: number[]
    }
}

/***********************/

export interface UsercontainerrolesPost {
    id?: number
    name: string
    ldapgroups: {
        _ids: number[]
    },
    ContainersUsercontainerrolesMemberships: ContainersUsercontainerrolesMemberships
}


export interface ContainersUsercontainerrolesMemberships {
    [key: number]: string
}

export interface selectedContainerWithPermission {
    name: string
    container_id: number
    permission_level: string
    readonly?: boolean
}
