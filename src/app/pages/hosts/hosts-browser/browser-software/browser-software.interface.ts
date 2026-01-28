import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ViewLinuxPackageHost } from '../../../packages/packages.interface';

export interface BrowserSoftwareLinuxHostRoot extends PaginateOrScroll {
    all_packages_linux: BrowserSoftwareLinuxHostAllPackagesLinux[]
    _csrfToken: string
}

export interface BrowserSoftwareLinuxHostAllPackagesLinux extends ViewLinuxPackageHost {
    packages_linux: {
        id: number
        name: string
        description: string
    }
}

export interface BrowserSoftwareLinuxParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[PackagesLinux.name]': string
    'filter[PackagesLinux.description]': string
    'filter[PackagesLinuxHosts.current_version]': string
    'filter[PackagesLinuxHosts.available_version]': string
    'filter[PackagesLinuxHosts.needs_update]': string | boolean
    'filter[PackagesLinuxHosts.is_security_update]': string | boolean
}

export function getDefaultBrowserSoftwareLinuxParams(): BrowserSoftwareLinuxParams {
    return {
        scroll: true,
        sort: 'PackagesLinux.name',
        page: 1,
        direction: 'asc',
        'filter[PackagesLinux.name]': '',
        'filter[PackagesLinux.description]': '',
        'filter[PackagesLinuxHosts.current_version]': '',
        'filter[PackagesLinuxHosts.available_version]': '',
        'filter[PackagesLinuxHosts.needs_update]': '',
        'filter[PackagesLinuxHosts.is_security_update]': '',
    }
}

export interface BrowserSoftwareWindowsUpdateHostRoot extends PaginateOrScroll {
    all_windows_updates: BrowserSoftwareWindowsHostAllWindowsUpdate[]
    _csrfToken: string
}

export interface BrowserSoftwareWindowsHostAllWindowsUpdate {
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
        update_id: string
    }
    Hosts: {
        id: number
        name: string
    }
}

export interface BrowserSoftwareWindowsUpdateParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[WindowsUpdates.name]': string
    'filter[WindowsUpdates.description]': string
    'filter[WindowsUpdates.kbarticle_ids]': string
    'filter[WindowsUpdates.update_id]': string
    'filter[WindowsUpdatesHosts.is_security_update]': string | boolean
}

export function getDefaultBrowserSoftwareWindowsUpdateParams(): BrowserSoftwareWindowsUpdateParams {
    return {
        scroll: true,
        sort: 'WindowsUpdates.name',
        page: 1,
        direction: 'asc',
        'filter[WindowsUpdates.name]': '',
        'filter[WindowsUpdates.description]': '',
        'filter[WindowsUpdates.kbarticle_ids]': '',
        'filter[WindowsUpdates.update_id]': '',
        'filter[WindowsUpdatesHosts.is_security_update]': '',
    }
}

export interface BrowserSoftwareWindowsAppHostRoot extends PaginateOrScroll {
    all_windows_apps: BrowserSoftwareWindowsHostAllWindowsApp[]
    _csrfToken: string
}

export interface BrowserSoftwareWindowsHostAllWindowsApp {
    id: number
    windows_app_id: number
    host_id: number
    version: string
    created: string
    modified: string
    windows_app: {
        id: number
        name: string
        publisher: string
        created: string
        modified: string
    }
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface BrowserSoftwareWindowsAppParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[WindowsApps.name]': string
    'filter[WindowsApps.publisher]': string
    'filter[WindowsAppsHosts.version]': string
}

export function getDefaultBrowserSoftwareWindowsAppParams(): BrowserSoftwareWindowsAppParams {
    return {
        scroll: true,
        sort: 'WindowsApps.name',
        page: 1,
        direction: 'asc',
        'filter[WindowsApps.name]': '',
        'filter[WindowsApps.publisher]': '',
        'filter[WindowsAppsHosts.version]': ''
    }
}
