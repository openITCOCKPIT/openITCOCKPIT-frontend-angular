import { SelectKeyValue, SelectKeyValueString } from '../../layouts/primeng/select.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { PermissionLevel } from '../users/permission-level';
import { GenericIdAndName } from '../../generic.interfaces';

/****************************
 *    Generic interfaces    *
 ****************************/

export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: SelectKeyValueString[]
    defaultDateFormat: string,
    timezones: UserTimezonesSelect[],
    serverTime: string,
    serverTimeZone: string
}

export interface LoadUsersByContainerIdRoot {
    users: SelectKeyValue[]
}

export interface UserTimezoneGroup {
    // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    [key: string]: UserTimezone
}

export interface UserTimezone {
    // Africa/Abidjan: Abidjan
    [key: string]: string
}

export interface UserTimezonesSelect {
    group: string // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    value: string // Africa/Abidjan
    name: string // Abidjan
}

export interface UserType {
    title: string
    color: ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark')
    class: string
}

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
    all_users: AllUser[]
    myUserId: number
    isLdapAuth: boolean
    _csrfToken: string
}

export interface AllUser {
    id: number
    email: string
    company?: string
    phone?: string
    is_active: boolean
    samaccountname?: string
    is_oauth: boolean
    last_login?: string
    full_name: string
    usercontainerroles: UsersIndexUsercontainerrole[]
    containers: UsersIndexUserContainer
    usergroup: {
        id: number
        name: string
    }
    allow_edit: boolean
    UserTypes: UserType[]
}

export interface UsersIndexUsercontainerrole {
    id: number
    name: string
    _joinData: {
        id: number
        user_id: number
        usercontainerrole_id: number
        through_ldap: boolean
    }
    containers: UsersIndexContainer[]
}

export interface UsersIndexContainer {
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
}

export interface UsersIndexUserContainer {
    id: number
    containertype_id: number
    name: string
    parent_id?: number
    lft: number
    rght: number
    _joinData: {
        id: number
        user_id: number
        container_id: number
        permission_level: number
    }
}

/**********************
 *    Add action    *
 **********************/
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
    containers?: { // Edit only
        _ids: number[]
    }
    usergroup_id: number
    LdapImportSettingsToContainers: {
        [key: number]: PermissionLevel
    }
    ldapgroups: {
        _ids: any[]
    }
}

export interface UserAddContainerRolePermission {
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
        permission_level: PermissionLevel
    }
    path: string,

    // Server response this as hahmap
    user_roles: {
        [key: string]: GenericIdAndName
    }

    // we use the array version in the Frontend to make Angular happy
    user_roles_array?: GenericIdAndName[]
}

export interface UserDefaultTemplatesContainerPermission {
    container_id: number,
    container_name: string,
    permission_level: PermissionLevel
}

export interface UserDefaultTemplatesEditResponse {
    user: UserDefaultTemplatesPost
    UserTypes: UserType[]
    notPermittedContainerIds: number[]
    userContainerRolesReadonly: boolean
}
