// INDEX PARAMS
import { GenericValidationError } from '../../generic-responses';
import { GenericIdAndName } from '../../generic.interfaces';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../containers/containers.interface';
import { UsersIndexContainer, UsersIndexUsercontainerrole } from '../users/users.interface';

/**** Index ****/

export interface UsercontainerrolesIndex extends PaginateOrScroll {
    all_usercontainerroles: Usercontainerrole[]
    _csrfToken: string
}

export interface Usercontainerrole {
    id: number
    name: string
    users: UsercontainerroleUser[]
    containers: Container[]
    _matchingData: UsercontainerroleMatchingData
    allow_edit: boolean
}

export interface UsercontainerroleUser {
    id: number
    name: string
    full_name: string
    _joinData: {
        id: number
        user_id: number
        usercontainerrole_id: number
        through_ldap: boolean
    }
    containers: UsersIndexContainer[]
    usercontainerroles: UsersIndexUsercontainerrole[]
}

export interface UsercontainerroleMatchingData {
    ContainersUsercontainerrolesMemberships: {
        Containers: Container
        ContainersUsercontainerrolesMemberships: {
            id: number
            usercontainerrole_id: number
            container_id: number
            permission_level: number
        }
    }
}

export interface UsercontainerrolesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Usercontainerroles.id][]': number[],
    'filter[Usercontainerroles.name]': string
}


export function getUsercontainerrolesIndexParams(): UsercontainerrolesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Usercontainerroles.name',
        page: 1,
        direction: 'asc',
        'filter[Usercontainerroles.id][]': [],
        'filter[Usercontainerroles.name]': ''
    }
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

export interface UsercontainerrolesPost {
    id?: number
    name: string
    ldapgroups: {
        _ids: number[]
    },
    containers?: {
        _ids: number[]
    },
    ContainersUsercontainerrolesMemberships: ContainersUsercontainerrolesMemberships
}

export interface ContainersUsercontainerrolesMemberships {
    [key: number]: number
}

export interface SelectedContainerWithPermission {
    name: string
    container_id: number
    permission_level: number
    readonly?: boolean
}

export interface UsercontainerrolesGet {
    usercontainerrole: UsercontainerrolesPost
}
