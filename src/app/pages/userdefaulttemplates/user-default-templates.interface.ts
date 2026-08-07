import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { PermissionLevel } from '../users/permission-level';
import { UsersIndexContainer, UsersIndexUserContainer } from '../users/users.interface';

/**********************
 *    Index action    *
 **********************/

export interface UserDefaultTemplatesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[UserDefaultTemplates.name]': string,
    'filter[UserDefaultTemplates.description]': string,
    'filter[UserDefaultTemplates.usergroup_id][]': number[],
}

export function getDefaultUserDefaultTemplatesIndexParams(): UserDefaultTemplatesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'UserDefaultTemplates.name',
        page: 1,
        direction: 'asc',
        'filter[UserDefaultTemplates.name]': '',
        'filter[UserDefaultTemplates.description]': '',
        'filter[UserDefaultTemplates.usergroup_id][]': [],
    }
}

export interface UserDefaultTemplatesIndexRoot extends PaginateOrScroll {
    all_userdefaulttemplates: AllUserdefaulttemplate[]
    _csrfToken: string
}

export interface AllUserdefaulttemplate {
    id: number
    name: string
    description: string
    is_oauth: boolean
    containers: UsersIndexUserContainer
    usergroup: {
        id: number
        name: string
    }
    allow_edit: boolean
}

/***************************
 *    Add / Edit action    *
 ***************************/
export interface UserDefaultTemplatesPost {
    id?: number
    name: string
    description: string
    dateformat: string
    timezone: string
    i18n: string
    is_oauth: boolean  // (number for add but boolean for edit)
    showstatsinmenu: 0 | 1
    paginatorlength: number
    dashboard_tab_rotation: number
    recursive_browser: 0 | 1
    containers: {
        _ids: number[]
    }
    usercontainers: { // Edit only
        _ids: number[]
    }
    usergroup_id: number
    UserDefaultTemplatesToUserContainers: {
        [key: number]: PermissionLevel
    }
    ldapgroups: {
        _ids: number[]
    }
    ContainersUsersMemberships: {
        [key: number]: PermissionLevel
    }
}

export interface UserDefaultTemplatesPost {
    id?: number
    showstatsinmenu: 0 | 1
    paginatorlength: number
    dashboard_tab_rotation: number
    recursive_browser: 0 | 1
    dateformat: string
    timezone: string
    i18n: string
    is_oauth: boolean  // (number for add but boolean for edit)
    ldapgroups: {
        _ids: number[]
    }
    containers: { // Edit only
        _ids: number[]
    }
    usergroup_id: number
    ContainersUsersMemberships: {
        [key: number]: PermissionLevel
    }
}

export interface UserDefaultTemplatesEditResponse {
    userDefaultTemplate: UserDefaultTemplatesPost
    notPermittedUserContainerIds: number[]
}

export interface UsercontainerrolesByLdapGroupResponse {
    usercontainerrolesByLdapGroup: UsercontainerrolesByLdapGroup[]
}


export interface UsercontainerrolesByLdapGroup {
    key: number
    value: {
        id: number
        cn: string
        dn: string
        containerroles: LdapUserContainerRoles[]
    }
}

export interface LdapUserContainerRoles {
    id: number
    name: string
    containerPermissions: {
        id: number
        name: string
        containers: LdapContainerRoleContainer[]
    }

}


export interface LdapContainerRoleContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: {
        id: number
        usercontainerrole_id: number
        container_id: number
        permission_level: number
    }
    path: string
}
