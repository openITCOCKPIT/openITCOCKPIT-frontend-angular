import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Index action    *
 **********************/
export interface PackagesLinuxRoot extends PaginateOrScroll {
    all_packages_linux: AllPackagesLinux[]
    _csrfToken: string
}

export interface PackagesTotalSummary {
    total: number
    outdated: number
    security: number
    outdated_hosts: number
    security_hosts: number
    windows: PackagesSummary
    macos: PackagesSummary
    linux: PackagesSummary
}


export interface PackagesSummary {
    totalPackages: number
    upToDate: number
    updatesAvailable: number
    securityUpdates: number
    totalInstallations: number
    allHosts: number[]
    hostsUpToDate: number[]
    hostsWithUpdates: number[]
    hostsWithSecurityUpdates: number[]
}


export interface AllPackagesLinux {
    id: number
    name: string
    description: string
    is_patch: boolean
    created: string
    modified: string
    cumulated_status: number
    all_hosts: number[]
    hosts_needs_update: number[]
    hosts_needs_security_update: number[]
}

export interface PackagesLinuxParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[PackagesLinux.id][]': number[],
    'filter[PackagesLinux.name]': string
    'filter[PackagesLinux.description]': string
    'filter[available_updates]': number | string
    'filter[available_security_updates]': number | string
}

/***************************
 *    view_linux action    *
 ***************************/
export interface PackagesViewLinuxRoot extends PaginateOrScroll {
    package: ViewLinuxPackage
    all_host_packages: ViewLinuxPackageHost[]
}

export interface ViewLinuxPackage {
    id: number
    name: string
    description: string
    is_patch: boolean
    created: string
    modified: string
}

export interface ViewLinuxPackageHost {
    id: number
    package_linux_id: number
    host_id: number
    current_version: string
    available_version: string
    needs_update: boolean
    is_security_update: boolean
    is_patch: boolean
    created: string
    modified: string
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface PackagesViewLinuxParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[PackagesLinuxHosts.current_version]': string
    'filter[PackagesLinuxHosts.available_version]': string
    'filter[PackagesLinuxHosts.needs_update]': string | boolean
    'filter[PackagesLinuxHosts.is_security_update]': string | boolean
}

export function getDefaultPackagesViewLinuxParams(): PackagesViewLinuxParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[PackagesLinuxHosts.current_version]': '',
        'filter[PackagesLinuxHosts.available_version]': '',
        'filter[PackagesLinuxHosts.needs_update]': '',
        'filter[PackagesLinuxHosts.is_security_update]': '',
    }
}

/************************
 *    Windows action    *
 ************************/

export interface PackagesWindowsAppsParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[WindowsApps.id][]': number[]
    'filter[WindowsApps.name]': string
    'filter[WindowsApps.publisher]': string
}

export function getDefaultPackagesWindowsAppsParams(): PackagesWindowsAppsParams {
    return {
        scroll: true,
        sort: 'WindowsApps.name',
        page: 1,
        direction: 'asc',
        'filter[WindowsApps.id][]': [],
        'filter[WindowsApps.name]': '',
        'filter[WindowsApps.publisher]': ''
    }
}

export interface PackagesWindowsAppsRoot extends PaginateOrScroll {
    all_windows_apps: AllWindowsApp[]
}

export interface AllWindowsApp {
    id: number
    name: string
    publisher: string
    created: string
    modified: string
    all_hosts: number[]
}

/*****************************
 *    view_windows action    *
 *****************************/

export interface PackagesViewWindowAppRoot extends PaginateOrScroll {
    app: ViewWindowsApp
    all_host_apps: ViewWindowsHostApp[]
}

export interface ViewWindowsApp {
    id: number
    name: string
    publisher: string
    created: string
    modified: string
}

export interface ViewWindowsHostApp {
    id: number
    windows_app_id: number
    host_id: number
    version: string
    created: string
    modified: string
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface PackagesWindowsAppParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[WindowsAppsHosts.version]': string
}

export function getDefaultPackagesWindowsAppParams(): PackagesWindowsAppParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[WindowsAppsHosts.version]': '',
    }
}


/**********************
 *    Macos action    *
 **********************/

export interface PackagesMacosAppsParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[MacosApps.id][]': number[]
    'filter[MacosApps.name]': string
    'filter[MacosApps.description]': string
}

export function getDefaultPackagesMacosAppsParams(): PackagesMacosAppsParams {
    return {
        scroll: true,
        sort: 'MacosApps.name',
        page: 1,
        direction: 'asc',
        'filter[MacosApps.id][]': [],
        'filter[MacosApps.name]': '',
        'filter[MacosApps.description]': ''
    }
}

export interface PackagesMacosAppsRoot extends PaginateOrScroll {
    all_macos_apps: AllMacosApp[]
}

export interface AllMacosApp {
    id: number
    name: string
    description: string
    created: string
    modified: string
    all_hosts: number[]
}

/***************************
 *    view_macos action    *
 ***************************/

export interface PackagesViewMacosAppRoot extends PaginateOrScroll {
    app: ViewMacosApp
    all_host_apps: ViewMacosHostApp[]
}

