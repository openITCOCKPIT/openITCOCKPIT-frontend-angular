import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: UserDateformat[]
    defaultDateFormat: string,
    timezones: UserTimezonesSelect[],
    serverTime: string,
    serverTimeZone: string
}

export interface LoadUsersByContainerIdRoot {
    users: UserByContainer[]
}

export interface UserByContainer {
    key: number
    value: string
}

export interface UserDateformat {
    key: string
    value: string
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

export interface LoadUsersByContainerIdPost {
    containerIds: number[]
}


// INDEX
export interface UsersIndexRoot extends PaginateOrScroll {
    all_users: User[]
    isLdapAuth: boolean
    myUserId: number
}

export interface User {
    id: number
    email: string
    company: any
    phone?: string
    is_active: boolean
    samaccountname: any
    is_oauth: boolean
    last_login?: string
    full_name: string
    usercontainerroles: any[]
    containers: {
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
    }[]
    usergroup: {
        id: number
        name: string
    }
    allow_edit: boolean
    UserTypes: UserType[]
}

export interface UsersIndexParams {
    angular: boolean
    direction: 'asc' | 'desc' | '', // asc or desc
    page: number
    scroll: boolean
    sort: string
    'filter[Users.company]': string
    'filter[Users.email]': string
    'filter[Users.phone]': string
    'filter[full_name]': string
    'filter[Users.usergroup_id][]': number[]
}

export function getDefaultUsersIndexParams(): UsersIndexParams {
    return {
        angular: true,
        direction: 'asc',
        page: 1,
        scroll: true,
        sort: 'full_name',
        'filter[Users.company]': '',
        'filter[Users.email]': '',
        'filter[Users.phone]': '',
        'filter[full_name]': '',
        'filter[Users.usergroup_id][]': []
    }
}

// ADD
export interface UsersAddRoot {
    User: CreateUser
}

export interface CreateUser {
    apikeys: Apikey[]
    company: string
    confirm_password: string | undefined
    ContainersUsersMemberships: {
        [key: string]: number;
    }
    dashboard_tab_rotation: number
    dateformat: string
    email: string
    firstname: string
    i18n: string
    is_active: number
    is_oauth: number
    lastname: string
    paginatorlength: number
    password: string | undefined
    phone: string
    position: string
    recursive_browser: number
    showstatsinmenu: number
    timezone: string
    usercontainerroles: {
        _ids: number[]
    }
    usergroup_id: number
}

export interface CreateLdapUser extends CreateUser {
    ldap_dn: string
    samaccountname: string
    usercontainerroles_ldap: {
        _ids: number[]
    }
}

export interface EditUser extends CreateUser {
    id: number
    containers: {
        _ids: number[]
    }
    usercontainerroles_containerids: {
        _ids: number[]
    }
    ldap_dn: string
    samaccountname: string
    usercontainerroles_ldap: {
        _ids: number[]
    }
}

export interface UserType {
    title: string
    color: ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark')
    class: string
}

export interface EditUserGet {
    user: EditUser,
    isLdapUser: boolean,
    UserTypes: UserType[],
    notPermittedContainerIds: number[]
}

export interface UpdateUser {
    User: EditUser
}

export interface AddFromLdapRoot {
    User: CreateLdapUser
}


export interface Apikey {
    apikey: string
    description: string
    last_use: string | null
}

// LoadContainerRoles
export interface LoadContainerRolesRequest {
    angular: boolean
    'filter[Usercontainerroles.name]': string
    selected: number[]
}

export interface LoadContainerRolesRoot {
    usercontainerroles: SelectKeyValue[]
    _csrfToken: string
}

// LoadUsergroups
export interface LoadUsergroupsRoot {
    usergroups: SelectKeyValue[]
    _csrfToken: string
}

// LoadContainerPermissions
export interface LoadContainerPermissionsRequest {
    angular: boolean
    'usercontainerRoleIds[]': number[]
}

export interface LoadContainerPermissionsRoot {
    userContainerRoleContainerPermissions: UserContainerRoleContainerPermissions
    _csrfToken: string
}

export interface UserContainerRoleContainerPermissions {
    [key: string]: {
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
        user_roles: {
            [key: string]: {
                id: number
                name: string
            }
        }
    }
}

// LoadLdapUserByString
export interface LoadLdapUserByStringRoot {
    ldapUsers: LdapUser[]
    _csrfToken: string
}

export interface LdapUser {
    givenname: string
    sn: string
    samaccountname: string
    email: string
    dn: string
    memberof: any[]
    display_name: string
}

// LoadLdapUserDetails
export interface LoadLdapUserDetailsRoot {
    ldapUser: LdapUserDetails
    _csrfToken: string
}

export interface LdapUserDetails {
    givenname: string
    sn: string
    samaccountname: string
    email: string
    dn: string
    memberof: string[]
    display_name: string
    ldapgroups: {
        id: number
        cn: string
        dn: string
        description: string
    }[]
    userContainerRoleContainerPermissionsLdap: {
        [key: string]: {
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
            user_roles: {
                [key: string]: {
                    id: number
                    name: string
                }
            }
        }
    }
    usergroupLdap: {
        id: number
        name: string
        description: string
        created: string
        modified: string
    },
    ldapgroupIds: number[]
}

// LOGIN
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
    customLoginBackgroundHtml: string
    isCustomLoginBackground: boolean,
    disableAnimation: boolean
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
