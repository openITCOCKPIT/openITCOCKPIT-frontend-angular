import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ViewLinuxPackageHost } from '../../../packages/packages.interface';

export interface BrowserSoftwareInterface {
}

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
