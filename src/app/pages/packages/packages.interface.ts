import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

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
    'filter[PackagesLinux.id][]': [],
    'filter[PackagesLinux.name]': string
    'filter[PackagesLinux.description]': string
}

export function getDefaultPackagesLinuxParams(): PackagesLinuxParams {
    return {
        angular: true,
        scroll: true,
        sort: 'PackagesLinux.name',
        page: 1,
        direction: 'asc',
        'filter[PackagesLinux.id][]': [],
        'filter[PackagesLinux.name]': '',
        'filter[PackagesLinux.description]': ''
    }
}
