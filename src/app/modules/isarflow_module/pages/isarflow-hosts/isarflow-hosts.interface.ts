import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { IsarFlowTabs } from '../../components/isar-flow-host-browser-tab/isar-flow-tabs.enum';


/**********************
 *    Index action    *
 **********************/
export interface IsarflowHostsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[IsarflowHosts.hostname]': string
    'filter[IsarflowHosts.description]': string
    'filter[IsarflowHosts.ipaddress]': string
    'filter[IsarflowInterfaces.interface_name]': string
}

export function getDefaultIsarflowHostsIndexParams(): IsarflowHostsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'IsarflowHosts.hostname',
        page: 1,
        direction: 'asc',
        'filter[IsarflowHosts.hostname]': "",
        'filter[IsarflowHosts.description]': "",
        'filter[IsarflowHosts.ipaddress]': "",
        'filter[IsarflowInterfaces.interface_name]': "",
    }
}

export interface IsarflowHostsIndexRoot extends PaginateOrScroll {
    isarflowHosts: IsarflowHost[]
    _csrfToken: string
}

export interface IsarflowHost {
    id: number
    host_id: number
    description: string
    hostname: string
    ipaddress: string
    created: string
    modified: string
    isarflow_interfaces: IsarflowInterface[]

    host: {
        id: number
        name: string
        disabled: number
    }
}

export interface IsarflowInterface {
    id: number
    isarflow_host_id: number
    interface_name: string
    created: string
    modified: string
}

/**********************
 *   Browser action   *
 **********************/

export interface IsarFlowHostInformationResponse {
    isarflowHost: {
        id: number
        host_id: number
        description: string
        hostname: string
        ipaddress: string
        created: string
        modified: string
        isarflow_interfaces: IsarflowInterface[]

    }
    _csrfToken: null | string
}

export interface IsarFlowInterfaceInformationResponse {
    isarFlowInterfaceInformation: {
        id: number
        isarflow_host_id: number
        interface_name: string
        created: string
        modified: string
        isarflow_host: {
            id: number
            host_id: number
            description: string
            hostname: string
            ipaddress: string
            created: string
            modified: string
        }
    },
    urls: {
        [key in IsarFlowTabs]: string
    }
}