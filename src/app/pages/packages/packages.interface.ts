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
