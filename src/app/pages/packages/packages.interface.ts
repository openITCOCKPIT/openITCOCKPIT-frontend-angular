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
    package_linux_hosts: PackageLinuxHost[]
    cumulated_status: number
}

export interface PackageLinuxHost {
    package_linux_id: number
    needs_update: boolean
    is_security_update: boolean
    is_patch: boolean
    id: number
    name: string
}

export interface PackagesLinuxParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Packages.id][]': [],
    'filter[Packages.name]': string
    'filter[Packages.description]': string
}

export function getDefaultPackagesLinuxParams(): PackagesLinuxParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Packages.name',
        page: 1,
        direction: 'asc',
        'filter[Packages.id][]': [],
        'filter[Packages.name]': '',
        'filter[Packages.description]': ''
    }
}