export interface ViewMacosApp {
    id: number
    name: string
    description: string
    created: string
    modified: string
}

export interface ViewMacosHostApp {
    id: number
    macos_app_id: number
    host_id: number
    version: string
    created: string
    modified: string
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface PackagesMacosAppParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[MacosAppsHosts.version]': string
}

export function getDefaultPackagesMacosAppParams(): PackagesMacosAppParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[MacosAppsHosts.version]': '',
    }
}

/********************************
 *    windows_updates action    *
 ********************************/
export interface PackagesWindowsUpdatesParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[WindowsUpdates.id][]': number[],
    'filter[WindowsUpdates.name]': string,
    'filter[WindowsUpdates.description]': string,
    'filter[WindowsUpdates.kbarticle_ids]': string,
    'filter[WindowsUpdates.update_id]': string,
    'filter[available_updates]': number | string
    'filter[available_security_updates]': number | string
}

export function getDefaultPackagesWindowsUpdatesParams(): PackagesWindowsUpdatesParams {
    return {
        scroll: true,
        sort: 'WindowsUpdates.name',
        page: 1,
        direction: 'asc',
        'filter[WindowsUpdates.id][]': [],
        'filter[WindowsUpdates.name]': '',
        'filter[WindowsUpdates.description]': '',
        'filter[WindowsUpdates.kbarticle_ids]': '',
        'filter[WindowsUpdates.update_id]': '',
        'filter[available_updates]': '',
        'filter[available_security_updates]': ''
    }
}

export interface PackagesWindowsUpdatesRoot extends PaginateOrScroll {
    all_windows_updates: AllWindowsUpdate[]
    _csrfToken: string
}

export interface AllWindowsUpdate {
    id: number
    name: string
    description: string
    kbarticle_ids: string[]
    update_id: string
    created: string
    modified: string
    available_updates: number
    available_security_updates: number
    all_hosts: number[]
    hosts_needs_update: number[]
    hosts_needs_security_update: number[]
}

/************************************
 *    view_windows_update action    *
 ************************************/

export interface PackagesViewWindowsUpdateParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[WindowsUpdatesHosts.is_security_update]': string | number
    'filter[WindowsUpdatesHosts.reboot_required]': string | number
}

export function getDefaultPackagesViewWindowsUpdateParams(): PackagesViewWindowsUpdateParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[WindowsUpdatesHosts.is_security_update]': '',
        'filter[WindowsUpdatesHosts.reboot_required]': '',
    }
}


export interface PackagesViewWindowsUpdateRoot extends PaginateOrScroll {
    all_host_updates: AllWindowsHostUpdate[]
    update: PackagesWindowsUpdate
    _csrfToken: string
}

export interface AllWindowsHostUpdate {
    id: number
    windows_update_id: number
    host_id: number
    reboot_required: boolean
    is_security_update: boolean
    created: string
    modified: string
    windows_update: {
        name: string
        description: string
        kbarticle_ids: string[]
    }
    Hosts: {
        id: number
        name: string
    }
}

export interface PackagesWindowsUpdate {
    id: number
    name: string
    description: string
    kbarticle_ids: string[],
    update_id: string
    created: string
    modified: string
}


/******************************
 *    macos_updates action    *
 ******************************/
export interface PackagesMacosUpdatesParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[MacosUpdates.id][]': number[],
    'filter[MacosUpdates.name]': string,
    'filter[MacosUpdates.description]': string,
    'filter[MacosUpdates.version]': string,
    'filter[available_updates]': number | string
}

export function getDefaultPackagesMacosUpdatesParams(): PackagesMacosUpdatesParams {
    return {
        scroll: true,
        sort: 'MacosUpdates.name',
        page: 1,
        direction: 'asc',
        'filter[MacosUpdates.id][]': [],
        'filter[MacosUpdates.name]': '',
        'filter[MacosUpdates.description]': '',
        'filter[MacosUpdates.version]': '',
        'filter[available_updates]': '',
    }
}

export interface PackagesMacosUpdatesRoot extends PaginateOrScroll {
    all_macos_updates: AllMacosUpdate[]
    _csrfToken: string
}

export interface AllMacosUpdate {
    id: number
    name: string
    description: string
    version: string
    created: string
    modified: string
    available_updates: number
    all_hosts: number[]
    hosts_needs_update: number[]
}


/**********************************
 *    view_macos_update action    *
 **********************************/

export interface PackagesViewMacosUpdateParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
}

export function getDefaultPackagesViewMacosUpdateParams(): PackagesViewMacosUpdateParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': ''
    }
}


export interface PackagesViewMacosUpdateRoot extends PaginateOrScroll {
    all_host_updates: AllMacosHostUpdate[]
    update: PackagesMacosUpdate
    _csrfToken: string
}

export interface AllMacosHostUpdate {
    id: number
    macos_update_id: number
    host_id: number
    created: string
    modified: string
    macos_update: {
        name: string
        description: string
        version: string
    }
    Hosts: {
        id: number
        name: string
    }
}

export interface PackagesMacosUpdate {
    id: number
    name: string
    description: string
    version: string
    created: string
    modified: string
}
