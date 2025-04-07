import { SelectKeyValue, SelectKeyValueString } from '../../layouts/primeng/select.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

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
 *    Login action    *
 **********************/
export interface LoginGetRoot {
    _csrfToken: string
    images: {
        description: string
        particles: string
        images: LoginImage[]
    }
    hasValidSslCertificate: boolean
    logoUrl: string
    isLoggedIn: boolean
    isSsoEnabled: boolean
    forceRedirectSsousersToLoginScreen: boolean
    errorMessages: any[]
    successMessages: any[]
    customLoginBackgroundHtml: string
    isCustomLoginBackground: boolean,
    disableAnimation: boolean,
    disableSocialButtons: boolean,
    enableColumnLayout: boolean
}

export interface LoginImage {
    image: string
    credit: string
}

export interface LoadContainersResponse {
    containers: SelectKeyValue[]
    containerIdsWithWritePermissions: number[]
}

export interface UserIdAndUsername {
    id: number;
    username: string;
}

/**********************
 *    Index action    *
 **********************/

export interface UsersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[full_name]': string,
    'filter[Users.email]': string,
    'filter[Users.phone]': string,
    'filter[Users.usergroup_id]': number[],
    'filter[Users.company]': string,
}

export function getDefaultUsersIndexParams(): UsersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[full_name]': '',
        'filter[Users.email]': '',
        'filter[Users.phone]': '',
        'filter[Users.usergroup_id]': [],
        'filter[Users.company]': '',
    }
}

export interface UsersIndexRoot extends PaginateOrScroll {
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
